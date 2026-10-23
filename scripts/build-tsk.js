#!/usr/bin/env node
/* Membuat data direktori TSK (登録支援機関) untuk modul "Pindah Kerja & TSK".
 *
 * Sumber: 「登録支援機関登録簿」 (Excel) di situs Imigrasi Jepang (ISA):
 *   https://www.moj.go.jp/isa/applications/ssw/nyuukokukanri07_00205.html
 * Lisensi data: Public Data License 1.0 (PDL1.0) dengan wajib mencantumkan sumber dan keterangan bila diolah.
 *   Teks atribusi sudah ditampilkan di modul (modules/tsk.js).
 *
 * Pemakaian:
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/build-tsk.js                       -> unduh dari situs ISA lalu tulis modules/tsk/*.json
 *   node scripts/build-tsk.js --ja a.xlsx --en b.xlsx   -> pakai file lokal (tanpa unduh)
 *   node scripts/build-tsk.js --dump-headers        -> hanya cetak judul kolom (untuk cek format)
 *
 * Privasi: pendaftar perorangan (bukan badan hukum) hanya ditampilkan sampai tingkat kota; nomor telepon dan
 * alamat lengkapnya tidak ditulis ke data.
 */
"use strict";
const fs = require("fs");
const path = require("path");
let XLSX;
try { XLSX = require("xlsx"); } catch (e) { console.error("Paket 'xlsx' belum terpasang. Jalankan: npm i --no-save xlsx@0.18.5"); process.exit(1); }

const PAGE = "https://www.moj.go.jp/isa/applications/ssw/nyuukokukanri07_00205.html";
const OUT = process.env.TSK_OUT || path.join(__dirname, "..", "modules", "tsk");
const UA = { "user-agent": "Mozilla/5.0 (compatible; KakeiboTSKBuilder/1.0)", "accept-language": "ja,en;q=0.8" };

const PREFS = [
  ["hokkaido", "北海道"], ["aomori", "青森県"], ["iwate", "岩手県"], ["miyagi", "宮城県"], ["akita", "秋田県"], ["yamagata", "山形県"], ["fukushima", "福島県"],
  ["ibaraki", "茨城県"], ["tochigi", "栃木県"], ["gunma", "群馬県"], ["saitama", "埼玉県"], ["chiba", "千葉県"], ["tokyo", "東京都"], ["kanagawa", "神奈川県"],
  ["niigata", "新潟県"], ["toyama", "富山県"], ["ishikawa", "石川県"], ["fukui", "福井県"], ["yamanashi", "山梨県"], ["nagano", "長野県"], ["gifu", "岐阜県"],
  ["shizuoka", "静岡県"], ["aichi", "愛知県"], ["mie", "三重県"], ["shiga", "滋賀県"], ["kyoto", "京都府"], ["osaka", "大阪府"], ["hyogo", "兵庫県"], ["nara", "奈良県"],
  ["wakayama", "和歌山県"], ["tottori", "鳥取県"], ["shimane", "島根県"], ["okayama", "岡山県"], ["hiroshima", "広島県"], ["yamaguchi", "山口県"], ["tokushima", "徳島県"],
  ["kagawa", "香川県"], ["ehime", "愛媛県"], ["kochi", "高知県"], ["fukuoka", "福岡県"], ["saga", "佐賀県"], ["nagasaki", "長崎県"], ["kumamoto", "熊本県"],
  ["oita", "大分県"], ["miyazaki", "宮崎県"], ["kagoshima", "鹿児島県"], ["okinawa", "沖縄県"]
];
const ENTITY_RE = /(株式会社|有限会社|合同会社|合資会社|合名会社|一般社団法人|公益社団法人|一般財団法人|公益財団法人|社団法人|財団法人|協同組合|企業組合|協会|組合|社会福祉法人|医療法人|学校法人|宗教法人|特定非営利活動法人|NPO|行政書士法人|社会保険労務士法人|税理士法人|弁護士法人|司法書士法人|商工会|会議所|公社|大学|機構|センター|㈱|㈲|Co\.|Corp|Inc\.|Ltd|LLC|Limited)/i;

