# 帳簿 Kakeibo — iranza

Catatan keuangan kerja di Jepang (PWA) + chat lintas bahasa, AI scan, dan LEA Sensei.
Semuanya berjalan di **Cloudflare**:

| Bagian | Layanan Cloudflare | Domain |
| --- | --- | --- |
| Frontend PWA (`apps/web`) | Workers Static Assets (`kakeibo-web`) | `kakeibo.iranza.com` |
| Backend API + chat (`apps/api`) | Workers (`kakeibo-chat`) + Durable Objects (`ChatRoom`) | `chat.iranza.com` |
| Database akun, kontak, grup, kuota, backup | D1 `kakeibo-chat` | — |
| Foto/voice chat, story, cloud backup | R2 `kakeibo-storage` (lokasi APAC) | — |
| Bersih-bersih harian + migrasi media lama | Cron Trigger | — |
| Video/voice call | Realtime TURN | — |

```
apps/
  web/            frontend statis (public/) + wrangler.jsonc + _headers
  api/            backend Worker: src/index.js (inti), blob.js (R2), backup.js, cron.js
    migrations/   skema D1 (wrangler d1 migrations)
scripts/          generator data TSK (dijalankan GitHub Actions mingguan)
docs/             panduan migrasi
.github/workflows deploy otomatis ke Cloudflare + update TSK
```

## Dev lokal

```bash
npm install
npm run dev:api     # http://localhost:8787  — D1, R2, Durable Object lokal; kode OTP muncul di respons
npm run dev:web     # http://localhost:8788
```

Untuk mengarahkan frontend lokal ke API lokal, tambahkan sementara
`<script>window.KAKEIBO_CHAT_API = "http://localhost:8787"</script>` sebelum `modules/auth.js` di `apps/web/public/index.html`
(jangan di-commit).

## Deploy

Push ke `main` → GitHub Actions (`deploy.yml`) menjalankan migrasi D1 lalu deploy Worker yang berubah.
Manual: `npm run db:migrate && npm run deploy:api && npm run deploy:web`.

Langkah pindah dari GitHub Pages: **[docs/MIGRASI-CLOUDFLARE.md](docs/MIGRASI-CLOUDFLARE.md)**.
