/* Pindah Kerja & TSK: panduan pindah kerja SSW, direktori TSK (登録支援機関) resmi, dan tips waspada.
   Data TSK: modules/tsk/*.json (dibuat otomatis oleh scripts/build-tsk.js dari register resmi Imigrasi, lisensi PDL1.0).
   Teks UI: Indonesia (id) dan Inggris (en); bahasa lain memakai Inggris. Fitur ini gratis dan tidak memonetisasi lowongan kerja. */
(function () {
  "use strict";
  var host = { lang: "id", esc: null }, el = null, tab = "guide", idx = null, idxState = "idle", shards = {}, sel = "all", fl = "all", ff = "all", q = "", shown = 30, loading = 0;
  var SRC = "https://www.moj.go.jp/isa/applications/ssw/nyuukokukanri07_00205.html";
  var PREFS = [
    ["hokkaido", "北海道", "Hokkaido"], ["aomori", "青森県", "Aomori"], ["iwate", "岩手県", "Iwate"], ["miyagi", "宮城県", "Miyagi"], ["akita", "秋田県", "Akita"], ["yamagata", "山形県", "Yamagata"], ["fukushima", "福島県", "Fukushima"],
    ["ibaraki", "茨城県", "Ibaraki"], ["tochigi", "栃木県", "Tochigi"], ["gunma", "群馬県", "Gunma"], ["saitama", "埼玉県", "Saitama"], ["chiba", "千葉県", "Chiba"], ["tokyo", "東京都", "Tokyo"], ["kanagawa", "神奈川県", "Kanagawa"],
    ["niigata", "新潟県", "Niigata"], ["toyama", "富山県", "Toyama"], ["ishikawa", "石川県", "Ishikawa"], ["fukui", "福井県", "Fukui"], ["yamanashi", "山梨県", "Yamanashi"], ["nagano", "長野県", "Nagano"], ["gifu", "岐阜県", "Gifu"],
    ["shizuoka", "静岡県", "Shizuoka"], ["aichi", "愛知県", "Aichi"], ["mie", "三重県", "Mie"], ["shiga", "滋賀県", "Shiga"], ["kyoto", "京都府", "Kyoto"], ["osaka", "大阪府", "Osaka"], ["hyogo", "兵庫県", "Hyogo"], ["nara", "奈良県", "Nara"],
    ["wakayama", "和歌山県", "Wakayama"], ["tottori", "鳥取県", "Tottori"], ["shimane", "島根県", "Shimane"], ["okayama", "岡山県", "Okayama"], ["hiroshima", "広島県", "Hiroshima"], ["yamaguchi", "山口県", "Yamaguchi"], ["tokushima", "徳島県", "Tokushima"],
    ["kagawa", "香川県", "Kagawa"], ["ehime", "愛媛県", "Ehime"], ["kochi", "高知県", "Kochi"], ["fukuoka", "福岡県", "Fukuoka"], ["saga", "佐賀県", "Saga"], ["nagasaki", "長崎県", "Nagasaki"], ["kumamoto", "熊本県", "Kumamoto"],
    ["oita", "大分県", "Oita"], ["miyazaki", "宮崎県", "Miyazaki"], ["kagoshima", "鹿児島県", "Kagoshima"], ["okinawa", "沖縄県", "Okinawa"], ["other", "その他", "Other"]
  ];

  var LANGMAP = {
    "インドネシア語": ["Indonesia", "Indonesian"], "英語": ["Inggris", "English"], "ベトナム語": ["Vietnam", "Vietnamese"], "中国語": ["Mandarin", "Chinese"], "韓国語": ["Korea", "Korean"],
    "タイ語": ["Thai", "Thai"], "ミャンマー語": ["Myanmar", "Burmese"], "ビルマ語": ["Myanmar", "Burmese"], "ネパール語": ["Nepal", "Nepali"], "カンボジア語": ["Khmer", "Khmer"], "クメール語": ["Khmer", "Khmer"],
    "モンゴル語": ["Mongolia", "Mongolian"], "タガログ語": ["Tagalog", "Tagalog"], "フィリピン語": ["Filipino", "Filipino"], "ベンガル語": ["Bengali", "Bengali"], "ヒンディー語": ["Hindi", "Hindi"],
    "シンハラ語": ["Sinhala", "Sinhala"], "ウルドゥー語": ["Urdu", "Urdu"], "マレー語": ["Melayu", "Malay"], "ロシア語": ["Rusia", "Russian"], "ポルトガル語": ["Portugis", "Portuguese"],
    "スペイン語": ["Spanyol", "Spanish"], "フランス語": ["Prancis", "French"], "ドイツ語": ["Jerman", "German"], "日本語": ["Jepang", "Japanese"], "ウズベク語": ["Uzbek", "Uzbek"], "タミル語": ["Tamil", "Tamil"],
    "ラオス語": ["Laos", "Lao"], "ラオ語": ["Laos", "Lao"], "アラビア語": ["Arab", "Arabic"], "トルコ語": ["Turki", "Turkish"]
  };
  function splitTok(v) { return String(v || "").split(/[・、,，\/\n;；]/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function langLabel(tk) { var m = LANGMAP[tk]; return m ? (host.lang === "id" ? m[0] : m[1]) : tk; }
  var UI = {
    id: {
      title: "Pindah Kerja & TSK", sub: "Panduan pindah kerja SSW dan daftar TSK resmi", tabGuide: "Panduan", tabFind: "Cari TSK", tabSafe: "Waspada", back: "Tutup",
      note: "Ringkasan dari sumber umum, bukan nasihat hukum. Aturan bisa berubah dan setiap kasus berbeda. Konfirmasi ke Imigrasi (ISA), FRESC, atau 行政書士 sebelum bertindak.",
      gTitle: "Langkah pindah kerja SSW",
      steps: [
        ["Pastikan sektor tujuan", "Pindah ke perusahaan di sektor yang sama umumnya paling mudah. Pindah ke sektor lain biasanya mengharuskan lulus tes keterampilan sektor baru."],
        ["Cari perusahaan baru", "Cari lewat Hello Work, agen penyalur berizin, atau kenalan. Pastikan perusahaan itu bisa menerima pekerja SSW dan siap memberi dukungan (sendiri atau lewat TSK)."],
        ["Siapkan dokumen", "Siapkan dokumen yang diminta imigrasi, misalnya surat keterangan pajak dari kantor kota. Simpan salinan kontrak dan slip gaji."],
        ["Ajukan perubahan status residensi", "Pindah kerja membutuhkan pengajuan perubahan status residensi (在留資格変更許可申請) ke kantor imigrasi, dengan dokumen dari perusahaan baru. Prosesnya bisa lebih dari sebulan, jadi mulai lebih awal."],
        ["Tunggu izin sebelum bekerja", "Kamu baru boleh bekerja sebagai SSW di perusahaan baru setelah izin atau visa barunya terbit. Jangan mulai bekerja lebih dulu."],
        ["Jangan menganggur terlalu lama", "Umumnya, tidak menjalankan kegiatan sesuai status residensi selama 3 bulan atau lebih bisa menjadi alasan pencabutan status. Tanyakan ke imigrasi atau FRESC tentang pilihanmu selama mencari kerja."],
        ["Urus alamat dan administrasi", "Kalau ikut pindah rumah, urus pindah alamat di kantor kota, lalu beri tahu kantor pos, bank, dan asuransi."]
      ],
      tTitle: "Apa itu TSK?",
      tIntro: "TSK (登録支援機関) adalah lembaga yang terdaftar di Imigrasi untuk membantu pekerja SSW 1 atas permintaan perusahaan. Pendaftarannya berlaku 5 tahun. Yang menyerahkan dukungan ke TSK adalah perusahaan, jadi biasanya perusahaan yang memilih TSK.",
      tTen: "Dukungan wajib untuk SSW 1 ada 10 jenis, antara lain informasi sebelum datang, penjemputan, bantuan tempat tinggal, orientasi hidup, pendampingan administrasi, kesempatan belajar bahasa Jepang, konsultasi, pertukaran dengan warga lokal, bantuan mencari pekerjaan baru bila kontrak berakhir bukan atas kemauan pekerja, dan wawancara berkala. (Ringkasan; cek rincian resmi di situs Imigrasi.)",
      askTitle: "Tanyakan ke TSK",
      ask: ["Apakah TSK ini membantu mencarikan perusahaan baru kalau saya ingin pindah kerja? Apakah gratis?", "Bahasa apa yang bisa dilayani untuk konsultasi?", "Apakah ada biaya, uang jaminan, atau denda yang harus saya bayar?", "Kalau mereka mencarikan pekerjaan, apa nomor izin 有料職業紹介 (izin penyalur tenaga kerja) mereka?", "Apa yang terjadi pada dukungan untuk saya setelah saya pindah perusahaan?"],
      fTitle: "Daftar TSK resmi", fSearch: "Cari nama atau nomor registrasi", fAll: "Semua prefektur", fHint: "Pilih prefektur, bahasa, atau ketik minimal 2 karakter.", fCount: "{n} hasil", fMore: "Tampilkan lebih banyak", fLoading: "Memuat data…", fNone: "Tidak ada hasil.",
      copy: "Salin telepon", copyMail: "Salin email", copied: "Tersalin", map: "Peta", call: "Telepon", mail: "Email", regDate: "Terdaftar", regNo: "No. registrasi", extra: "Dukungan tambahan", hq: "Alamat terdaftar", note: "Catatan TSK", legend: "Tag hijau = bisa bahasa Indonesia. Tag biru “Dukungan tambahan” = TSK menyatakan di register ada dukungan di luar yang diwajibkan hukum.", langs: "Bahasa", fieldsL: "Bidang", allLang: "Semua bahasa", allField: "Semua bidang", noField: "Register resmi tidak mencantumkan bidang pekerjaan tiap TSK. Tanyakan langsung ke TSK sektor apa yang mereka tangani.", noContact: "Register resmi tidak mencantumkan nomor telepon atau email untuk TSK ini.", indiv: "Pendaftar perorangan: hanya kota yang ditampilkan.",
      dataDate: "Data per {d}", noData: "Data TSK belum tersedia. Data muncul setelah pembaruan otomatis pertama selesai. Sementara itu, buka daftar resmi:", official: "Daftar resmi (Imigrasi)",
      disc: "Daftar ini hanya memuat lembaga yang terdaftar. Tidak ada informasi dukungan pindah kerja atau mutu layanan, dan ini bukan rekomendasi. Tanyakan langsung ke TSK.",
      attr: "Sumber: 「登録支援機関登録簿」（出入国在留管理庁ホームページ）", attr2: "diolah oleh Kakeibo",
      sTitle: "Tanda bahaya",
      flags: ["Diminta membayar uang untuk “mencarikan kerja” atau uang jaminan di muka.", "Paspor atau kartu residenmu ditahan oleh perusahaan atau agen.", "Isi kontrak berbeda dari yang dijanjikan, atau tidak dijelaskan dalam bahasa yang kamu mengerti.", "Disuruh mulai bekerja di perusahaan baru sebelum izin perubahan status keluar.", "TSK atau agen tidak bisa menunjukkan nomor registrasi atau nomor izin penyalurnya."],
      sCheck: "Cara mengecek TSK", sCheckT: "Cari nama dan nomor registrasinya di tab Cari TSK (data resmi Imigrasi). Kalau tidak ada, hati-hati dan tanyakan ke tempat konsultasi resmi.",
      sHelp: "Tempat konsultasi resmi", help1: "Pusat Informasi Imigrasi untuk Warga Asing (外国人在留総合インフォメーションセンター)", help2: "FRESC (外国人在留支援センター)", help3: "Daftar tempat konsultasi Imigrasi", helpNote: "Nomor dan layanan bisa berubah. Cek di situs resmi."
    },
    en: {
      title: "Job Change & TSK", sub: "SSW job change guide and the official TSK list", tabGuide: "Guide", tabFind: "Find TSK", tabSafe: "Stay safe", back: "Close",
      note: "A summary from general sources, not legal advice. Rules can change and every case is different. Confirm with Immigration (ISA), FRESC or a 行政書士 before you act.",
      gTitle: "Steps to change jobs on SSW",
      steps: [
        ["Check the target sector", "Moving to a company in the same sector is usually the simplest. Moving to another sector generally means passing the skills test for the new sector."],
        ["Find a new employer", "Look through Hello Work, licensed placement agencies or people you know. Make sure the company can accept SSW workers and can provide support (itself or through a TSK)."],
        ["Prepare documents", "Prepare the documents immigration asks for, such as tax certificates from your city office. Keep copies of your contract and pay slips."],
        ["Apply for a change of status", "Changing employer requires applying to immigration for a change of status (在留資格変更許可申請), with documents from the new company. It can take more than a month, so start early."],
        ["Wait for approval before you work", "You may only start working as SSW at the new company after the new permission or visa is issued. Do not start earlier."],
        ["Avoid long gaps without work", "In general, not carrying out activities that match your status for 3 months or more can be grounds for cancelling the status. Ask immigration or FRESC about your options while you search."],
        ["Handle your address and admin", "If you also move house, file the address change at your city office, then tell the post office, your bank and your insurance."]
      ],
      tTitle: "What is a TSK?",
      tIntro: "A TSK (登録支援機関, Registered Support Organization) is an organization registered with Immigration to support SSW 1 workers when a company entrusts it. Registration is valid for 5 years. It is the company that entrusts support to a TSK, so usually the company chooses the TSK.",
      tTen: "Mandatory support for SSW 1 covers 10 items, including pre-arrival information, airport pick-up, housing help, life orientation, help with procedures, Japanese learning opportunities, consultation, exchange with local people, help finding a new job if the contract ends against the worker's will, and regular interviews. (Summary; check the official details on the Immigration site.)",
      askTitle: "Questions to ask a TSK",
      ask: ["Does this TSK help find a new company if I want to change jobs? Is it free?", "Which languages can you offer consultation in?", "Is there any fee, deposit or penalty I would have to pay?", "If you find jobs for people, what is your 有料職業紹介 (placement licence) number?", "What happens to my support after I move to another company?"],
      fTitle: "Official TSK list", fSearch: "Search by name or registration no.", fAll: "All prefectures", fHint: "Choose a prefecture, a language, or type at least 2 characters.", fCount: "{n} results", fMore: "Show more", fLoading: "Loading data…", fNone: "No results.",
      copy: "Copy phone", copyMail: "Copy email", copied: "Copied", map: "Map", call: "Call", mail: "Email", regDate: "Registered", regNo: "Reg. no.", extra: "Extra support", hq: "Registered address", note: "TSK note", legend: "Green tag = Indonesian is supported. Blue “Extra support” tag = the TSK states in the register that it offers support beyond what the law requires.", langs: "Languages", fieldsL: "Fields", allLang: "All languages", allField: "All fields", noField: "The official register does not list the job fields of each TSK. Ask the TSK directly which sectors they handle.", noContact: "The official register has no phone number or email for this TSK.", indiv: "Individual registrant: only the city is shown.",
      dataDate: "Data as of {d}", noData: "TSK data isn't available yet. It appears once the first automatic update has finished. Meanwhile, open the official list:", official: "Official list (ISA)",
      disc: "This list only shows registered organizations. It has no information about job-change support or service quality, and it is not a recommendation. Ask the TSK directly.",
      attr: "Source: 「登録支援機関登録簿」 (Immigration Services Agency of Japan website)", attr2: "edited by Kakeibo",
      sTitle: "Warning signs",
      flags: ["You are asked to pay money to “find you a job” or a deposit up front.", "Your passport or residence card is held by the company or agent.", "The contract differs from what was promised, or it isn't explained in a language you understand.", "You are told to start at the new company before the change-of-status permission is issued.", "The TSK or agent cannot show its registration number or placement licence number."],
      sCheck: "How to check a TSK", sCheckT: "Look up its name and registration number in the Find TSK tab (official Immigration data). If it isn't there, be careful and ask an official consultation service.",
      sHelp: "Official consultation services", help1: "Immigration information centre for foreign residents (外国人在留総合インフォメーションセンター)", help2: "FRESC (外国人在留支援センター)", help3: "Immigration consultation list", helpNote: "Numbers and services can change. Check the official site."
    }
  };
  function T() { return host.lang === "id" ? UI.id : UI.en; }
  function E(s) { return host.esc ? host.esc(s) : String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(s) { return el && el.querySelector(s); }
  function prefName(slug) { for (var i = 0; i < PREFS.length; i++) if (PREFS[i][0] === slug) return PREFS[i]; return null; }
  function norm(s) { return String(s || "").replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).toLowerCase(); }

  var IC = { x: '<path d="M6 6l12 12M18 6 6 18"/>', link: '<path d="M7 17 17 7M9 7h8v8"/>', phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>', pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>' };
  function ic(n, s) { s = s || 18; return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>"; }

  function css() {
    if (document.getElementById("tkCss")) return;
    var s = document.createElement("style"); s.id = "tkCss";
    s.textContent = [
      ".tk-root{position:fixed;inset:0;z-index:67;display:flex;justify-content:center;background:rgba(23,35,61,.55);font-family:Inter,sans-serif;animation:fadeIn .2s both}",
      ".tk-app{width:100%;max-width:480px;height:100dvh;display:flex;flex-direction:column;background:var(--washi,#ece3ce);color:var(--sumi,#2a251d)}",
      ".tk-head{display:flex;align-items:center;gap:6px;padding:calc(env(safe-area-inset-top,0px) + 8px) 10px 8px 14px;background:rgba(251,247,234,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line,rgba(122,110,80,.24))}",
      ".tk-ib{width:42px;height:42px;border:0;border-radius:50%;background:none;color:inherit;display:grid;place-items:center;cursor:pointer;flex:0 0 42px}.tk-ib:active{background:rgba(23,35,61,.08)}",
      ".tk-ttl{flex:1;min-width:0}.tk-ttl b{display:block;font:800 17px 'Shippori Mincho',serif}.tk-ttl span{display:block;font-size:12px;color:var(--mist,#6d6759);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".tk-body{flex:1;min-height:0;overflow-y:auto;padding:14px 16px 32px;-webkit-overflow-scrolling:touch}",
      ".tk-tabs{display:flex;gap:6px;margin:0 0 14px}.tk-tab{flex:1;border:0;border-radius:12px;padding:10px 4px;background:rgba(23,35,61,.07);color:inherit;font:700 12.5px Inter,sans-serif;cursor:pointer}.tk-tab.on{background:var(--ai,#17233d);color:#fff}",
      ".tk-note{font-size:12px;line-height:1.5;color:var(--mist,#6d6759);margin:0 2px 14px}",
      ".tk-h{font:800 15px 'Shippori Mincho',serif;margin:18px 2px 8px}",
      ".tk-step{display:flex;gap:12px;padding:12px 2px;border-bottom:1px solid var(--line,rgba(122,110,80,.24))}.tk-step:last-child{border-bottom:0}.tk-num{flex:0 0 28px;height:28px;border-radius:10px;background:var(--ai,#17233d);color:#fff;display:grid;place-items:center;font:700 13px Inter,sans-serif}.tk-step b{display:block;font:700 14.5px Inter,sans-serif;margin-bottom:3px}.tk-step p{margin:0;font-size:13.5px;line-height:1.55}",
      ".tk-blk{background:var(--card,#fbf7ea);border-radius:18px;padding:13px 15px;margin-bottom:12px;font-size:13.5px;line-height:1.55}.tk-blk p{margin:0 0 8px}.tk-blk p:last-child{margin-bottom:0}.tk-blk ul{margin:0;padding-left:18px}.tk-blk li{margin:0 0 6px}",
      ".tk-blk.warn{background:#fdeceb;border:1px solid #e8aaa4}",
      ".tk-row{display:flex;gap:8px;margin-bottom:10px}.tk-sel,.tk-in{width:100%;font:inherit;font-size:max(16px,14px);padding:12px 14px;border-radius:14px;border:1px solid var(--line,rgba(122,110,80,.3));background:#fff;color:inherit;outline:0}.tk-sel{flex:0 0 46%}",
      ".tk-item{padding:13px 2px;border-bottom:1px solid var(--line,rgba(122,110,80,.24))}.tk-item b{display:block;font:700 15px/1.4 'Shippori Mincho',serif;overflow-wrap:anywhere}.tk-item .en{font-size:12.5px;color:var(--mist,#6d6759);margin-top:1px;overflow-wrap:anywhere}",
      ".tk-reg{display:inline-block;margin-top:6px;font:700 11.5px Inter,sans-serif;background:rgba(23,35,61,.08);border-radius:99px;padding:3px 9px}.tk-addr{font-size:13px;margin-top:6px;line-height:1.45;overflow-wrap:anywhere}.tk-meta{font-size:12px;color:var(--mist,#6d6759);margin-top:3px}",
      ".tk-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.tk-chip{display:inline-flex;align-items:center;gap:5px;border:0;border-radius:99px;padding:7px 12px;background:rgba(23,35,61,.08);color:inherit;font:700 12px Inter,sans-serif;cursor:pointer;text-decoration:none}",
      ".tk-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.tk-tag{font:700 11px Inter,sans-serif;border-radius:99px;padding:3px 9px;background:rgba(23,35,61,.08)}.tk-tag.f{background:rgba(217,130,47,.2);color:#8a5a0c}.tk-tag.id{background:#eaf6ee;color:#25724a}.tk-tag.x{background:#e4ecf8;color:#1f4a8a}.tk-ct{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:13px;overflow-wrap:anywhere}.tk-ct a{color:inherit;font-weight:600}.tk-rn{font-size:11px;color:var(--mist,#6d6759);margin-top:6px}",
      ".tk-btn{width:100%;border:0;border-radius:13px;padding:12px;background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff;font:700 14px Inter,sans-serif;cursor:pointer;margin-top:10px}",
      ".tk-link{display:flex;align-items:center;justify-content:space-between;gap:8px;text-decoration:none;color:inherit;padding:12px 2px;border-bottom:1px solid var(--line,rgba(122,110,80,.24));font:600 13.5px/1.4 Inter,sans-serif}.tk-link small{display:block;font:500 12px Inter,sans-serif;color:var(--mist,#6d6759)}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---- data ---- */
  function loadIndex(cb) {
    if (idxState === "ready" || idxState === "missing") return cb();
    if (idxState === "loading") return;
    idxState = "loading";
    fetch("modules/tsk/index.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { idx = j; idxState = "ready"; cb(); }).catch(function () { idxState = "missing"; cb(); });
  }
  function loadShard(slug, cb) {
    if (shards[slug]) return cb();
    fetch("modules/tsk/" + slug + ".json").then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { shards[slug] = j; cb(); }).catch(function () { shards[slug] = []; cb(); });
  }
  function neededSlugs() { return !idx ? [] : (sel === "all" ? Object.keys(idx.prefs) : (idx.prefs[sel] ? [sel] : [])); }
  function results() {
    var qn = norm(q).trim(), out = [];
    neededSlugs().forEach(function (slug) {
      (shards[slug] || []).forEach(function (r) {
        if (fl !== "all" && splitTok(r[6]).indexOf(fl) < 0) return;
        if (ff !== "all" && splitTok(r[9]).indexOf(ff) < 0) return;
        if (!qn || norm(r[0]).indexOf(qn) >= 0 || norm(r[1]).indexOf(qn) >= 0 || norm(r[2]).indexOf(qn) >= 0 || norm(r[3]).indexOf(qn) >= 0) out.push(r);
      });
    });
    return out;
  }
  function item(r) {
    var t = T(), ind = r[7] === 1, tel = String(r[4] || "").replace(/[^\d+]/g, ""), mail = String(r[8] || "").split(/[;,]/)[0].trim();
    var lg = splitTok(r[6]), fd = splitTok(r[9]);
    var tags = lg.slice(0, 8).map(function (x) { return '<span class="tk-tag' + (x === "インドネシア語" ? " id" : "") + '">' + E(langLabel(x)) + "</span>"; }).join("") + (lg.length > 8 ? '<span class="tk-tag">+' + (lg.length - 8) + "</span>" : "") +
      fd.map(function (x) { return '<span class="tk-tag f">' + E(x) + "</span>"; }).join("") + (r[12] === 1 ? '<span class="tk-tag x">' + t.extra + "</span>" : "");
    var h = '<div class="tk-item"><b>' + E(r[1]) + "</b>" + (r[2] ? '<div class="en">' + E(r[2]) + "</div>" : "") + (tags ? '<div class="tk-tags">' + tags + "</div>" : "") + (r[3] ? '<div class="tk-addr">' + E(r[3]) + "</div>" : "");
    if (!ind && tel) h += '<div class="tk-ct">' + ic("phone", 15) + ' <a href="tel:' + E(tel) + '">' + E(r[4]) + "</a></div>";
    if (!ind && mail) h += '<div class="tk-ct">' + ic("mail", 15) + ' <a href="mailto:' + E(mail) + '">' + E(mail) + "</a></div>";
    if (!ind && r[10]) h += '<div class="tk-meta">' + t.hq + ": " + E(r[10]) + "</div>";
    if (!ind && r[11]) h += '<div class="tk-meta">' + t.note + ": " + E(r[11]) + "</div>";
    if (ind) h += '<div class="tk-meta">' + t.indiv + "</div>";
    else if (!tel && !mail) h += '<div class="tk-meta">' + t.noContact + "</div>";
    h += '<div class="tk-acts">' + (!ind && tel ? '<button class="tk-chip" data-a="copy" data-v="' + E(r[4]) + '">' + ic("copy", 14) + " " + t.copy + "</button>" : "") + (!ind && mail ? '<button class="tk-chip" data-a="copy" data-v="' + E(mail) + '">' + ic("copy", 14) + " " + t.copyMail + "</button>" : "") +
      (!ind && tel ? '<a class="tk-chip" href="tel:' + E(tel) + '">' + ic("phone", 14) + " " + t.call + "</a>" : "") +
      (r[3] && !ind ? '<a class="tk-chip" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(r[1] + " " + r[3]) + '">' + ic("pin", 14) + " " + t.map + "</a>" : "") + "</div>" +
      '<div class="tk-rn">' + t.regNo + ": " + E(r[0]) + (r[5] ? " · " + t.regDate + " " + E(r[5]) : "") + "</div></div>";
    return h;
  }
  function drawResults() {
    var box = $("#tkRes"); if (!box) return;
    var t = T(), qn = q.trim();
    if (sel === "all" && fl === "all" && ff === "all" && qn.length < 2) { box.innerHTML = '<div class="tk-note">' + t.fHint + "</div>"; return; }
    var need = neededSlugs().filter(function (s) { return !shards[s]; });
    if (need.length) {
      var my = ++loading; box.innerHTML = '<div class="tk-note">' + t.fLoading + (need.length > 1 ? " 0/" + need.length : "") + "</div>";
      var done = 0;
      need.forEach(function (s) { loadShard(s, function () { done++; if (my !== loading) return; if (done === need.length) drawResults(); else { var n = $("#tkRes .tk-note"); if (n) n.textContent = t.fLoading + " " + done + "/" + need.length; } }); });
      return;
    }
    var res = results();
    box.innerHTML = '<div class="tk-note">' + t.fCount.replace("{n}", res.length) + "</div>" + (res.length ? res.slice(0, shown).map(item).join("") : '<div class="tk-note">' + t.fNone + "</div>") +
      (res.length > shown ? '<button class="tk-btn" data-a="more">' + t.fMore + "</button>" : "");
  }

  /* ---- tampilan ---- */
  function guideHtml() {
    var t = T(), h = '<div class="tk-note">' + t.note + '</div><div class="tk-h">' + t.gTitle + "</div>" +
      t.steps.map(function (s, i) { return '<div class="tk-step"><div class="tk-num">' + (i + 1) + "</div><div><b>" + E(s[0]) + "</b><p>" + E(s[1]) + "</p></div></div>"; }).join("");
    h += '<div class="tk-h">' + t.tTitle + '</div><div class="tk-blk"><p>' + E(t.tIntro) + "</p><p>" + E(t.tTen) + '</p></div><div class="tk-h">' + t.askTitle + '</div><div class="tk-blk"><ul>' + t.ask.map(function (a) { return "<li>" + E(a) + "</li>"; }).join("") + "</ul></div>";
    return h;
  }
  function findHtml() {
    var t = T(), h = "";
    if (idxState === "missing") return '<div class="tk-blk"><p>' + t.noData + '</p></div><a class="tk-link" target="_blank" rel="noopener noreferrer" href="' + SRC + '"><span>' + t.official + "</span>" + ic("link", 16) + "</a>";
    if (idxState !== "ready") return '<div class="tk-note">' + t.fLoading + "</div>";
    var langOpts = Object.keys(idx.langs || {}).sort(function (a, b) { return (a === "インドネシア語" ? -1 : b === "インドネシア語" ? 1 : idx.langs[b] - idx.langs[a]); });
    var fieldOpts = Object.keys(idx.fields || {}).sort(function (a, b) { return idx.fields[b] - idx.fields[a]; });
    h += '<div class="tk-note">' + t.disc + '</div><div class="tk-row"><select class="tk-sel" id="tkSel" style="flex:1"><option value="all">' + t.fAll + "</option>" +
      PREFS.filter(function (p) { return idx.prefs[p[0]]; }).map(function (p) { return '<option value="' + p[0] + '"' + (sel === p[0] ? " selected" : "") + ">" + E(p[2] + " (" + p[1] + ") · " + idx.prefs[p[0]]) + "</option>"; }).join("") + "</select>";
    if (langOpts.length) h += '<select class="tk-sel" id="tkLang" style="flex:1"><option value="all">' + t.allLang + "</option>" + langOpts.map(function (x) { return '<option value="' + E(x) + '"' + (fl === x ? " selected" : "") + ">" + E(langLabel(x) + " · " + idx.langs[x]) + "</option>"; }).join("") + "</select>";
    h += "</div>";
    if (fieldOpts.length) h += '<div class="tk-row"><select class="tk-sel" id="tkField" style="flex:1"><option value="all">' + t.allField + "</option>" + fieldOpts.map(function (x) { return '<option value="' + E(x) + '"' + (ff === x ? " selected" : "") + ">" + E(x + " · " + idx.fields[x]) + "</option>"; }).join("") + "</select></div>";
    else h += '<div class="tk-note">' + t.noField + "</div>";
    h += '<div class="tk-row"><input class="tk-in" id="tkQ" type="search" autocomplete="off" placeholder="' + E(t.fSearch) + '" value="' + E(q) + '"></div><div class="tk-note">' + t.legend + '</div><div id="tkRes"></div>';
    h += '<div class="tk-note" style="margin-top:16px">' + t.dataDate.replace("{d}", E(idx.updated || "")) + " · " + idx.total + "<br>" + t.attr + " " + SRC + " " + t.attr2 + ".<br>「登録支援機関登録簿」（出入国在留管理庁ホームページ）（" + SRC + "）をもとにKakeibo作成</div>";
    return h;
  }
  function safeHtml() {
    var t = T();
    return '<div class="tk-note">' + t.note + '</div><div class="tk-h">' + t.sTitle + '</div><div class="tk-blk warn"><ul>' + t.flags.map(function (f) { return "<li>" + E(f) + "</li>"; }).join("") + '</ul></div><div class="tk-h">' + t.sCheck + '</div><div class="tk-blk"><p>' + E(t.sCheckT) + '</p></div><div class="tk-h">' + t.sHelp + "</div>" +
      '<a class="tk-link" target="_blank" rel="noopener noreferrer" href="https://www.moj.go.jp/isa/support/consultation/index.html"><span>' + E(t.help1) + "<small>0570-013904</small></span>" + ic("link", 16) + "</a>" +
      '<a class="tk-link" target="_blank" rel="noopener noreferrer" href="https://www.moj.go.jp/isa/support/fresc/fresc01.html"><span>' + E(t.help2) + "<small>0570-011000</small></span>" + ic("link", 16) + "</a>" +
      '<a class="tk-link" target="_blank" rel="noopener noreferrer" href="https://www.moj.go.jp/isa/support/consultation/index.html"><span>' + E(t.help3) + "</span>" + ic("link", 16) + "</a>" +
      '<div class="tk-note" style="margin-top:10px">' + t.helpNote + "</div>";
  }
  function draw() {
    var t = T(), body = tab === "guide" ? guideHtml() : tab === "find" ? findHtml() : safeHtml();
    el.querySelector(".tk-app").innerHTML = '<div class="tk-head"><div class="tk-ttl"><b>' + E(t.title) + "</b><span>" + E(t.sub) + '</span></div><button class="tk-ib" data-a="close" aria-label="' + E(t.back) + '">' + ic("x", 20) + '</button></div><div class="tk-body" id="tkBody"><div class="tk-tabs">' +
      [["guide", t.tabGuide], ["find", t.tabFind], ["safe", t.tabSafe]].map(function (x) { return '<button class="tk-tab' + (tab === x[0] ? " on" : "") + '" data-a="tab" data-t="' + x[0] + '">' + E(x[1]) + "</button>"; }).join("") + "</div>" + body + "</div>";
    if (tab === "find" && idxState === "ready") drawResults();
  }

  /* ---- aksi ---- */
  function close() { if (el) { el.remove(); el = null; } }
  function onClick(e) {
    var b = e.target.closest && e.target.closest("[data-a]"); if (!b || !el.contains(b)) return;
    var a = b.dataset.a;
    if (a === "close") close();
    else if (a === "tab") { tab = b.dataset.t; if (tab === "find") { loadIndex(function () { if (el && tab === "find") draw(); }); } draw(); }
    else if (a === "more") { shown += 30; drawResults(); }
    else if (a === "copy") { var v = b.dataset.v; try { navigator.clipboard.writeText(v); } catch (x) {} var o = b.innerHTML; b.textContent = T().copied; setTimeout(function () { if (b.isConnected) b.innerHTML = o; }, 1200); }
  }
  function onChange(e) { var id = e.target.id; if (id === "tkSel") sel = e.target.value; else if (id === "tkLang") fl = e.target.value; else if (id === "tkField") ff = e.target.value; else return; shown = 30; drawResults(); }
  function onInput(e) { if (e.target.id === "tkQ") { q = e.target.value; shown = 30; clearTimeout(onInput.t); onInput.t = setTimeout(drawResults, 180); } }

  window.KakeiboTsk = {
    open: function (ctx) {
      host = { lang: (ctx && ctx.lang) || "id", esc: (ctx && ctx.esc) || null };
      css(); if (el) el.remove();
      el = document.createElement("div"); el.className = "tk-root"; el.innerHTML = '<div class="tk-app"></div>';
      el.addEventListener("click", onClick); el.addEventListener("change", onChange); el.addEventListener("input", onInput);
      document.body.appendChild(el); tab = "guide"; q = ""; sel = "all"; fl = "all"; ff = "all"; shown = 30; draw();
    },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; close(); return true; }
  };
})();