function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const zen2han = (s) => String(s).replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const clean = (v) => String(v == null ? "" : v).replace(/\s+/g, " ").trim();
const tidyAddr = (v) => zen2han(clean(v)).replace(/^〒?\s*\d{3}[-－ー]?\d{4}\s*/, "").replace(/[－‐‑–−]/g, "-");
const normReg = (v) => clean(v).replace(/[‐‑‒–—−ー₋−﹣－]/g, "-");

async function get(url, binary) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error("Gagal mengunduh " + url + " (HTTP " + r.status + ")");
  return binary ? Buffer.from(await r.arrayBuffer()) : r.text();
}

async function findLinks() {
  const html = await get(PAGE, false);
  const links = [...html.matchAll(/href="([^"]+\.xlsx)"/gi)].map((m) => new URL(m[1], PAGE).href);
  if (links.length < 1) throw new Error("Link Excel tidak ditemukan di halaman ISA. Struktur halaman mungkin berubah.");
  const d = html.match(/([０-９0-9]{4})年([０-９0-9]{1,2})月([０-９0-9]{1,2})日現在/);
  let updated = null;
  if (d) updated = zen2han(d[1]) + "-" + zen2han(d[2]).padStart(2, "0") + "-" + zen2han(d[3]).padStart(2, "0");
  // urutan di halaman: Jepang dulu, Inggris kedua
  return { ja: links[0], en: links[1] || null, updated };
}

function readRows(buf) {
  // sheetRows membatasi jumlah baris yang dibaca; jauh di atas jumlah TSK (sekitar 12 ribu)
  const wb = XLSX.read(buf, { type: "buffer", cellDates: false, sheetRows: 300000 });
  const ws = wb.Sheets[wb.SheetNames[0]];
  // Excel instansi sering punya rentang terpakai (!ref) jauh lebih besar dari datanya (misalnya sampai baris 1.048.576).
  // Mengisi seluruh rentang itu menghabiskan memori, jadi rentangnya dipersempit ke sel yang benar-benar berisi.
  let maxR = -1, maxC = 0;
  for (const k of Object.keys(ws)) {
    if (k[0] === "!") continue;
    const c = ws[k];
    if (!c || c.v === undefined || c.v === null || String(c.v).trim() === "") continue;
    const a = XLSX.utils.decode_cell(k);
    if (a.r > maxR) maxR = a.r;
    if (a.c > maxC) maxC = a.c;
  }
  if (maxR < 0) return [];
  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxR, c: Math.min(maxC, 60) } });
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }).map((r) => Array.from(r, (v) => clean(v)));
}
function headerRow(rows) {
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const r = rows[i].map(clean);
    if (r.filter(Boolean).length >= 2 && r.some((c) => /登録番号|registration/i.test(c))) return i;
  }
  return -1;
}
function pick(header, regs) { for (const re of regs) { const i = header.findIndex((h) => re.test(h)); if (i >= 0) return i; } return -1; }
function columns(header) {
  return {
    reg: pick(header, [/登録番号/, /registration\s*(no|num)/i, /^no\.?$/i]),
    date: pick(header, [/登録.*年月日/, /date\s*of\s*registration/i, /registration\s*date/i, /date/i]),
    name: pick(header, [/氏名又は名称/, /名称/, /name\s*of\s*(the\s*)?(registered|organi|company)/i, /^name/i, /name/i]),
    corp: pick(header, [/法人番号/, /corporate\s*(no|num)/i]),
    addr: pick(header, [/^住所/, /所在地/, /address/i]),
    phone: pick(header, [/電話/, /tel/i, /phone/i]),
    lang: pick(header, [/対応可能言語/, /言語/, /language/i])
  };
}
function parse(rows, label) {
  const hi = headerRow(rows);
  if (hi < 0) throw new Error(label + ": baris judul tidak ditemukan. Jalankan dengan --dump-headers untuk melihat isinya.");
  const header = rows[hi].map(clean), c = columns(header);
  if (c.reg < 0 || c.name < 0) throw new Error(label + ": kolom nomor registrasi/nama tidak ditemukan. Judul kolom: " + JSON.stringify(header));
  const out = [];
  for (let i = hi + 1; i < rows.length; i++) {
    const r = rows[i], reg = normReg(r[c.reg]), name = clean(r[c.name]);
    if (!reg || !name) continue;
    out.push({ reg, name, date: c.date >= 0 ? clean(r[c.date]) : "", corp: c.corp >= 0 ? clean(r[c.corp]) : "", addr: c.addr >= 0 ? tidyAddr(r[c.addr]) : "", phone: c.phone >= 0 ? clean(r[c.phone]) : "", lang: c.lang >= 0 ? clean(r[c.lang]) : "" });
  }
  return { header, cols: c, rows: out };
}
function prefOf(addr) {
  const a = zen2han(clean(addr));
  for (const p of PREFS) if (a.indexOf(p[1]) === 0 || a.replace(/^〒?\d{3}-?\d{4}\s*/, "").indexOf(p[1]) === 0) return p[0];
  for (const p of PREFS) if (a.indexOf(p[1]) >= 0) return p[0];
  return "other";
}
function cityOnly(addr) {
  const a = clean(addr).replace(/^〒?\s*[\d０-９]{3}[-－ー]?[\d０-９]{4}\s*/, "");
  const m = a.match(/^(北海道|.{2,3}[都府県])(.*?[市区町村郡])/);
  return m ? m[1] + m[2] : a.slice(0, 6);
}
const isEntity = (r) => !!r.corp || ENTITY_RE.test(r.name);

