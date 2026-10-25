#!/usr/bin/env node
/* Menambahkan info BIDANG KERJA ke direktori TSK dari daftar anggota dewan sektor resmi (協議会 構成員名簿).
 *
 * Latar belakang: register TSK resmi tidak memuat bidang kerja. Tetapi TSK yang mendukung perusahaan di bidang tertentu
 * wajib bergabung dengan dewan sektornya, dan beberapa kementerian menerbitkan daftar anggotanya (PDF).
 * Skrip ini mengunduh PDF itu, mengambil semua nomor registrasi TSK (mis. 19登-000002) dari teksnya (tidak bergantung pada
 * tata letak tabel), lalu mencocokkannya dengan register. Hasil: modules/tsk/fields.json
 *
 * Sumber diatur di scripts/tsk-field-sources.json (bisa ditambah bidang lain).
 * Butuh: pdftotext (paket poppler-utils). Gagal di satu sumber tidak menghentikan yang lain.
 *
 * Pemakaian: node scripts/build-tsk-fields.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const DIR = process.env.TSK_OUT || path.join(__dirname, "..", "modules", "tsk");
const UA = { "user-agent": "Mozilla/5.0 (compatible; KakeiboTSKBuilder/1.0)", "accept-language": "ja,en;q=0.8" };
const META = ["index.json", "_debug.json", "_fields_debug.json", "profiles.json", "fields.json"];

const zen2han = (s) => String(s).replace(/\u3000/g, " ").replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const REG_RE = /(\d{2})\s*登\s*[-‐‑‒–—−ー]?\s*(\d{6})/g;
const NAME_STRIP = /(株式会社|有限会社|合同会社|合資会社|合名会社|一般社団法人|公益社団法人|一般財団法人|公益財団法人|社団法人|財団法人|事業協同組合|協同組合|企業組合|社会福祉法人|医療法人|学校法人|特定非営利活動法人|行政書士法人|社会保険労務士法人|\(株\)|\(有\)|㈱|㈲)/g;

function extractRegs(text) { // semua nomor registrasi TSK di dalam teks
  const out = new Set(); let m; const t = zen2han(text);
  REG_RE.lastIndex = 0;
  while ((m = REG_RE.exec(t))) out.add(m[1] + "登-" + m[2]);
  return out;
}
const normName = (s) => zen2han(String(s)).replace(NAME_STRIP, "").replace(/[\s\u3000・,，.、。()（）\-－ー]/g, "");
function matchNames(text, registry) { // cadangan bila daftar tidak memuat nomor registrasi: cocokkan lewat nama (min. 5 karakter)
  const hay = normName(text), out = new Set();
  for (const [reg, name] of registry) { const n = normName(name); if (n.length >= 5 && hay.indexOf(n) >= 0) out.add(reg); }
  return out;
}
function findPdfLinks(html, pageUrl, linkTextRe) {
  const out = [], re = /<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi; let m;
  const want = new RegExp(linkTextRe);
  while ((m = re.exec(html))) {
    const text = m[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (!/\.pdf(\?|#|$)/i.test(m[1]) || !want.test(text)) continue;
    out.push({ url: new URL(m[1], pageUrl).href, text });
  }
  return out;
}
async function get(url, binary) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
  return binary ? Buffer.from(await r.arrayBuffer()) : r.text();
}
function pdfText(buf) {
  const f = path.join(os.tmpdir(), "tsk-" + process.pid + "-" + Date.now() + ".pdf");
  fs.writeFileSync(f, buf);
  try { return execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", f, "-"], { maxBuffer: 256 * 1024 * 1024 }).toString("utf8"); }
  finally { try { fs.unlinkSync(f); } catch (e) {} }
}
function loadRegistry() {
  const reg = new Map();
  for (const f of fs.readdirSync(DIR)) { if (!f.endsWith(".json") || META.includes(f)) continue; for (const r of JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))) reg.set(r[0], r[1]); }
  return reg;
}

async function main() {
  const sources = JSON.parse(fs.readFileSync(path.join(__dirname, "tsk-field-sources.json"), "utf8"));
  const registry = loadRegistry();
  if (!registry.size) { console.log("Register TSK belum ada (jalankan build-tsk.js dulu). Dilewati."); return; }
  const fields = {}, debug = [], used = [];
  for (const src of sources) {
    const d = { label: src.label, page: src.page, pdfs: [], foundNumbers: 0, matched: 0, method: "", error: "" };
    try {
      const html = await get(src.page, false);
      const links = findPdfLinks(html, src.page, src.linkText);
      d.pdfs = links.map((l) => l.url + "  [" + l.text.slice(0, 60) + "]");
      if (!links.length) throw new Error("link PDF dengan teks '" + src.linkText + "' tidak ditemukan di halaman");
      let text = "";
      for (const l of links) text += "\n" + pdfText(await get(l.url, true));
      d.textLength = text.length; d.sample = text.slice(0, 500);
      let regs = extractRegs(text); d.foundNumbers = regs.size; d.method = "nomor registrasi";
      if (regs.size < 20 && src.nameFallback) { regs = matchNames(text, registry); d.method = "nama (nomor registrasi tidak ditemukan)"; }
      const hit = [...regs].filter((r) => registry.has(r));
      d.matched = hit.length;
      if (hit.length < 20) throw new Error("hanya " + hit.length + " cocok dengan register; format daftar mungkin berbeda, sumber ini dilewati (lihat _fields_debug.json)");
      for (const r of hit) { fields[r] = fields[r] || []; for (const f of src.fields) if (fields[r].indexOf(f) < 0) fields[r].push(f); }
      used.push({ label: src.label, fields: src.fields, page: src.page, matched: hit.length });
      console.log("OK  ", src.label, "->", hit.length, "TSK (" + d.method + ")");
    } catch (e) { d.error = e.message; console.warn("LEWAT", src.label, "->", e.message); }
    debug.push(d);
  }
  const w = (f, o) => fs.writeFileSync(path.join(DIR, f), JSON.stringify(o));
  w("_fields_debug.json", debug);
  if (!used.length) { console.warn("Tidak ada sumber bidang yang berhasil; fields.json tidak diubah."); return; }
  const idx = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8"));
  w("fields.json", { updated: idx.updated, sources: used, fields });
  console.log("fields.json:", Object.keys(fields).length, "TSK punya info bidang.");
}
module.exports = { extractRegs, matchNames, findPdfLinks, normName };
if (require.main === module) main().catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
