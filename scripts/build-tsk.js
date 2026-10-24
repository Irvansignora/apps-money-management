#!/usr/bin/env node
/* Membuat data direktori TSK (登録支援機関) untuk modul "Pindah Kerja & TSK".
 *
 * Sumber: 「登録支援機関登録簿」 (Excel) di situs Imigrasi Jepang (ISA):
 *   https://www.moj.go.jp/isa/applications/ssw/nyuukokukanri07_00205.html
 * Lisensi data: Public Data License 1.0 (PDL1.0), wajib mencantumkan sumber dan keterangan bila diolah.
 *   Teks atribusi sudah ditampilkan di modul (modules/tsk.js).
 *
 * Pemakaian:
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/build-tsk.js                           -> unduh dari situs ISA lalu tulis modules/tsk/*.json
 *   node scripts/build-tsk.js --ja a.xlsx --en b.xlsx   -> pakai file lokal (tanpa unduh)
 *   node scripts/build-tsk.js --dump-headers            -> hanya cetak judul kolom (untuk cek format)
 *
 * Kolom dikenali lewat judulnya (spasi diabaikan), dan kalau judulnya tidak dikenal, lewat isi datanya
 * (nomor telepon, email, alamat berawalan nama prefektur). Judul kolom asli + 3 baris contoh disimpan di
 * modules/tsk/_debug.json supaya mudah memeriksa pemetaan.
 *
 * Privasi: pendaftar perorangan (bukan badan hukum) hanya ditampilkan sampai tingkat kota; telepon, email, dan
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
const clean = (v) => String(v == null ? "" : v).replace(/\s+/g, " ").trim();
const zen2han = (s) => String(s).replace(/\u3000/g, " ").replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const sq = (v) => zen2han(String(v == null ? "" : v)).replace(/\s+/g, "").toLowerCase(); // judul kolom tanpa spasi (termasuk spasi lebar)
const hn = (v) => sq(v).replace(/^\(?\d+\)?[.)]?/, ""); // judul kolom: tanpa spasi dan tanpa nomor urut di depan
const EMAIL_RE = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)+/;
const normReg = (v) => clean(v).replace(/[‐‑‒–—−ー₋−﹣－]/g, "-");
const tidyAddr = (v) => zen2han(clean(v)).replace(/^〒?\s*\d{3}[-ー]?\d{4}\s*/, "").replace(/[‐‑–−]/g, "-");
const MON = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
const p2 = (n) => String(n).padStart(2, "0");
function normDate(v) { // ke YYYY-MM-DD (menangani "Friday, April 26, 2019", "令和元年5月1日", "2019/4/26", "4/26/19")
  const s = zen2han(clean(v)); if (!s) return "";
  let m = s.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (m && MON[m[1].toLowerCase()]) return m[3] + "-" + p2(MON[m[1].toLowerCase()]) + "-" + p2(m[2]);
  m = s.match(/(令和|平成)\s*(元|\d+)年\s*(\d{1,2})月\s*(\d{1,2})日/);
  if (m) return (m[1] === "令和" ? 2018 : 1988) + (m[2] === "元" ? 1 : +m[2]) + "-" + p2(m[3]) + "-" + p2(m[4]);
  m = s.match(/(\d{4})[\/\-.年]\s*(\d{1,2})[\/\-.月]\s*(\d{1,2})/);
  if (m) return m[1] + "-" + p2(m[2]) + "-" + p2(m[3]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) return (m[3].length === 2 ? "20" + m[3] : m[3]) + "-" + p2(m[1]) + "-" + p2(m[2]);
  return s;
}
const splitTokens = (s) => String(s || "").split(/[・、,，\/\n;；]/).map(clean).filter(Boolean);

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
  return { ja: links[0], en: links[1] || null, updated }; // urutan di halaman: Jepang dulu, Inggris kedua
}