(async () => {
  let ja = arg("--ja"), en = arg("--en"), updated = null;
  if (!ja) { const l = await findLinks(); updated = l.updated; console.log("Link JA:", l.ja, "| EN:", l.en, "| per:", updated); ja = await get(l.ja, true); en = l.en ? await get(l.en, true) : null; }
  else { ja = fs.readFileSync(ja); en = en ? fs.readFileSync(en) : null; }

  const rowsJa = readRows(ja);
  if (process.argv.includes("--dump-headers")) {
    const hi = headerRow(rowsJa); console.log("JA header @", hi, JSON.stringify(rowsJa[hi] || rowsJa.slice(0, 5)));
    if (en) { const re = readRows(en), h2 = headerRow(re); console.log("EN header @", h2, JSON.stringify(re[h2] || re.slice(0, 5))); }
    return;
  }
  const J = parse(rowsJa, "Register Jepang");
  let nameEn = new Map();
  if (en) {
    try { const E = parse(readRows(en), "Register Inggris"); E.rows.forEach((r) => nameEn.set(r.reg, r.name)); }
    catch (e) { console.warn("PERINGATAN: register Inggris dilewati ->", e.message); }
  }
  const shards = {}; let total = 0, hidden = 0;
  for (const r of J.rows) {
    const slug = prefOf(r.addr), ent = isEntity(r);
    if (!ent) hidden++;
    (shards[slug] = shards[slug] || []).push([r.reg, r.name, nameEn.get(r.reg) || "", ent ? r.addr : cityOnly(r.addr), ent ? r.phone : "", r.date, r.lang, ent ? 0 : 1]);
    total++;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const prefs = {}, write = (f, obj) => {
    const s = JSON.stringify(obj), fp = path.join(OUT, f);
    if (!fs.existsSync(fp) || fs.readFileSync(fp, "utf8") !== s) fs.writeFileSync(fp, s);
  };
  // hapus shard lama yang sudah tidak ada
  for (const f of fs.readdirSync(OUT)) if (f.endsWith(".json") && f !== "index.json" && !shards[f.replace(/\.json$/, "")]) fs.unlinkSync(path.join(OUT, f));
  for (const slug of Object.keys(shards)) { shards[slug].sort((a, b) => a[0].localeCompare(b[0])); prefs[slug] = shards[slug].length; write(slug + ".json", shards[slug]); }
  const old = fs.existsSync(path.join(OUT, "index.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "index.json"), "utf8")) : null;
  const idx = { updated: updated || (old && old.updated) || new Date().toISOString().slice(0, 10), total, source: PAGE, license: "PDL1.0", cols: { lang: J.cols.lang >= 0, phone: J.cols.phone >= 0, en: nameEn.size > 0 }, prefs };
  write("index.json", idx);
  console.log("Selesai:", total, "lembaga,", Object.keys(prefs).length, "file,", hidden, "perorangan (kontak disembunyikan). Per:", idx.updated);
})().catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
