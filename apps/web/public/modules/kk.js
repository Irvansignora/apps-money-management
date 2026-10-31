/* Terjemahan Kartu Keluarga (KK) Indonesia → bahasa Jepang, untuk dokumen pelengkap
   扶養控除 / 国外居住親族 (tax refund / nenmatsu chōsei). Data KK disimpan hanya di HP (localStorage
   "jp-finance-kk", ikut backup). Scan otomatis pakai AI (Premium+) lewat /api/ai/scan kind "kk".
   Hasil: dokumen A4 berisi tabel terjemahan + pernyataan penerjemah, bisa dicetak / disimpan PDF.
   Teks UI: Indonesia (id) dan Inggris (en); bahasa lain memakai Inggris. */
(function () {
  "use strict";
  var KEY = "jp-finance-kk";
  var host = { lang: "id", esc: null, profileName: "" }, el = null, tab = "data", data = null, scanState = "", scanErr = "";

  /* ---------- kamus istilah standar KK (Dukcapil) → Jepang ---------- */
  var JK = { "LAKI-LAKI": "男", "PEREMPUAN": "女" };
  var AGAMA = { "ISLAM": "イスラム教", "KRISTEN": "キリスト教（プロテスタント）", "KATHOLIK": "キリスト教（カトリック）", "KATOLIK": "キリスト教（カトリック）", "HINDU": "ヒンドゥー教", "BUDDHA": "仏教", "KHONGHUCU": "儒教", "KONGHUCU": "儒教", "KEPERCAYAAN TERHADAP TUHAN YME": "その他の信仰", "KEPERCAYAAN": "その他の信仰" };
  var PENDIDIKAN = {
    "TIDAK/BELUM SEKOLAH": "未就学", "BELUM TAMAT SD/SEDERAJAT": "小学校未修了", "TAMAT SD/SEDERAJAT": "小学校卒業",
    "SLTP/SEDERAJAT": "中学校卒業", "SLTA/SEDERAJAT": "高等学校卒業", "DIPLOMA I/II": "専門課程修了（ディプロマI・II）",
    "AKADEMI/DIPLOMA III/S. MUDA": "短期大学卒業（ディプロマIII）", "AKADEMI/DIPLOMA III/SARJANA MUDA": "短期大学卒業（ディプロマIII）",
    "DIPLOMA IV/STRATA I": "大学卒業（学士）", "STRATA II": "大学院修士課程修了", "STRATA III": "大学院博士課程修了"
  };
  var STATUS = { "BELUM KAWIN": "未婚", "KAWIN": "既婚", "KAWIN TERCATAT": "既婚（婚姻登録済み）", "KAWIN BELUM TERCATAT": "既婚（婚姻未登録）", "CERAI HIDUP": "離婚", "CERAI MATI": "死別", "CERAI HIDUP TERCATAT": "離婚（登録済み）", "CERAI MATI TERCATAT": "死別（登録済み）" };
  var HUBUNGAN = { "KEPALA KELUARGA": "世帯主", "SUAMI": "夫", "ISTRI": "妻", "ANAK": "子", "MENANTU": "子の配偶者", "CUCU": "孫", "ORANG TUA": "父母", "MERTUA": "配偶者の父母", "FAMILI LAIN": "その他の親族", "PEMBANTU": "使用人", "LAINNYA": "その他" };
  var WN = { "WNI": "インドネシア国籍", "WNA": "外国籍" };
  var PEKERJAAN = {
    "BELUM/TIDAK BEKERJA": "無職", "MENGURUS RUMAH TANGGA": "家事従事者", "PELAJAR/MAHASISWA": "学生", "PENSIUNAN": "年金受給者",
    "PEGAWAI NEGERI SIPIL": "公務員", "PEGAWAI NEGERI SIPIL (PNS)": "公務員", "TENTARA NASIONAL INDONESIA": "国軍軍人", "TENTARA NASIONAL INDONESIA (TNI)": "国軍軍人",
    "KEPOLISIAN RI": "警察官", "KEPOLISIAN RI (POLRI)": "警察官", "PERDAGANGAN": "商業", "PETANI/PEKEBUN": "農業従事者", "PETERNAK": "畜産業従事者",
    "NELAYAN/PERIKANAN": "漁業従事者", "INDUSTRI": "製造業", "KONSTRUKSI": "建設業", "TRANSPORTASI": "運輸業", "KARYAWAN SWASTA": "会社員",
    "KARYAWAN BUMN": "国営企業職員", "KARYAWAN BUMD": "地方公営企業職員", "KARYAWAN HONORER": "臨時職員", "BURUH HARIAN LEPAS": "日雇い労働者",
    "BURUH TANI/PERKEBUNAN": "農業労働者", "BURUH NELAYAN/PERIKANAN": "漁業労働者", "BURUH PETERNAKAN": "畜産労働者", "PEMBANTU RUMAH TANGGA": "家事使用人",
    "TUKANG CUKUR": "理容師", "TUKANG LISTRIK": "電気工", "TUKANG BATU": "石工・左官", "TUKANG KAYU": "大工", "TUKANG JAHIT": "仕立て職人", "TUKANG LAS/PANDAI BESI": "溶接工・鍛冶職人",
    "MEKANIK": "整備士", "SOPIR": "運転手", "PEDAGANG": "商人", "WIRASWASTA": "自営業", "GURU": "教員", "DOSEN": "大学教員", "DOKTER": "医師",
    "BIDAN": "助産師", "PERAWAT": "看護師", "APOTEKER": "薬剤師", "PERANGKAT DESA": "村役場職員", "KEPALA DESA": "村長", "USTADZ/MUBALIGH": "イスラム教指導者",
    "PENDETA": "牧師", "BIARAWATI": "修道女", "TENAGA KESEHATAN": "医療従事者", "PELAUT": "船員", "PILOT": "パイロット", "ARSITEK": "建築家",
    "AKUNTAN": "会計士", "KONSULTAN": "コンサルタント", "PENGACARA": "弁護士", "NOTARIS": "公証人", "WARTAWAN": "記者", "SENIMAN": "芸術家", "LAINNYA": "その他"
  };
  var SEL = { jk: JK, agama: AGAMA, pendidikan: PENDIDIKAN, status: STATUS, hubungan: HUBUNGAN, wn: WN };

  var HEAD = [["no", "家族カード番号", "No. KK"], ["kepala", "世帯主氏名", "Nama Kepala Keluarga"], ["alamat", "住所", "Alamat"], ["rtrw", "隣組／町内会（RT/RW）", "RT/RW"],
    ["desa", "村・区（Desa/Kelurahan）", "Desa/Kelurahan"], ["kec", "郡（Kecamatan）", "Kecamatan"], ["kab", "県・市（Kabupaten/Kota）", "Kabupaten/Kota"],
    ["prov", "州（Provinsi）", "Provinsi"], ["kodepos", "郵便番号", "Kode Pos"]];
  var MEM = [["nama", "氏名", "Nama Lengkap"], ["nik", "国民識別番号（NIK）", "NIK"], ["jk", "性別", "Jenis Kelamin"], ["tempat", "出生地", "Tempat Lahir"], ["tgl", "生年月日", "Tanggal Lahir"],
    ["agama", "宗教", "Agama"], ["pendidikan", "学歴", "Pendidikan"], ["pekerjaan", "職業", "Jenis Pekerjaan"], ["status", "婚姻状況", "Status Perkawinan"],
    ["tglKawin", "婚姻日", "Tanggal Perkawinan"], ["hubungan", "世帯主との続柄", "Status Hubungan Dalam Keluarga"], ["wn", "国籍", "Kewarganegaraan"],
    ["paspor", "旅券番号", "No. Paspor"], ["kitap", "KITAP番号", "No. KITAP"], ["ayah", "父の氏名", "Nama Ayah"], ["ibu", "母の氏名", "Nama Ibu"]];

  var UI = {
    id: {
      title: "Terjemahan Kartu Keluarga", sub: "KK Indonesia → bahasa Jepang (家族関係書類 翻訳文)", close: "Tutup",
      tData: "Isi Data", tDoc: "Hasil 日本語", tGuide: "Panduan Pajak",
      privacy: "Data KK (termasuk NIK) hanya disimpan di HP ini dan ikut file backup. Tidak dikirim ke server kecuali saat kamu memakai Scan AI.",
      scan: "📷 Scan KK dengan AI (Premium+)", scanning: "Membaca KK… (±20 detik)", scanOk: "KK terbaca. Periksa lagi setiap kolom dengan KK asli.",
      scanFail: "Scan gagal. Coba foto lebih terang dan lurus, atau isi manual.", scanLimit: "Kuota scan AI hari ini habis.",
      head: "Data Kepala Keluarga & Alamat", members: "Anggota Keluarga", member: "Anggota", add: "+ Tambah anggota", del: "Hapus anggota", delAsk: "Hapus anggota ini?",
      issue: "Dikeluarkan tanggal (DD-MM-YYYY)", official: "Nama pejabat penandatangan (opsional)", pick: "— pilih —",
      jpOver: "Pekerjaan dalam bahasa Jepang (isi kalau tidak dikenali)", unknown: "tidak dikenali, isi terjemahan Jepang di bawah",
      trans: "Data Penerjemah (kamu sendiri boleh)", tName: "Nama penerjemah", tAddr: "Alamat di Jepang", tTel: "No. telepon", tDate: "Tanggal terjemahan",
      print: "🖨️ Cetak / Simpan PDF", dl: "⬇️ Unduh file (.html)", reset: "Kosongkan semua data KK", resetAsk: "Hapus semua data KK di HP ini?",
      empty: "Isi data KK dulu di tab Isi Data (atau Scan AI).", check: "Ditandai ※ = istilah tidak ada di kamus, periksa terjemahannya.",
      date: "DD-MM-YYYY",
      guide: [
        ["Untuk apa?", "Kalau kamu mengklaim keluarga di Indonesia sebagai tanggungan (扶養控除 / 配偶者控除) saat nenmatsu chōsei atau kakutei shinkoku, kantor/税務署 minta <b>親族関係書類</b> (bukti hubungan keluarga) dan <b>送金関係書類</b> (bukti kirim uang). Dokumen berbahasa asing wajib dilampiri <b>terjemahan bahasa Jepang</b>."],
        ["Yang dilampirkan", "<ul><li>Fotokopi KK asli (dan/atau akta lahir / buku nikah, fotokopi paspor keluarga bila ada)</li><li>Terjemahan dari fitur ini (cetak, tanda tangan penerjemah)</li><li>Bukti transfer ke tiap tanggungan untuk tahun tersebut (struk Wise, bank, dsb.) + terjemahannya bila tidak berbahasa Jepang/Inggris</li></ul>"],
        ["Siapa yang boleh menerjemahkan?", "Terjemahan boleh dibuat sendiri oleh wajib pajak. Isi nama, alamat dan tanda tangan penerjemah di bagian bawah. Beberapa kantor meminta penerjemah resmi — tanyakan ke bagian HR / 税務署 kalau ragu."],
        ["Batas usia tanggungan di luar negeri", "Sejak 2023, tanggungan di luar Jepang usia <b>30–69 tahun</b> hanya bisa diklaim kalau: pelajar/mahasiswa, penyandang disabilitas, atau menerima kiriman uang dari kamu minimal <b>¥380.000</b> setahun. Anak di bawah 16 tahun tidak mengurangi pajak penghasilan. Aturan bisa berubah, cek situs NTA."],
        ["Tips", "Pakai KK terbaru (data anggota sesuai kondisi sekarang). Nama & alamat ditulis huruf Latin persis seperti di KK supaya cocok dengan paspor dan bukti transfer."]
      ],
      nta: "Situs Pajak Jepang (NTA): 扶養控除"
    },
    en: {
      title: "Family Card Translation", sub: "Indonesian KK → Japanese (家族関係書類 翻訳文)", close: "Close",
      tData: "Enter Data", tDoc: "Japanese Result", tGuide: "Tax Guide",
      privacy: "KK data (including NIK numbers) is stored only on this phone and is included in your backup file. It is sent to the server only when you use AI Scan.",
      scan: "📷 Scan KK with AI (Premium+)", scanning: "Reading the KK… (about 20 seconds)", scanOk: "KK read. Check every field against the original card.",
      scanFail: "Scan failed. Try a brighter, straighter photo, or fill it in manually.", scanLimit: "Today's AI scan quota is used up.",
      head: "Head of Family & Address", members: "Family Members", member: "Member", add: "+ Add member", del: "Remove member", delAsk: "Remove this member?",
      issue: "Issue date (DD-MM-YYYY)", official: "Signing official's name (optional)", pick: "— choose —",
      jpOver: "Occupation in Japanese (fill in if not recognized)", unknown: "not recognized, enter the Japanese translation below",
      trans: "Translator details (you may translate it yourself)", tName: "Translator name", tAddr: "Address in Japan", tTel: "Phone number", tDate: "Translation date",
      print: "🖨️ Print / Save as PDF", dl: "⬇️ Download file (.html)", reset: "Clear all KK data", resetAsk: "Delete all KK data on this phone?",
      empty: "Enter the KK data first in the Enter Data tab (or use AI Scan).", check: "Marked ※ = term not in the dictionary, please check its translation.",
      date: "DD-MM-YYYY",
      guide: [
        ["What is it for?", "If you claim family members in Indonesia as dependents (扶養控除 / 配偶者控除) in year-end adjustment or a tax return, your employer or the tax office asks for <b>親族関係書類</b> (proof of relationship) and <b>送金関係書類</b> (proof of money transfers). Documents in a foreign language must include a <b>Japanese translation</b>."],
        ["What to attach", "<ul><li>A copy of the original KK (and/or birth or marriage certificates, family passport copies if available)</li><li>The translation from this tool (printed and signed by the translator)</li><li>Transfer receipts to each dependent for that year (Wise, bank, etc.) with a translation if not in Japanese/English</li></ul>"],
        ["Who may translate?", "The taxpayer may translate the documents themselves. Fill in the translator's name, address and signature at the bottom. Some employers ask for a professional translator; check with HR or the tax office if unsure."],
        ["Age limits for dependents abroad", "Since 2023, dependents living outside Japan aged <b>30–69</b> can only be claimed if they are students, have a disability, or received at least <b>¥380,000</b> from you during the year. Children under 16 do not reduce income tax. Rules can change; check the NTA website."],
        ["Tips", "Use the latest KK. Write names and addresses in Latin letters exactly as on the KK so they match passports and transfer receipts."]
      ],
      nta: "Japan tax agency (NTA): 扶養控除"
    }
  };
  var T = function () { return UI[host.lang] || UI.en; };
  var E = function (s) { return host.esc ? host.esc(s) : String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ---------- data ---------- */
  function blank() { return { head: {}, tglKeluar: "", pejabat: "", members: [mem()], tr: { name: host.profileName || "", addr: "", tel: "", date: "" } }; }
  function mem() { var m = {}; MEM.forEach(function (f) { m[f[0]] = ""; }); m.wn = "WNI"; m.jpKerja = ""; return m; }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || "null"); if (d && Array.isArray(d.members)) { d.head = d.head || {}; d.tr = d.tr || {}; return d; } } catch (e) {} return blank(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  var norm = function (v) { return String(v || "").toUpperCase().replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim(); };

  // terjemahan nilai satu kolom anggota; { jp, ok } (ok=false → tidak dikenali)
  function tr(field, v, m) {
    var raw = String(v || "").trim();
    if (!raw) return { jp: "", ok: true };
    if (field === "tgl" || field === "tglKawin") return jpDate(raw);
    if (field === "pekerjaan") {
      var p = PEKERJAAN[norm(raw)];
      if (p) return { jp: p, ok: true };
      return m && m.jpKerja ? { jp: m.jpKerja, ok: true } : { jp: raw, ok: false };
    }
    var map = SEL[field];
    if (map) { var x = map[norm(raw)]; return x ? { jp: x, ok: true } : { jp: raw, ok: false }; }
    return { jp: raw, ok: true }; // nama, NIK, tempat, nomor: ditulis apa adanya (huruf Latin)
  }
  function jpDate(s) {
    var m = /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/.exec(s) || null, y, mo, d;
    if (m) { d = +m[1]; mo = +m[2]; y = +m[3]; }
    else if ((m = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/.exec(s))) { y = +m[1]; mo = +m[2]; d = +m[3]; }
    if (!m || mo < 1 || mo > 12 || d < 1 || d > 31) return { jp: s, ok: false };
    return { jp: y + "年" + mo + "月" + d + "日", ok: true };
  }
  function today() { var d = new Date(); return String(d.getDate()).padStart(2, "0") + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + d.getFullYear(); }

  /* ---------- dokumen terjemahan (dipakai untuk pratinjau dan cetak) ---------- */
  var DOC_CSS = [
    ".kd{font-family:'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP','Shippori Mincho',serif;color:#111;background:#fff;font-size:10.5px;line-height:1.45}",
    ".kd h1{font-size:17px;text-align:center;margin:0 0 2px;letter-spacing:.08em}.kd .sub{text-align:center;font-size:10.5px;margin:0 0 10px}",
    ".kd table{width:100%;border-collapse:collapse;margin:0 0 9px;table-layout:fixed}.kd th,.kd td{border:1px solid #333;padding:3px 4px;vertical-align:top;overflow-wrap:anywhere;word-break:break-word}",
    ".kd th{background:#eee;font-weight:700;font-size:9.5px}.kd th small{display:block;font-weight:400;color:#555;font-size:8px}.kd td.n{text-align:center;width:22px}",
    ".kd .hd th{width:28%;text-align:left}.kd .x{color:#b00}.kd .foot{display:flex;gap:16px;justify-content:space-between;margin-top:8px}",
    ".kd .cert{border:1px solid #333;padding:8px 10px;margin-top:10px}.kd .cert p{margin:0 0 6px}.kd .line{display:inline-block;min-width:160px;border-bottom:1px solid #333}",
    ".kd .note{font-size:9px;color:#444;margin-top:6px}"
  ].join("\n");
  function docHtml(mark) {
    var d = data, h = d.head, t = d.tr || {};
    var cell = function (field, m) { var r = tr(field, m[field], m); return E(r.jp) + (!r.ok && mark ? ' <span class="x">※</span>' : ""); };
    var hr = HEAD.map(function (f) { return "<tr><th>" + f[1] + "<small>" + E(f[2]) + "</small></th><td>" + E(h[f[0]] || "") + "</td></tr>"; }).join("");
    var cols1 = MEM.slice(0, 8), cols2 = MEM.slice(8);
    var th = function (cols) { return '<tr><th class="n">No</th>' + cols.map(function (f) { return "<th>" + f[1] + "<small>" + E(f[2]) + "</small></th>"; }).join("") + "</tr>"; };
    var rows = function (cols) { return d.members.map(function (m, i) { return '<tr><td class="n">' + (i + 1) + "</td>" + cols.map(function (f) { return "<td>" + cell(f[0], m) + "</td>"; }).join("") + "</tr>"; }).join(""); };
    var issued = jpDate(d.tglKeluar || "");
    return '<div class="kd">' +
      "<h1>家族関係証明書（家族カード）翻訳文</h1>" +
      '<p class="sub">原本：インドネシア共和国 家族カード（KARTU KELUARGA）</p>' +
      '<table class="hd">' + hr + "</table>" +
      "<table>" + th(cols1) + rows(cols1) + "</table>" +
      "<table>" + th(cols2) + rows(cols2) + "</table>" +
      '<div class="foot"><div>発行日（Dikeluarkan Tanggal）：' + E(d.tglKeluar ? issued.jp : "　　年　　月　　日") + "</div>" +
      "<div>発行者：" + E(h.kab || "") + " 住民登録・市民登録局長（Kepala Dinas Kependudukan dan Pencatatan Sipil）" + (d.pejabat ? "　" + E(d.pejabat) : "") + "</div></div>" +
      '<div class="cert"><p>上記は、添付のインドネシア共和国家族カード（KARTU KELUARGA）原本の正確な翻訳であることを証明します。</p>' +
      "<p>翻訳日：" + E(t.date ? jpDate(t.date).jp : "　　年　　月　　日") + "</p>" +
      '<p>翻訳者氏名：<span class="line">' + E(t.name || "") + "</span>　署名：<span class=\"line\"></span></p>" +
      '<p>住所：<span class="line" style="min-width:300px">' + E(t.addr || "") + "</span>　電話：<span class=\"line\">" + E(t.tel || "") + "</span></p></div>" +
      '<p class="note">※氏名・地名・番号は原本どおりローマ字・数字で記載しています。</p></div>';
  }
  function fullDoc() {
    return '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>家族カード翻訳文</title>' +
      "<style>@page{size:A4 landscape;margin:10mm}body{margin:0;padding:12px;background:#fff}" + DOC_CSS + "@media print{body{padding:0}}</style></head><body>" + docHtml(false) + "</body></html>";
  }
  function printDoc() {
    var f = document.createElement("iframe");
    f.setAttribute("aria-hidden", "true");
    f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(f);
    var w = f.contentWindow; w.document.open(); w.document.write(fullDoc()); w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (e) { download(); } setTimeout(function () { f.remove(); }, 60000); }, 350);
  }
  function download() {
    var url = URL.createObjectURL(new Blob([fullDoc()], { type: "text/html" })), a = document.createElement("a");
    a.href = url; a.download = "terjemahan-KK-" + (String(data.head.no || "").replace(/\D/g, "") || "kakeibo") + ".html";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
  function hasData() { return !!(data.head.no || data.head.kepala || data.members.some(function (m) { return m.nama; })); }

  /* ---------- scan AI ---------- */
  function resize(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var s = Math.min(1, 2000 / Math.max(img.width, img.height)), c = document.createElement("canvas");
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          var q = 0.85, u = c.toDataURL("image/jpeg", q);
          while (u.length > 2.8e6 && q > 0.4) { q -= 0.15; u = c.toDataURL("image/jpeg", q); }
          res(u);
        };
        img.onerror = rej; img.src = r.result;
      };
      r.onerror = rej; r.readAsDataURL(file);
    });
  }
  function scan(file) {
    var A = window.KakeiboAuth;
    if (!A) return;
    A.require(function () {
      scanState = "busy"; scanErr = ""; draw();
      resize(file).then(function (img) { return A.api("/api/ai/scan", { kind: "kk", image: img }); })
        .then(function (r) {
          var k = r && r.kk; if (!k) throw {};
          HEAD.forEach(function (f) { if (k[f[0]]) data.head[f[0]] = k[f[0]]; });
          if (k.tglKeluar) data.tglKeluar = k.tglKeluar;
          if (k.pejabat) data.pejabat = k.pejabat;
          if (k.members && k.members.length) data.members = k.members.map(function (m) { var x = mem(); for (var key in x) if (m[key] !== undefined) x[key] = m[key]; return x; });
          save(); scanState = "ok";
        })
        .catch(function (e) { scanState = "err"; scanErr = e && e.code === "limit" ? T().scanLimit : T().scanFail; })
        .then(draw);
    });
  }

  /* ---------- tampilan ---------- */
  function css() {
    if (document.getElementById("kkCss")) return;
    var s = document.createElement("style"); s.id = "kkCss";
    s.textContent = [
      ".kx-root{position:fixed;inset:0;z-index:67;display:flex;justify-content:center;background:rgba(23,35,61,.55);font-family:Inter,sans-serif;animation:fadeIn .2s both}",
      ".kx-app{width:100%;max-width:480px;height:100dvh;display:flex;flex-direction:column;background:var(--washi,#ece3ce);color:var(--sumi,#2a251d)}",
      ".kx-head{display:flex;align-items:center;gap:6px;padding:calc(env(safe-area-inset-top,0px) + 8px) 10px 8px 14px;background:rgba(251,247,234,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line,rgba(122,110,80,.24))}",
      ".kx-ttl{flex:1;min-width:0}.kx-ttl b{display:block;font:800 17px 'Shippori Mincho',serif}.kx-ttl span{display:block;font-size:12px;color:var(--mist,#6d6759);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".kx-ib{width:42px;height:42px;border:0;border-radius:50%;background:none;color:inherit;font-size:20px;cursor:pointer;flex:0 0 42px}",
      ".kx-body{flex:1;min-height:0;overflow-y:auto;padding:14px 16px 40px;-webkit-overflow-scrolling:touch}",
      ".kx-tabs{display:flex;gap:6px;margin:0 0 14px}.kx-tab{flex:1;border:0;border-radius:12px;padding:10px 4px;background:rgba(23,35,61,.07);color:inherit;font:700 12.5px Inter,sans-serif;cursor:pointer}.kx-tab.on{background:var(--ai,#17233d);color:#fff}",
      ".kx-note{font-size:12px;line-height:1.5;color:var(--mist,#6d6759);margin:0 2px 12px}.kx-note.ok{color:#25724a}.kx-note.err{color:#b3261e}",
      ".kx-blk{background:var(--card,#fbf7ea);border-radius:18px;padding:13px 14px;margin-bottom:12px}.kx-blk h4{font:800 14.5px 'Shippori Mincho',serif;margin:0 0 10px;display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".kx-f{display:block;margin-bottom:9px}.kx-f span{display:block;font-size:11.5px;color:var(--mist,#6d6759);margin:0 0 3px}.kx-f small{display:block;color:#b3261e;font-size:11px;margin-top:3px}",
      ".kx-in{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:10px 12px;border-radius:12px;border:1px solid var(--line,rgba(122,110,80,.3));background:#fff;color:inherit;outline:0}",
      ".kx-g2{display:grid;grid-template-columns:1fr 1fr;gap:0 8px}",
      ".kx-btn{display:block;width:100%;border:0;border-radius:13px;padding:13px;background:linear-gradient(135deg,var(--ai-2,#223a5c),var(--ai,#17233d));color:#fff;font:700 14px Inter,sans-serif;cursor:pointer;margin:0 0 10px;text-align:center}",
      ".kx-btn.alt{background:linear-gradient(135deg,#d9822f,#ac3527)}.kx-btn.ghost{background:rgba(23,35,61,.08);color:inherit}.kx-btn:disabled{opacity:.6}",
      ".kx-x{border:0;background:rgba(179,38,30,.1);color:#b3261e;border-radius:99px;padding:5px 10px;font:700 11.5px Inter,sans-serif;cursor:pointer}",
      ".kx-paper{background:#fff;border-radius:12px;padding:10px;overflow-x:auto;margin-bottom:12px;box-shadow:0 8px 20px -14px rgba(0,0,0,.4)}.kx-paper .kd{min-width:640px}",
      ".kx-gd{font-size:13.5px;line-height:1.55}.kx-gd p{margin:0}.kx-gd ul{margin:0;padding-left:18px}.kx-gd li{margin:0 0 5px}",
      ".kx-a{display:block;color:var(--hanko,#ac3527);font:700 13px Inter,sans-serif;margin:6px 2px 0}",
      DOC_CSS
    ].join("\n");
    document.head.appendChild(s);
  }
  function field(scope, key, label, i, type) {
    var src = scope === "h" ? data.head : scope === "d" ? data : scope === "t" ? data.tr : data.members[i], v = src[key] || "";
    var attrs = ' data-s="' + scope + '" data-k="' + key + '"' + (i != null ? ' data-i="' + i + '"' : "");
    var map = scope === "m" && SEL[key], extra = "";
    var input;
    if (map) {
      var opts = Object.keys(map).filter(function (k, ix, arr) { return arr.indexOf(k) === ix; });
      var known = !v || map[norm(v)];
      input = '<select class="kx-in"' + attrs + '><option value="">' + E(T().pick) + "</option>" + (known ? "" : '<option value="' + E(v) + '" selected>' + E(v) + "</option>") +
        opts.map(function (k) { return '<option value="' + E(k) + '"' + (norm(v) === k ? " selected" : "") + ">" + E(k) + " — " + E(map[k]) + "</option>"; }).join("") + "</select>";
    } else {
      input = '<input class="kx-in"' + attrs + ' value="' + E(v) + '"' + (type ? ' inputmode="' + type + '"' : "") + (key === "pekerjaan" ? ' list="kxJobs"' : "") + ' autocomplete="off">';
      if (key === "pekerjaan" && v && !PEKERJAAN[norm(v)]) extra = "<small>" + E(T().unknown) + "</small>" +
        '<label class="kx-f" style="margin-top:6px"><span>' + E(T().jpOver) + '</span><input class="kx-in" data-s="m" data-k="jpKerja" data-i="' + i + '" value="' + E(data.members[i].jpKerja || "") + '"></label>';
    }
    return '<label class="kx-f"><span>' + E(label) + "</span>" + input + extra + "</label>";
  }
  function dataHtml() {
    var t = T();
    var scanNote = scanState === "busy" ? '<p class="kx-note">' + E(t.scanning) + "</p>" : scanState === "ok" ? '<p class="kx-note ok">' + E(t.scanOk) + "</p>" : scanState === "err" ? '<p class="kx-note err">' + E(scanErr) + "</p>" : "";
    var h = '<p class="kx-note">' + E(t.privacy) + "</p>" +
      '<input type="file" id="kxFile" accept="image/*" style="display:none"><button class="kx-btn alt" data-a="scan"' + (scanState === "busy" ? " disabled" : "") + ">" + E(t.scan) + "</button>" + scanNote +
      '<div class="kx-blk"><h4>' + E(t.head) + "</h4>" + HEAD.map(function (f) { return field("h", f[0], f[2], null, f[0] === "no" || f[0] === "kodepos" ? "numeric" : ""); }).join("") +
      '<div class="kx-g2">' + field("d", "tglKeluar", t.issue) + field("d", "pejabat", t.official) + "</div></div>" +
      '<datalist id="kxJobs">' + Object.keys(PEKERJAAN).map(function (k) { return '<option value="' + E(k) + '">'; }).join("") + "</datalist>";
    data.members.forEach(function (m, i) {
      h += '<div class="kx-blk"><h4>' + E(t.member) + " " + (i + 1) + (m.nama ? " · " + E(m.nama) : "") + (data.members.length > 1 ? '<button class="kx-x" data-a="del" data-i="' + i + '">' + E(t.del) + "</button>" : "") + "</h4>" +
        field("m", "nama", MEM[0][2], i) + field("m", "nik", MEM[1][2], i, "numeric") +
        '<div class="kx-g2">' + field("m", "jk", MEM[2][2], i) + field("m", "hubungan", MEM[10][2], i) + field("m", "tempat", MEM[3][2], i) + field("m", "tgl", MEM[4][2] + " (" + t.date + ")", i) + "</div>" +
        field("m", "agama", MEM[5][2], i) + field("m", "pendidikan", MEM[6][2], i) + field("m", "pekerjaan", MEM[7][2], i) +
        '<div class="kx-g2">' + field("m", "status", MEM[8][2], i) + field("m", "tglKawin", MEM[9][2], i) + field("m", "wn", MEM[11][2], i) + field("m", "paspor", MEM[12][2], i) + "</div>" +
        field("m", "kitap", MEM[13][2], i) + '<div class="kx-g2">' + field("m", "ayah", MEM[14][2], i) + field("m", "ibu", MEM[15][2], i) + "</div></div>";
    });
    h += '<button class="kx-btn ghost" data-a="add">' + E(t.add) + "</button>" +
      '<div class="kx-blk"><h4>' + E(t.trans) + "</h4>" + field("t", "name", t.tName) + field("t", "addr", t.tAddr) +
      '<div class="kx-g2">' + field("t", "tel", t.tTel, null, "tel") + field("t", "date", t.tDate + " (" + t.date + ")") + "</div></div>" +
      '<button class="kx-btn" data-a="tab" data-t="doc">' + E(t.tDoc) + " →</button>" +
      '<button class="kx-btn ghost" data-a="reset">' + E(t.reset) + "</button>";
    return h;
  }
  function docTabHtml() {
    var t = T();
    if (!hasData()) return '<p class="kx-note">' + E(t.empty) + "</p>";
    var unknown = /class="x"/.test(docHtml(true));
    return (unknown ? '<p class="kx-note err">' + E(t.check) + "</p>" : "") + '<div class="kx-paper">' + docHtml(true) + "</div>" +
      '<button class="kx-btn" data-a="print">' + E(t.print) + '</button><button class="kx-btn ghost" data-a="dl">' + E(t.dl) + "</button>";
  }
  function guideHtml() {
    var t = T();
    return t.guide.map(function (g) { return '<div class="kx-blk kx-gd"><h4>' + E(g[0]) + "</h4><p>" + g[1] + "</p></div>"; }).join("") +
      '<a class="kx-a" target="_blank" rel="noopener noreferrer" href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm">' + E(t.nta) + " ↗</a>";
  }
  function draw() {
    if (!el) return;
    var t = T(), body = tab === "doc" ? docTabHtml() : tab === "guide" ? guideHtml() : dataHtml();
    var y = el.querySelector(".kx-body"), top = y ? y.scrollTop : 0;
    el.querySelector(".kx-app").innerHTML = '<div class="kx-head"><div class="kx-ttl"><b>' + E(t.title) + "</b><span>" + E(t.sub) + '</span></div><button class="kx-ib" data-a="close" aria-label="' + E(t.close) + '">✕</button></div>' +
      '<div class="kx-body"><div class="kx-tabs">' + [["data", t.tData], ["doc", t.tDoc], ["guide", t.tGuide]].map(function (x) { return '<button class="kx-tab' + (tab === x[0] ? " on" : "") + '" data-a="tab" data-t="' + x[0] + '">' + E(x[1]) + "</button>"; }).join("") + "</div>" + body + "</div>";
    var nb = el.querySelector(".kx-body"); if (nb && tab === "data") nb.scrollTop = top;
  }

  /* ---------- aksi ---------- */
  function close() { if (el) { el.remove(); el = null; } }
  function onClick(e) {
    var b = e.target.closest && e.target.closest("[data-a]"); if (!b || !el.contains(b)) return;
    var a = b.dataset.a, t = T();
    if (a === "close") close();
    else if (a === "tab") { tab = b.dataset.t; if (tab === "doc" && !data.tr.date) { data.tr.date = today(); save(); } draw(); el.querySelector(".kx-body").scrollTop = 0; }
    else if (a === "add") { data.members.push(mem()); save(); draw(); }
    else if (a === "del") { if (confirm(t.delAsk)) { data.members.splice(+b.dataset.i, 1); save(); draw(); } }
    else if (a === "reset") { if (confirm(t.resetAsk)) { data = blank(); save(); scanState = ""; draw(); } }
    else if (a === "scan") el.querySelector("#kxFile").click();
    else if (a === "print") printDoc();
    else if (a === "dl") download();
  }
  function onInput(e) {
    var x = e.target, s = x.dataset && x.dataset.s; if (!s) return;
    var obj = s === "h" ? data.head : s === "d" ? data : s === "t" ? data.tr : data.members[+x.dataset.i];
    obj[x.dataset.k] = x.value; save();
  }
  function onChange(e) {
    if (e.target.id === "kxFile") { var f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) scan(f); return; }
    onInput(e);
    var k = e.target.dataset && e.target.dataset.k; if (k === "pekerjaan" || k === "nama") draw(); // tampilkan/sembunyikan isian terjemahan pekerjaan
  }

  window.KakeiboKK = {
    open: function (ctx) {
      host = { lang: (ctx && ctx.lang) || "id", esc: (ctx && ctx.esc) || null, profileName: (ctx && ctx.profileName) || "" };
      css(); if (el) el.remove(); data = load(); tab = "data"; scanState = "";
      el = document.createElement("div"); el.className = "kx-root"; el.innerHTML = '<div class="kx-app"></div>';
      el.addEventListener("click", onClick); el.addEventListener("input", onInput); el.addEventListener("change", onChange);
      document.body.appendChild(el); draw();
    },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; close(); return true; }
  };
})();
