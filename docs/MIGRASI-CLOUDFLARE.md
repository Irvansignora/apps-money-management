# Migrasi penuh ke Cloudflare

Kondisi sebelum migrasi:

- **Frontend** `kakeibo.iranza.com` di GitHub Pages (file `CNAME`).
- **Backend** `chat.iranza.com` sudah Worker `kakeibo-chat` + D1 + Durable Object, tapi
  source-nya **tidak ada di Git** (hanya di dashboard) dan semua foto/voice/story disimpan
  sebagai base64 di dalam D1 (boros, D1 maksimal 10 GB, tiap baca mahal).
- Data keuangan hanya di `localStorage` HP; backup cuma lewat file manual.

Setelah migrasi:

- Frontend dilayani Worker `kakeibo-web` (Static Assets): CDN global, header cache/security
  dari `apps/web/public/_headers`, deploy otomatis dari GitHub.
- Source backend ada di `apps/api` (direkonstruksi dari Worker live, perilaku sama) dan
  di-deploy dari Git.
- File biner pindah ke **R2** `kakeibo-storage`. Baris lama tetap terbaca dari D1, lalu
  dipindah otomatis oleh cron (100 per hari) atau manual lewat endpoint admin.
- **Cloud Backup** baru: menu *Backup & Restore* → "Backup ke Cloud" (R2), bisa dipulihkan
  di HP baru setelah login. Free simpan 3 terakhir, Premium 15, Premium+ 30.
- **Cron harian** membersihkan sesi/tiket/OTP kedaluwarsa, story lama + file R2-nya, dan
  penghitung kuota lama.
- **Terjemahan Kartu Keluarga → Jepang** (menu 🪪): isi manual atau Scan AI (Premium+, `kind: "kk"`),
  hasil dokumen A4 「家族関係証明書（家族カード）翻訳文」 dengan pernyataan penerjemah, untuk lampiran
  親族関係書類 klaim tanggungan (扶養控除) saat nenmatsu chōsei / kakutei shinkoku. Data KK hanya di HP.
- Endpoint `GET /api/health` untuk cek cepat (menampilkan apakah R2 aktif).

Kontrak API ke frontend **tidak berubah** (upload masih base64 JSON), jadi aplikasi yang
sudah ter-install di HP pengguna tetap jalan selama dan sesudah migrasi.

---

## Langkah 0 — Persiapan (sekali)

```bash
npm install
npx wrangler login            # atau set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
```

Buat API token (dash → My Profile → API Tokens → *Edit Cloudflare Workers* template) dengan izin:
Workers Scripts Edit, Workers Routes Edit, D1 Edit, Workers R2 Storage Edit, Account Settings Read.
Simpan di GitHub repo → Settings → Secrets → Actions sebagai `CLOUDFLARE_API_TOKEN` dan
`CLOUDFLARE_ACCOUNT_ID`.

## Langkah 1 — Buat bucket R2 (lokasi Asia-Pasifik)

```bash
npm run r2:create -w apps/api
# = wrangler r2 bucket create kakeibo-storage --location apac
#   + lifecycle: objek di stories/ otomatis dihapus setelah 3 hari (cadangan untuk cron)
```

## Langkah 2 — Migrasi skema D1

```bash
npm run db:migrate
```

`0001_initial.sql` berisi skema produksi saat ini dengan `IF NOT EXISTS` (aman, tidak
mengubah data). `0002_r2_backups.sql` menambah tabel `backups` dan satu index.
Sebelumnya, ambil cadangan dulu: `npx wrangler d1 export kakeibo-chat --remote --output backup-d1.sql`.

## Langkah 3 — Deploy backend (`kakeibo-chat`)

```bash
npx wrangler deploy --dry-run -c apps/api/wrangler.jsonc --env=""   # cek binding
npm run deploy:api
curl https://chat.iranza.com/api/health        # → {"ok":true,"r2":true}
```

Catatan penting:

