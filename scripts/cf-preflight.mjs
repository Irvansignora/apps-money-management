// Pemeriksaan sebelum migrasi (dijalankan workflow migrate-cloudflare.yml, butuh CLOUDFLARE_API_TOKEN/ACCOUNT_ID).
// Tujuannya memastikan deploy Kakeibo tidak bentrok dengan Worker lain di akun (LEA, payroll, dll.):
//  - hostname kakeibo/chat tidak dipakai Worker lain,
//  - binding kakeibo-chat yang tidak dikenal tidak ikut terhapus oleh wrangler deploy,
//  - konfigurasi route & storage Durable Object disesuaikan dengan kondisi live.
// Keluar dengan kode 1 (workflow berhenti, belum ada yang diubah) kalau ada yang berisiko.
import fs from "node:fs";

const TOKEN = process.env.CLOUDFLARE_API_TOKEN, ACC = process.env.CLOUDFLARE_ACCOUNT_ID;
const ZONE = "iranza.com", WEB_HOST = "kakeibo.iranza.com", API_HOST = "chat.iranza.com";
const API_WORKER = "kakeibo-chat", WEB_WORKER = "kakeibo-web", D1_ID = "5a67cca0-92f2-4ee0-bed0-8bc4fdcd3abe";
const API_CFG = "apps/api/wrangler.jsonc";

const cf = async (path) => {
  const r = await fetch("https://api.cloudflare.com/client/v4" + path, { headers: { authorization: "Bearer " + TOKEN } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.success) throw new Error(path + " → " + r.status + " " + JSON.stringify(j.errors || j).slice(0, 300));
  return j.result;
};
const problems = [], notes = [];

const scripts = (await cf(`/accounts/${ACC}/workers/scripts`)).map((s) => s.id);
console.log("Worker di akun:", scripts.join(", "));
const zone = (await cf(`/zones?name=${ZONE}`))[0];
if (!zone) problems.push(`Zona ${ZONE} tidak terlihat oleh token (perlu izin Zone Read/DNS Edit).`);

// 1) siapa pemilik hostname sekarang
const domains = await cf(`/accounts/${ACC}/workers/domains`);
const routes = zone ? await cf(`/zones/${zone.id}/workers/routes`) : [];
console.log("Custom domain:", domains.map((d) => `${d.hostname}→${d.service}`).join(", ") || "-");
console.log("Route:", routes.map((r) => `${r.pattern}→${r.script || "(none)"}`).join(", ") || "-");
const owner = (host) => {
  const d = domains.find((x) => x.hostname === host);
  if (d) return { kind: "domain", worker: d.service };
  const r = routes.find((x) => x.pattern.replace(/\/\*$/, "").replace(/^\*\./, "") === host || x.pattern.startsWith(host + "/"));
  return r ? { kind: "route", worker: r.script, pattern: r.pattern } : null;
};
const web = owner(WEB_HOST), api = owner(API_HOST);
if (web && web.worker !== WEB_WORKER) problems.push(`${WEB_HOST} sedang dipakai Worker "${web.worker}" (${web.kind}).`);
if (api && api.worker !== API_WORKER) problems.push(`${API_HOST} sedang dipakai Worker "${api.worker}" (${api.kind}).`);
let cfg = fs.readFileSync(API_CFG, "utf8");
if (api && api.kind === "route") {
  // backend dipasang lewat route, bukan custom domain: pertahankan cara yang sama supaya tidak bentrok dengan DNS yang ada
  cfg = cfg.replace(`"routes": [{ "pattern": "chat.iranza.com", "custom_domain": true }]`, `"routes": [{ "pattern": "${api.pattern}", "zone_name": "${ZONE}" }]`);
  notes.push(`${API_HOST} memakai route ${api.pattern} → konfigurasi disesuaikan (route, bukan custom domain).`);
} else if (!api) notes.push(`${API_HOST} belum terpasang ke Worker mana pun → akan dibuat sebagai custom domain.`);

// 2) Worker kakeibo-web: nama belum dipakai proyek lain
if (scripts.includes(WEB_WORKER)) notes.push(`Worker ${WEB_WORKER} sudah ada → akan diperbarui (pastikan memang milik Kakeibo).`);

// 3) binding kakeibo-chat yang sekarang: wrangler deploy mengganti semua binding non-variabel
const live = await cf(`/accounts/${ACC}/workers/scripts/${API_WORKER}/settings`);
const kept = new Set(["plain_text", "secret_text", "json", "secret_key"]);
const known = (b) => (b.type === "d1" && b.name === "DB") || (b.type === "durable_object_namespace" && b.name === "ROOM") || (b.type === "r2_bucket" && b.name === "FILES") || kept.has(b.type);
console.log("Binding kakeibo-chat live:", (live.bindings || []).map((b) => `${b.name}:${b.type}`).join(", "));
for (const b of live.bindings || []) if (!known(b)) problems.push(`kakeibo-chat punya binding "${b.name}" (${b.type}) yang tidak ada di wrangler.jsonc — deploy akan menghapusnya.`);

// 4) storage Durable Object ChatRoom (sqlite vs legacy-kv) harus sama persis
const ns = await cf(`/accounts/${ACC}/workers/durable_objects/namespaces?per_page=1000`);
const room = ns.find((n) => n.script === API_WORKER && n.class === "ChatRoom");
console.log("Namespace DO:", ns.map((n) => `${n.script}/${n.class}${n.use_sqlite ? "(sqlite)" : "(kv)"}`).join(", "));
if (room && room.use_sqlite === false) {
  cfg = cfg.replace(`"storage": "sqlite"`, `"storage": "legacy-kv"`);
  notes.push("ChatRoom memakai storage key-value lama → exports diset legacy-kv.");
}
fs.writeFileSync(API_CFG, cfg);

// 5) Worker lain yang memakai resource Kakeibo (hanya info: migrasi tidak menghapus/mengganti nama resource)
for (const s of scripts.filter((x) => x !== API_WORKER && x !== WEB_WORKER)) {
  try {
    const st = await cf(`/accounts/${ACC}/workers/scripts/${s}/settings`);
    const uses = (st.bindings || []).filter((b) => (b.type === "d1" && b.id === D1_ID) || b.script_name === API_WORKER || b.service === API_WORKER);
    if (uses.length) notes.push(`Worker "${s}" memakai resource Kakeibo (${uses.map((b) => b.name).join(", ")}) — tetap aman, resource tidak dihapus/diganti nama.`);
  } catch (e) { notes.push(`Tidak bisa membaca binding "${s}": ${e.message.slice(0, 80)}`); }
}

console.log("\nCatatan:\n- " + (notes.join("\n- ") || "tidak ada"));
if (problems.length) {
  console.log("\nMASALAH (migrasi dihentikan, belum ada yang diubah):\n- " + problems.join("\n- "));
  for (const p of problems) console.log("::error::" + p);
  process.exit(1);
}
console.log("\nPreflight OK — tidak ada bentrok dengan Worker lain.");