function readRows(buf) {
  // sheetRows membatasi baris yang dibaca; jauh di atas jumlah TSK (sekitar 12 ribu)
  const wb = XLSX.read(buf, { type: "buffer", cellDates: false, sheetRows: 300000 });
  const ws = wb.Sheets[wb.SheetNames[0]];
  // Excel instansi sering punya rentang terpakai (!ref) jauh lebih besar dari datanya. Mengisi seluruh rentang itu
  // menghabiskan memori, jadi rentangnya dipersempit ke sel yang benar-benar berisi.
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
    const r = rows[i].map(sq);
    if (r.filter(Boolean).length >= 2 && r.some((c) => /登録番号|registration/i.test(c))) return i;
  }
  return -1;
}
// Register asli memakai judul 2 baris: judul utama (sebagian sel digabung, mis. "４ 住所") dan sub-judul
// (郵便番号 / 所在地 / 電話番号). Keduanya digabung jadi "住所/所在地" dst. Mengembalikan {header, bodyStart}.
const SUB_RE = /^(郵便|所在地|電話|名称|住所|氏名|ファックス|fax|メール|電子|postal|zip|address|tel|name|phone|e-?mail)/i;
function buildHeader(rows, hi) {
  const main = rows[hi].map(clean), next = rows[hi + 1] || [];
  const filled = next.filter((x) => clean(x));
  const isSub = filled.length >= 2 && filled.filter((x) => SUB_RE.test(sq(x))).length >= Math.ceil(filled.length * 0.6);
  if (!isSub) return { header: main, bodyStart: hi + 1, merged: false };
  const out = []; let parent = "";
  for (let i = 0; i < Math.max(main.length, next.length); i++) {
    const m = clean(main[i]), sub = clean(next[i]);
    if (m) parent = m;
    out.push(sub ? (m || parent) + "/" + sub : m);
    if (!sub && !m) parent = parent; // sel kosong tanpa sub-judul tidak mewarisi
  }
  return { header: out, bodyStart: hi + 2, merged: true };
}
function pick(header, regs) { for (const re of regs) { const i = header.findIndex((h) => re.test(h)); if (i >= 0) return i; } return -1; }
function columns(header) {
  const c = {
    reg: pick(header, [/登録番号/, /registration(no|num)/i, /^no\.?$/i]),
    date: pick(header, [/登録.*年月日/, /dateofregistration/i, /registrationdate/i, /年月日/, /date/i]),
    name: pick(header, [/氏名又は名称/, /氏名または名称/, /nameof(the)?(registered|organi|company)/i, /nameortitle/i, /^name/i]),
    corp: pick(header, [/法人番号/, /corporate(no|num)/i]),
    phone: pick(header, [/電話/, /tel/i, /phone/i]),
    email: pick(header, [/メール/, /e-?mail/i, /電子/]),
    lang: pick(header, [/対応可能言語/, /言語/, /language/i]),
    field: pick(header, [/特定産業分野/, /産業分野/, /分野/, /業種/, /sector/i, /industry/i]),
    remark: pick(header, [/備考/, /remarks?/i]),
    support: pick(header, [/支援業務の内容/, /内容及びその実施方法/, /contentsof/i])
  };
  if (c.name < 0 && c.reg >= 0) c.name = (c.date >= 0 ? c.date : c.reg) + 1; // urutan resmi: nomor, tanggal, nama
  // alamat: kolom 住所 (kantor terdaftar) dan 支援を行う事務所 (kantor tempat dukungan diberikan) dipisah
  const cand = header.map((h, i) => i).filter((i) => /(住所|所在地|都道府県|市区郡町村|市区町村|番地|丁目|建物|address)/i.test(header[i]) && !/郵便|zip|postal|電話|メール|fax/i.test(header[i]));
  const office = cand.filter((i) => /事務所|office/i.test(header[i]));
  const main = cand.filter((i) => office.indexOf(i) < 0);
  if (main.some((i) => /都道府県/.test(header[i]))) c.addrCols = main;
  else { const first = main.find((i) => /住所/.test(header[i])); const one = first !== undefined ? first : main[0]; c.addrCols = one === undefined ? [] : [one]; }
  c.officeCols = office.length ? [office[0]] : [];
  return c;
}
const PHONE_RE = /^\+?[\d\- ()]{9,18}$/;
function sample(body, i, n) { const out = []; for (const r of body) { const v = clean(r[i]); if (v) { out.push(v); if (out.length >= (n || 400)) break; } } return out; }
const rate = (vals, fn) => (vals.length ? vals.filter(fn).length / vals.length : 0);
// Kolom yang judulnya tidak dikenali dicari lewat isi datanya (telepon, email, alamat berawalan prefektur)
function sniff(body, header, c) {
  const taken = new Set(); Object.keys(c).forEach((k) => { if (typeof c[k] === "number" && c[k] >= 0) taken.add(c[k]); }); c.addrCols.forEach((x) => taken.add(x)); (c.officeCols || []).forEach((x) => taken.add(x));
  for (let i = 0; i < header.length; i++) {
    if (taken.has(i)) continue;
    const vals = sample(body, i); if (vals.length < 20) continue;
    if (c.email < 0 && rate(vals, (v) => /@/.test(v)) > 0.5) { c.email = i; taken.add(i); continue; }
    if (c.phone < 0 && !/fax|ファックス/.test(header[i]) && rate(vals, (v) => PHONE_RE.test(zen2han(v))) > 0.6) { c.phone = i; taken.add(i); continue; }
    if (!c.addrCols.length && rate(vals, (v) => PREFS.some((p) => zen2han(v).replace(/^〒?\d{3}-?\d{4}\s*/, "").indexOf(p[1]) === 0)) > 0.5) { c.addrCols = [i]; taken.add(i); continue; }
  }
}
const failInfo = (label, rows, err) => ({ label, error: err.message, firstRows: rows.slice(0, 8).map((r) => r.slice(0, 16)) });
function parse(rows, label) {
  const hi = headerRow(rows);
  if (hi < 0) throw Object.assign(new Error(label + ": baris judul tidak ditemukan. Jalankan dengan --dump-headers untuk melihat isinya."), { rows });
  const bh = buildHeader(rows, hi), rawHeader = bh.header, header = rawHeader.map(hn), c = columns(header);
  if (c.reg < 0 || c.name < 0) throw Object.assign(new Error(label + ": kolom nomor registrasi/nama tidak ditemukan. Judul kolom: " + JSON.stringify(rawHeader)), { rows });
  const body = rows.slice(bh.bodyStart).filter((r) => r.some((x) => clean(x)));
  sniff(body, header, c);
  const out = [], join = (r, cols) => tidyAddr(cols.map((i) => clean(r[i])).filter((x, k, a) => x && x !== a[k - 1]).join(""));
  for (const r of body) {
    const reg = normReg(r[c.reg]), name = clean(r[c.name]);
    if (!reg || !name || /^(登録番号|registration)/i.test(sq(reg))) continue;
    const main = join(r, c.addrCols), off = join(r, c.officeCols || []);
    const remark = c.remark >= 0 ? clean(r[c.remark]) : "";
    const em = (c.email >= 0 ? zen2han(clean(r[c.email])) : "").replace(/\s+/g, "") || ((zen2han(remark).match(EMAIL_RE) || [""])[0]);
    out.push({
      reg, name, date: c.date >= 0 ? normDate(r[c.date]) : "", corp: c.corp >= 0 ? clean(r[c.corp]) : "",
      addr: off || main, hq: off && main && off !== main ? main : "", phone: c.phone >= 0 ? zen2han(clean(r[c.phone])) : "", email: em,
      lang: c.lang >= 0 ? clean(r[c.lang]) : "", field: c.field >= 0 ? clean(r[c.field]) : "", remark: remark.slice(0, 160),
      extra: c.support >= 0 && /[☑☒✔✓■]\s*上記に加え/.test(clean(r[c.support])) ? 1 : 0
    });
  }
  return { header: rawHeader, cols: c, rows: out, sample: body.slice(0, 3).map((r) => r.map(clean)) };
}
function prefOf(addr) {
  const a = zen2han(clean(addr)).replace(/^〒?\s*\d{3}-?\d{4}\s*/, "");
  for (const p of PREFS) if (a.indexOf(p[1]) === 0) return p[0];
  for (const p of PREFS) if (a.indexOf(p[1]) >= 0) return p[0];
  return "other";
}
function cityOnly(addr) {
  const a = clean(addr);
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
  let J;
  try { J = parse(rowsJa, "Register Jepang"); }
  catch (e) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, "_debug.json"), JSON.stringify({ ja: failInfo("Register Jepang", e.rows || rowsJa, e), en: null })); throw e; }
  const nameEn = new Map(); let E = null, enFail = null;
  if (en) {
    const rowsEn = readRows(en);
    try { E = parse(rowsEn, "Register Inggris"); E.rows.forEach((r) => nameEn.set(r.reg, r.name)); }
    catch (e) { enFail = failInfo("Register Inggris", e.rows || rowsEn, e); console.warn("PERINGATAN: register Inggris dilewati ->", e.message); }
  }
  const shards = {}, langs = {}, fields = {}; let total = 0, hidden = 0;
  for (const r of J.rows) {
    const slug = prefOf(r.addr), ent = isEntity(r);
    if (!ent) hidden++;
    (shards[slug] = shards[slug] || []).push([r.reg, r.name, nameEn.get(r.reg) || "", ent ? r.addr : cityOnly(r.addr), ent ? r.phone : "", r.date, r.lang, ent ? 0 : 1, ent ? r.email : "", r.field, ent ? r.hq : "", ent ? r.remark : "", r.extra]);
    splitTokens(r.lang).forEach((t) => { langs[t] = (langs[t] || 0) + 1; });
    splitTokens(r.field).forEach((t) => { fields[t] = (fields[t] || 0) + 1; });
    total++;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const prefs = {}, write = (f, obj) => {
    const s = JSON.stringify(obj), fp = path.join(OUT, f);
    if (!fs.existsSync(fp) || fs.readFileSync(fp, "utf8") !== s) fs.writeFileSync(fp, s);
  };
  for (const f of fs.readdirSync(OUT)) if (f.endsWith(".json") && f !== "index.json" && f !== "_debug.json" && !shards[f.replace(/\.json$/, "")]) fs.unlinkSync(path.join(OUT, f));
  for (const slug of Object.keys(shards)) { shards[slug].sort((a, b) => a[0].localeCompare(b[0])); prefs[slug] = shards[slug].length; write(slug + ".json", shards[slug]); }
  const old = fs.existsSync(path.join(OUT, "index.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "index.json"), "utf8")) : null;
  const has = (i) => i >= 0;
  const idx = {
    updated: updated || (old && old.updated) || new Date().toISOString().slice(0, 10), total, source: PAGE, license: "PDL1.0",
    cols: { addr: J.cols.addrCols.length > 0 || (J.cols.officeCols || []).length > 0, phone: has(J.cols.phone), email: has(J.cols.email) || J.rows.some((r) => r.email), lang: has(J.cols.lang), field: has(J.cols.field), remark: has(J.cols.remark), en: nameEn.size > 0 },
    prefs, langs, fields
  };
  write("index.json", idx);
  // catatan teknis untuk memeriksa pemetaan kolom (hanya judul + 3 baris contoh dari register publik)
  write("_debug.json", { ja: { header: J.header, mapped: J.cols, sample: J.sample }, en: E ? { header: E.header, mapped: E.cols, sample: E.sample } : enFail });
  console.log("Selesai:", total, "lembaga,", Object.keys(prefs).length, "file,", hidden, "perorangan (kontak disembunyikan). Per:", idx.updated, "| kolom:", JSON.stringify(idx.cols));
})().catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