- `keep_vars: true` → variabel biasa yang sudah diatur di dashboard (ALLOWED_ORIGIN, MAIL_FROM,
  AI_MODEL, FREE_QUOTA, dll.) **tidak** dihapus. Secret (OPENAI_API_KEY, RESEND_API_KEY,
  OTP_PEPPER, VAPID_PRIVATE_JWK, ADMIN_KEY, TURN_*) juga tidak tersentuh.
- Durable Object `ChatRoom` dideklarasikan dengan `exports` (format baru, tanpa tag migrasi).
  Cloudflare mencocokkannya dengan namespace yang sudah ada, riwayat chat tetap.
  Kalau deploy gagal dengan pesan storage tidak cocok, ubah `"storage": "sqlite"` menjadi
  `"legacy-kv"` di `apps/api/wrangler.jsonc` lalu deploy lagi.
- Rollback: dashboard → Workers → kakeibo-chat → Deployments → pilih versi sebelumnya.
  Kode baru tetap bisa membaca data lama, dan file yang sudah di R2 tetap ada.

## Langkah 4 — Pindahkan media lama D1 → R2

Otomatis lewat cron (100 file/hari). Untuk mempercepat:

```bash
curl -X POST https://chat.iranza.com/api/admin/r2/migrate \
  -H "x-admin-key: $ADMIN_KEY" -H "content-type: application/json" -d '{"limit":200}'
# ulangi sampai "left": 0
```

## Langkah 5 — Deploy frontend (`kakeibo-web`) dan pindah domain dari GitHub Pages

1. `npm run deploy:web` → cek di `https://kakeibo-web.<subdomain>.workers.dev`.
2. Di repo lama (GitHub Pages): Settings → Pages → hapus custom domain `kakeibo.iranza.com`
   (atau matikan Pages).
3. Di Cloudflare DNS zona `iranza.com`: hapus record `kakeibo` yang mengarah ke
   `*.github.io` (CNAME) / IP GitHub (A 185.199.108-111.153).
4. Deploy ulang `npm run deploy:web` — `custom_domain: true` di `apps/web/wrangler.jsonc`
   membuat record DNS + sertifikat otomatis. (Atau dashboard → kakeibo-web → Settings →
   Domains & Routes → Add Custom Domain.)
5. Cek: `curl -I https://kakeibo.iranza.com/` harus ada header `cf-ray` dan **tidak** ada
   `server: GitHub.com`.

Origin tetap `https://kakeibo.iranza.com`, jadi `localStorage` (data keuangan pengguna),
service worker, dan login **tidak hilang**. `ALLOWED_ORIGIN` backend tidak perlu diubah.

## Langkah 6 — Pindahkan repo

Repo ini adalah repo baru hasil clone `apps-money-management` dengan riwayat commit utuh.
Setelah domain pindah, repo lama boleh di-archive. Workflow `update-tsk.yml` sekarang ikut
pindah ke sini dan otomatis deploy ulang frontend tiap data TSK berubah.

---

## Ringkasan biaya (perkiraan, Workers Paid $5/bln)

| Layanan | Gratis termasuk | Pemakaian Kakeibo |
| --- | --- | --- |
| Workers + Static Assets | 10 jt request/bln; aset statis gratis | jauh di bawah |
| D1 | 25 mrd baris dibaca, 5 GB | lebih hemat setelah base64 keluar dari D1 |
| R2 | 10 GB, 1 jt tulis, 10 jt baca/bln, egress gratis | foto/voice/backup |
| Durable Objects | 1 jt request, 400 rb GB-s | chat |

## Ide lanjutan (belum dikerjakan)

- **Workers AI** untuk terjemahan/OCR murah sebagai fallback OpenAI/Anthropic.
- **AI Gateway** di depan OpenAI/Anthropic: cache, rate limit, log biaya.
- **Turnstile** di form OTP email untuk menahan bot.
- **Queues** untuk kirim push notification massal tanpa memperlambat chat.
- Avatar juga ke R2 (sekarang masih data URL kecil ≤24 KB di D1, ikut di respons kontak).
