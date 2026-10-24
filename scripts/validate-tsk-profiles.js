#!/usr/bin/env node
/* Memeriksa modules/tsk/profiles.json (profil TSK yang diisi TSK sendiri).
 * Aturan: nomor registrasi harus ada di register resmi (modules/tsk/*.json), email/WhatsApp/URL harus valid,
 * bidang harus salah satu dari daftar sektor SSW, dan catatan tidak boleh terlalu panjang.
 * Keluar dengan kode 1 jika ada kesalahan, supaya data yang salah tidak ikut dipublikasikan.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const DIR = process.env.TSK_OUT || path.join(__dirname, "..", "modules", "tsk");
const FIELDS = new Set(["介護", "ビルクリーニング", "工業製品製造業", "建設", "造船・舶用工業", "自動車整備", "航空", "宿泊", "自動車運送業", "鉄道", "農業", "漁業", "飲食料品製造業", "外食業", "林業", "木材産業"]);
const fp = path.join(DIR, "profiles.json");
if (!fs.existsSync(fp)) { console.log("profiles.json belum ada, dilewati."); process.exit(0); }
const errors = [], warns = [];
let j;
try { j = JSON.parse(fs.readFileSync(fp, "utf8")); } catch (e) { console.error("GAGAL: profiles.json bukan JSON yang valid:", e.message); process.exit(1); }
if (!j || typeof j.profiles !== "object" || Array.isArray(j.profiles)) { console.error('GAGAL: profiles.json harus berbentuk {"_form": "", "profiles": { ... }}'); process.exit(1); }
if (j._form && !/^https:\/\//.test(j._form)) errors.push("_form harus berupa URL https");
const regs = new Map();
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith(".json") || ["index.json", "_debug.json", "profiles.json"].includes(f)) continue;
  for (const r of JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))) regs.set(r[0], r);
}
if (!regs.size) { console.log("Data register belum ada, pemeriksaan nomor registrasi dilewati."); }
for (const [reg, p] of Object.entries(j.profiles)) {
  const e = (m) => errors.push(reg + ": " + m);
  if (regs.size && !regs.has(reg)) e("nomor registrasi tidak ada di register resmi");
  if (!p || typeof p !== "object") { e("isinya harus berupa objek"); continue; }
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e("email tidak valid");
  if (p.whatsapp && !/^\+?\d{8,15}$/.test(String(p.whatsapp).replace(/[\s-]/g, ""))) e("nomor WhatsApp tidak valid");
  if (p.site && !/^https?:\/\//.test(p.site)) e("situs harus diawali http(s)://");
  if (p.fields !== undefined && (!Array.isArray(p.fields) || p.fields.some((x) => !FIELDS.has(x)))) e("bidang harus array berisi nama sektor yang dikenal (mis. 介護, 外食業, 農業)");
  if (p.jobChange !== undefined && typeof p.jobChange !== "boolean") e("jobChange harus true atau false");
  if (p.note && (typeof p.note !== "object" || [p.note.id, p.note.en].some((x) => x !== undefined && (typeof x !== "string" || x.length > 300)))) e("note harus {id, en} dengan teks maksimal 300 karakter");
  const r = regs.get(reg); if (r && /休止|廃止|取消|取り消|停止/.test(r[11] || "")) warns.push(reg + ": register mencatat penghentian layanan, pertimbangkan menghapus profilnya");
}
warns.forEach((w) => console.warn("PERINGATAN:", w));
if (errors.length) { console.error("GAGAL: " + errors.length + " kesalahan di profiles.json:\n - " + errors.join("\n - ")); process.exit(1); }
console.log("profiles.json OK:", Object.keys(j.profiles).length, "profil.");
