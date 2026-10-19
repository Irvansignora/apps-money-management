/* Kakeibo · Belajar JLPT N5–N1 (GRATIS, offline, tanpa API): kotoba, bunpou, kanji, dan latihan soal.
 * Mandiri dan terpisah dari LEA Sensei (kaiwa AI, Premium+). Data dari modules/jlpt/n5..n1.js dan grammar.js (dimuat per level saat dibuka);
 * daftar pola bunpou dari modules/lea-study-data.js. Dipanggil: KakeiboJlpt.open({ lang, esc }). Progres tersimpan di HP. */
(function () {
  "use strict";
  var host = { lang: "id" }, el = null, view = "study";
  var LEVELS = ["N5", "N4", "N3", "N2", "N1"], level = "N5";
  var KEY = "kakeibo-jlpt-progress", OLDKEY = "kakeibo-lea-progress", prog = {};
  try {
    var sl = localStorage.getItem("kakeibo-jlpt-level") || localStorage.getItem("kakeibo-lea-level"); if (LEVELS.indexOf(sl) >= 0) level = sl;
    prog = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!prog) { // pindahan: progres belajar lama dulu disimpan bersama progres LEA
      prog = {}; var old = JSON.parse(localStorage.getItem(OLDKEY) || "{}") || {};
      Object.keys(old).forEach(function (k) { if (k.indexOf("s|") === 0) prog[k] = old[k]; });
      localStorage.setItem(KEY, JSON.stringify(prog));
    }
  } catch (e) { prog = {}; }
  var saveProg = function () { try { localStorage.setItem(KEY, JSON.stringify(prog)); } catch (e) {} };

  var UI = {"id": {"next": "Lanjut", "back": "Kembali", "qOf": "Soal {n} dari {m}", "lvDesc": ["Pemula", "Dasar", "Menengah", "Menengah atas", "Mahir"], "resultT": "Hasil latihan", "sRetry": "Coba lagi", "prep": "Memuat…", "seeScore": "Lihat nilai", "sBest": "Nilai terbaik", "tabG": "Bunpou", "kunT": "Kun (bacaan Jepang)", "toList": "Kembali ke daftar", "notesT": "Catatan", "formT": "Cara membentuk", "noT": "Kurang tepat", "tabV": "Kotoba", "errNet": "Tidak bisa terhubung. Coba lagi.", "studySub": "Kotoba, bunpou, kanji, dan latihan sesuai level", "okT": "Benar!", "study": "Belajar JLPT", "exampleT": "Contoh", "kanjiSoon": "Belum ada data kanji untuk level ini.", "quizBtn": "Latihan soal", "quizAgain": "Latihan lagi", "say": "Ucapkan", "onT": "On (bacaan Cina)", "tabKj": "Kanji 漢字", "freeTag": "Gratis"}, "en": {"next": "Next", "back": "Back", "qOf": "Question {n} of {m}", "lvDesc": ["Beginner", "Elementary", "Intermediate", "Upper-intermediate", "Advanced"], "resultT": "Practice result", "sRetry": "Try again", "prep": "Loading…", "seeScore": "See score", "sBest": "Best score", "tabG": "Bunpou", "kunT": "Kun'yomi", "toList": "Back to the list", "notesT": "Notes", "formT": "How to form", "noT": "Not quite", "tabV": "Kotoba", "errNet": "Cannot connect. Try again.", "studySub": "Kotoba, bunpou, kanji and practice for your level", "okT": "Correct!", "study": "JLPT study", "exampleT": "Examples", "kanjiSoon": "No kanji data for this level yet.", "quizBtn": "Practice quiz", "quizAgain": "Practice again", "say": "Play", "onT": "On'yomi", "tabKj": "Kanji 漢字", "freeTag": "Free"}, "my": {"next": "ဆက်သွားရန်", "back": "နောက်သို့", "qOf": "မေးခွန်း {n}/{m}", "lvDesc": ["အစပြု", "အခြေခံ", "အလယ်အလတ်", "အလယ်အလတ်အထက်", "ကျွမ်းကျင်"], "resultT": "လေ့ကျင့်ခန်း ရလဒ်", "sRetry": "ထပ်ကြိုးစားပါ", "prep": "ဖွင့်နေသည်…", "seeScore": "ရလဒ်ကြည့်ရန်", "sBest": "အကောင်းဆုံးရမှတ်", "tabG": "သဒ္ဒါ", "kunT": "Kun'yomi", "toList": "စာရင်းသို့ ပြန်သွားရန်", "notesT": "မှတ်ချက်", "formT": "ဖွဲ့နည်း", "noT": "မမှန်ပါ", "tabV": "ဝေါဟာရ", "errNet": "ချိတ်ဆက်၍မရပါ။ ထပ်ကြိုးစားပါ။", "studySub": "အဆင့်အလိုက် ဝေါဟာရ၊ သဒ္ဒါ၊ ကန်ဂျိနှင့် လေ့ကျင့်ခန်း", "okT": "မှန်ပါသည်!", "study": "JLPT လေ့လာရန်", "exampleT": "ဥပမာ", "kanjiSoon": "ဤအဆင့်အတွက် ကန်ဂျိ ဒေတာ မရှိသေးပါ။", "quizBtn": "လေ့ကျင့်ခန်း", "quizAgain": "ထပ်လေ့ကျင့်ရန်", "say": "နားထောင်ရန်", "onT": "On'yomi", "tabKj": "ကန်ဂျိ 漢字", "freeTag": "အခမဲ့"}};
  var T = function () { return Object.assign({}, UI.en, UI[host.lang] || {}); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function css() {
    if (document.getElementById("jlCss")) return;
    var s = document.createElement("style"); s.id = "jlCss";
    s.textContent = [
      ".la-root{position:fixed;inset:0;z-index:66;display:flex;justify-content:center;background:rgba(23,35,61,.55);font-family:Inter,sans-serif;animation:fadeIn .2s both}",
      ".la-app{width:100%;max-width:480px;height:100dvh;display:flex;flex-direction:column;background:radial-gradient(95% 58% at 6% 20%,var(--s1,transparent) 0%,transparent 74%),radial-gradient(90% 62% at 100% 52%,var(--s2,transparent) 0%,transparent 74%),var(--washi,#ece3ce);color:var(--sumi,#2a251d);animation:sheetUp .35s cubic-bezier(.16,1,.3,1) both}",
      ".la-head{display:flex;align-items:center;gap:6px;padding:calc(env(safe-area-inset-top,0px) + 8px) 10px 8px 6px;background:rgba(251,247,234,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line,rgba(122,110,80,.24))}",
      ".la-ib{width:42px;height:42px;border:0;border-radius:50%;background:none;color:inherit;display:grid;place-items:center;cursor:pointer;flex:0 0 42px}.la-ib:active{background:rgba(23,35,61,.08)}.la-ib.on{color:var(--hanko,#ac3527)}",
      ".la-ttl{flex:1;min-width:0}.la-ttl b{display:block;font:800 17px 'Shippori Mincho',serif}.la-ttl span{display:block;font-size:12px;color:var(--mist,#6d6759);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".la-set{background:var(--card,#fbf7ea);border:1px solid var(--line,rgba(122,110,80,.24));border-radius:18px;padding:12px 13px;margin-bottom:12px}.la-set .la-h{margin:0 0 8px}.la-set .la-h~.la-h{margin-top:12px}",
      ".la-chips{display:flex;gap:6px}.la-lv{flex:1;border:1px solid var(--line,rgba(122,110,80,.3));background:transparent;color:inherit;border-radius:10px;padding:9px 0;font:700 13px Inter,sans-serif;cursor:pointer}.la-lv.on{background:var(--ai,#17233d);color:#fff;border-color:var(--ai,#17233d)}.la-lvd{font-size:12px;color:var(--mist,#6d6759);margin-top:6px}",
      ".la-vrow{display:flex;gap:8px}.la-vrow select{flex:1;min-width:0;border:1px solid var(--line,rgba(122,110,80,.3));background:transparent;color:inherit;border-radius:10px;padding:9px 10px;font:600 13.5px Inter,sans-serif}.la-vrow button{border:0;border-radius:10px;padding:9px 13px;background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff;font:700 12.5px Inter,sans-serif;cursor:pointer}",
      ".la-vi{background:var(--card,#fbf7ea);border:1px solid var(--line,rgba(122,110,80,.24));border-radius:16px;padding:12px 13px;margin-bottom:10px}.la-vtop{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.la-vi .la-jp{font:700 19px/1.4 Inter,sans-serif}.la-vi .la-rd{font-size:12.5px;color:var(--mist,#6d6759)}.la-vi .la-mn{font-size:13.5px;line-height:1.5;margin-top:2px}.la-ex{margin-top:8px;padding-top:8px;border-top:1px dashed var(--line,rgba(122,110,80,.3))}.la-gh{font:800 22px/1.3 Inter,sans-serif}",
      ".la-ro{font-size:12.5px;font-style:italic;color:var(--hanko,#ac3527);margin-top:1px}.la-vi .la-ro{margin-top:2px}.la-kj{font:700 34px/1.1 'Shippori Mincho',serif;min-width:44px}",
      ".la-q{font:700 16px/1.55 Inter,sans-serif;margin:6px 2px 14px}.la-opt{display:block;width:100%;text-align:left;border:1.5px solid var(--line,rgba(122,110,80,.3));background:var(--card,#fbf7ea);color:inherit;border-radius:14px;padding:12px 14px;margin-bottom:9px;font:600 15px/1.4 Inter,sans-serif;cursor:pointer}.la-opt.ok{border-color:#2f7d4f;background:#d6ecdc;color:#1c5a35}.la-opt.no{border-color:#ac3527;background:#f4d9d5;color:#7a1f14}.la-opt:disabled{cursor:default}",
      ".la-big{display:block;width:100%;border:0;border-radius:14px;padding:14px;margin-top:10px;background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff;font:800 15px Inter,sans-serif;cursor:pointer}.la-big.g{background:transparent;color:inherit;border:1.5px solid var(--line,rgba(122,110,80,.3))}.la-lv.w{flex:1}",
      ".la-chip{font:700 10.5px Inter,sans-serif;background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff;border-radius:99px;padding:3px 9px}",
      ".la-body{flex:1;min-height:0;overflow-y:auto;padding:16px 16px 24px;-webkit-overflow-scrolling:touch}",
      ".la-card{display:flex;align-items:center;gap:13px;width:100%;text-align:left;background:var(--card,#fbf7ea);border:1px solid var(--line,rgba(122,110,80,.24));border-radius:18px;padding:13px;margin-bottom:10px;font:inherit;color:inherit;cursor:pointer;min-height:68px}.la-card:active{transform:scale(.985)}",
      ".la-ico{flex:0 0 46px;height:46px;border-radius:14px;background:var(--ai,#17233d);display:grid;place-items:center;color:#fff;font-size:22px}.la-card.hero .la-ico{background:linear-gradient(150deg,var(--hanko-2,#c9432f),var(--hanko,#ac3527))}",
      ".la-grow{flex:1;min-width:0}.la-grow b{display:block;font:600 15px Inter,sans-serif}.la-grow span{display:block;font-size:12.5px;color:var(--mist,#6d6759);margin-top:3px;line-height:1.4}",
      ".la-h{font:700 12px Inter,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--mist,#6d6759);margin:18px 2px 8px}.la-sc{font:700 12px Inter,sans-serif;color:var(--hanko,#ac3527)}",
      ".la-list{flex:1;min-height:0;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px}",
      ".la-b{max-width:88%;border-radius:18px;padding:11px 14px;border:1px solid var(--line,rgba(122,110,80,.2));background:var(--card,#fbf7ea);align-self:flex-start;box-shadow:0 1px 2px rgba(42,37,29,.06)}.la-b.me{align-self:flex-end;background:linear-gradient(135deg,var(--ai-2,#223a5c),var(--ai,#17233d));color:#f6efdc;border-color:transparent}",
      ".la-jp{font:600 18px/1.5 'Shippori Mincho',serif}.la-rd{font-size:12.5px;color:var(--mist,#6d6759);margin-top:3px}.la-mn{font-size:13.5px;margin-top:7px;padding-top:7px;border-top:1px dashed var(--line,rgba(122,110,80,.3));line-height:1.45}",
      ".la-cor{align-self:flex-end;max-width:88%;background:#fff7e2;border:1px solid #e6c97a;border-radius:14px;padding:10px 12px;font-size:13px;line-height:1.5}.la-cor b{display:block;font:700 11px Inter,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#8a5a0c;margin-bottom:3px}.la-cor .bt{font:600 15px 'Shippori Mincho',serif}",
      ".la-hint{align-self:flex-start;border:1px dashed var(--hanko,#ac3527);color:var(--hanko,#ac3527);background:none;border-radius:99px;padding:7px 13px;font:600 12.5px Inter,sans-serif;cursor:pointer;text-align:left}",
      ".la-typ{align-self:flex-start;font-size:12.5px;color:var(--mist,#6d6759);padding:4px 6px}",
      ".la-comp{display:flex;gap:8px;align-items:flex-end;padding:10px 12px calc(env(safe-area-inset-bottom,0px) + 12px);background:rgba(251,247,234,.94);border-top:1px solid var(--line,rgba(122,110,80,.24))}",
      ".la-comp textarea{flex:1;font:inherit;font-size:16px;line-height:1.35;padding:12px 15px;border-radius:22px;border:1px solid var(--line,rgba(122,110,80,.3));resize:none;max-height:110px;background:#fff;color:inherit;outline:0}",
      ".la-btn{width:46px;height:46px;border-radius:50%;border:0;flex:0 0 46px;display:grid;place-items:center;cursor:pointer;color:#fff5e8;background:linear-gradient(150deg,var(--hanko-2,#c9432f),var(--hanko,#ac3527))}.la-btn.mic{background:linear-gradient(135deg,var(--ai-2,#223a5c),var(--ai,#17233d))}.la-btn.rec{background:#b3261e;animation:laPulse 1s infinite}.la-btn:disabled{background:#cfc6ad}",
      "@keyframes laPulse{50%{box-shadow:0 0 0 8px rgba(179,38,30,.18)}}",
      ".la-sum{background:var(--card,#fbf7ea);border:1px solid var(--line,rgba(122,110,80,.24));border-radius:20px;padding:18px;margin:6px 0}.la-ring{width:92px;height:92px;border-radius:50%;margin:0 auto 12px;display:grid;place-items:center;font:800 30px 'Shippori Mincho',serif;background:conic-gradient(var(--hanko,#ac3527) calc(var(--p)*1%),rgba(122,110,80,.2) 0)}.la-ring i{width:72px;height:72px;border-radius:50%;background:var(--card,#fbf7ea);display:grid;place-items:center;font-style:normal}",
      ".la-sum h4{font:700 12px Inter,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:var(--mist,#6d6759);margin:12px 0 4px}.la-sum li{font-size:13.5px;line-height:1.5;margin-bottom:2px}.la-sum ul{margin:0;padding-left:18px}",
      ".la-act{display:flex;gap:8px;margin-top:14px}.la-act button{flex:1;border:0;border-radius:14px;padding:13px;font:600 14px Inter,sans-serif;cursor:pointer;color:#f6efdc;background:linear-gradient(135deg,var(--ai-2,#223a5c),var(--ai,#17233d))}.la-act button.g{background:#e8dfc8;color:var(--ai-2,#223a5c)}",
      ".la-err{align-self:stretch;background:#fdecef;color:#8a1f1a;border-radius:14px;padding:11px 13px;font-size:13px;line-height:1.45}.la-err button{margin-top:8px;border:0;background:#b3261e;color:#fff;border-radius:10px;padding:7px 14px;font:600 13px Inter,sans-serif;cursor:pointer}"
    ].join("\n");
    document.head.appendChild(s);
  }
  var IC = { back: '<path d="M15 5 8 12l7 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', send: '<path d="M4 12 20 4l-4 16-4-7z"/>', mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>', vol: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>', mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>' };
  var ic = function (n, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>"; };

  /* ---------- suara: suara bawaan HP (gratis), tanpa API ---------- */
  function stopSay() { try { speechSynthesis.cancel(); } catch (e) {} }
  function sayBrowser(txt) {
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(txt); u.lang = "ja-JP"; u.rate = 0.9; var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0]; if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) {}
  }
  function head(title, sub, back) {
    return '<div class="la-head"><button class="la-ib" data-a="' + (back ? "back" : "close") + '" aria-label="' + esc(T().back) + '">' + ic(back ? "back" : "x") + '</button><div class="la-ttl"><b>' + esc(title) + "</b><span>" + esc(sub) + '</span></div><span class="la-chip">' + esc(T().freeTag) + "</span></div>";
  }
  function errMsg() { return T().errNet; }

  // ---- hiragana/katakana -> romaji (Hepburn). Cadangan kalau materi lama belum membawa romaji; partikel は/へ/を dibaca apa adanya ----
  var RJM = {}, RJY = { "き": "ky", "ぎ": "gy", "し": "sh", "じ": "j", "ち": "ch", "に": "ny", "ひ": "hy", "び": "by", "ぴ": "py", "み": "my", "り": "ry", "ぢ": "j" },
    RJD = { "ふぁ": "fa", "ふぃ": "fi", "ふぇ": "fe", "ふぉ": "fo", "うぃ": "wi", "うぇ": "we", "うぉ": "wo", "てぃ": "ti", "でぃ": "di", "しぇ": "she", "ちぇ": "che", "じぇ": "je" };
  "あa いi うu えe おo かka きki くku けke こko さsa しshi すsu せse そso たta ちchi つtsu てte とto なna にni ぬnu ねne のno はha ひhi ふfu へhe ほho まma みmi むmu めme もmo やya ゆyu よyo らra りri るru れre ろro わwa をo がga ぎgi ぐgu げge ごgo ざza じji ずzu ぜze ぞzo だda ぢji づzu でde どdo ばba びbi ぶbu べbe ぼbo ぱpa ぴpi ぷpu ぺpe ぽpo ゔvu ぁa ぃi ぅu ぇe ぉo".split(" ").forEach(function (p) { RJM[p.charAt(0)] = p.slice(1); });
  function toRomaji(src, sent) { // sent = kalimat: partikel は/へ di ujung kata dibaca wa/e dan を diberi spasi
    var s0 = String(src || "");
    if (sent) s0 = s0.replace(/は(?=[\s、。！？,.]|$)/g, "わ").replace(/へ(?=[\s、。！？,.]|$)/g, "え").replace(/を/g, " を ");
    var s = s0.replace(/こんにちは/g, "konnichiwa").replace(/こんばんは/g, "konbanwa").replace(/[\u30a1-\u30f6]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); });
    var out = "", i = 0, gem = false;
    while (i < s.length) {
      var c = s.charAt(i), n = s.charAt(i + 1), r = null, adv = 1;
      if (c === "っ") { gem = true; i++; continue; }
      if (c === "ー") { var last = out.charAt(out.length - 1); if (/[aiueo]/.test(last)) out += last; i++; continue; }
      if (RJD[c + n]) { r = RJD[c + n]; adv = 2; }
      else if (c === "ん") r = /[あいうえおやゆよ]/.test(n) ? "n'" : "n";
      else if (RJY[c] && /[ゃゅょ]/.test(n)) { r = RJY[c] + { "ゃ": "a", "ゅ": "u", "ょ": "o" }[n]; adv = 2; }
      else if (RJM[c]) r = RJM[c];
      else r = { "。": ". ", "、": ", ", "？": "? ", "！": "! ", "・": " ", "「": '"', "」": '"', "\u3000": " " }[c] || c;
      if (gem && /^[bcdfghjklmnpqrstvwxyz]/.test(r)) r = (r.charAt(0) === "c" && r.charAt(1) === "h" ? "t" : r.charAt(0)) + r;
      gem = false; out += r; i += adv;
    }
    return out.replace(/\s+/g, " ").trim();
  }
  function rj(r, reading, sent) { return r || toRomaji(reading, sent); }

  // ---- Belajar JLPT: kotoba, bunpou, kanji, latihan (semua lokal) ----
  var st = { tab: "vocab", item: null, data: null, qs: null, qi: 0, score: 0, picked: -1, seq: 0, retry: null }, sCache = {};
  function curr() {
    var b = (window.LEA_STUDY && window.LEA_STUDY[level]) || { vocab: [], grammar: [] };
    if (!localReady(level)) return b;
    var l = localTopics(level); // kotoba & kanji dari data lokal; bunpou tetap dari daftar LEA_STUDY
    return { vocab: l.vocab, grammar: b.grammar, kanji: l.kanji };
  }
  function tl(o) { return (o && (o[host.lang] || o.en)) || ""; }
  function topicLabel(it) { return it.k ? it.k : it.p ? it.p : tl(it.t); }
  function topicSub(it) { return it.k ? it.k.length + " kanji" : it.p ? tl(it.h) : (it.w || ""); }
  function body(h) { var a = el && el.querySelector(".la-app"); if (a) a.innerHTML = h; }

  // ---- Materi lokal (gratis, tanpa API): kotoba & kanji dibaca dari modules/jlpt/n5..n1.js (arti berbahasa Inggris) ----
  // Terjemahan arti ke Indonesia dan Myanmar ada di modules/jlpt/tr/<bahasa>-<level>.js. Baru N5, N4, dan N3; level lain tampil berbahasa Inggris.
  var VCH = 30, KCH = 10, topicMemo = {}, TR_LEVELS = { N5: 1, N4: 1, N3: 1 }, trApplied = {};
  function dataReady(lv) { return !!(window.JLPT_LOCAL && window.JLPT_LOCAL[lv]); }
  function localReady(lv) { return dataReady(lv) && trApplied[lv] === host.lang; }
  function applyTr(lv) { // arti asli (Inggris) disimpan di _e supaya bisa ganti bahasa kapan saja
    var d = window.JLPT_LOCAL && window.JLPT_LOCAL[lv]; if (!d) return;
    var m = (window.JLPT_TR || {})[host.lang] || {}, tr = function (s) { return m[s] || s; };
    d.v.forEach(function (r) { if (r._e === undefined) r._e = r[2]; r[2] = tr(r._e); });
    d.k.forEach(function (r) { if (r._e === undefined) r._e = r[1]; r[1] = tr(r._e); });
  }
  function loadTr(lv, done) {
    var lang = host.lang, key = lang + lv; window.JLPT_TR_DONE = window.JLPT_TR_DONE || {};
    if ((lang !== "id" && lang !== "my") || !TR_LEVELS[lv] || window.JLPT_TR_DONE[key]) return done();
    var s = document.createElement("script"), fin = function () { window.JLPT_TR_DONE[key] = 1; done(); };
    s.src = "modules/jlpt/tr/" + lang + "-" + lv.toLowerCase() + ".js"; s.onload = fin; s.onerror = fin; document.head.appendChild(s);
  }
  function loadLocal(lv, ok, fail) {
    var fin = function () { loadTr(lv, function () { applyTr(lv); trApplied[lv] = host.lang; ok(); }); };
    if (dataReady(lv)) return fin();
    var s = document.createElement("script"); s.src = "modules/jlpt/" + lv.toLowerCase() + ".js";
    s.onload = function () { if (dataReady(lv)) fin(); else fail(); }; s.onerror = fail;
    document.head.appendChild(s);
  }
  function localTopics(lv) {
    if (topicMemo[lv]) return topicMemo[lv];
    var d = window.JLPT_LOCAL[lv], vs = [], ks = [], i, a, b;
    for (i = 0; i * VCH < d.v.length; i++) {
      a = i * VCH; b = Math.min(d.v.length, a + VCH);
      vs.push({ id: "lv_" + lv + "_" + (i + 1), t: { en: "Set " + (i + 1) + " · " + (a + 1) + "–" + b }, w: d.v.slice(a, a + 4).map(function (r) { return r[1] || r[0]; }).join(" · ") });
    }
    for (i = 0; i * KCH < d.k.length; i++) ks.push({ id: "lk_" + lv + "_" + (i + 1), k: d.k.slice(i * KCH, (i + 1) * KCH).map(function (r) { return r[0]; }).join("") });
    return (topicMemo[lv] = { vocab: vs, kanji: ks });
  }
  function lrows(kind, lv, n) { var d = window.JLPT_LOCAL[lv], c = kind === "v" ? VCH : KCH; return (kind === "v" ? d.v : d.k).slice((n - 1) * c, n * c); }
  function shortM(m) { m = String(m || ""); if (m.length <= 60) return m; var c = m.lastIndexOf(",", 60); return m.slice(0, c > 20 ? c : 60); }
  function kunDisp(k) { return { kana: k.replace(/-/g, "").replace(/\.(.*)$/, "($1)"), romaji: toRomaji(k.replace(/[.\-]/g, "")) }; }
  function localContent(kind, lv, n) {
    var rows = lrows(kind, lv, n), vs = window.JLPT_LOCAL[lv].v;
    if (kind === "v") return { type: "vocab", items: rows.map(function (r) { return { jp: r[1] || r[0], reading: r[0], romaji: "", meaning: r[2] }; }) };
    return { type: "kanji", items: rows.map(function (r) {
      var ex = [], i;
      for (i = 0; i < vs.length && ex.length < 3; i++) if (vs[i][1].length > 1 && vs[i][1].indexOf(r[0]) >= 0) ex.push({ word: vs[i][1], reading: vs[i][0], romaji: "", meaning: shortM(vs[i][2]) });
      return { kanji: r[0], meaning: r[1], onyomi: r[2].map(function (k) { return { kana: k, romaji: toRomaji(k) }; }), kunyomi: r[3].map(kunDisp), examples: ex };
    }) };
  }
  function localQuiz(kind, lv, n, set) {
    var rows = lrows(kind, lv, n), d = window.JLPT_LOCAL[lv], pool = kind === "v" ? d.v : d.k, cnt = Math.min(10, rows.length), off = (((set || 1) - 1) * cnt) % rows.length, qs = [], i;
    for (i = 0; i < cnt; i++) {
      var r = rows[(off + i) % rows.length], right = kind === "v" ? shortM(r[2]) : r[1], wrong = [], g = 0;
      while (wrong.length < 3 && g++ < 300) {
        var c = pool[Math.floor(Math.random() * pool.length)], m = kind === "v" ? shortM(c[2]) : c[1];
        if (m && m !== right && wrong.indexOf(m) < 0) wrong.push(m);
      }
      qs.push({ q: "「" + (kind === "v" ? (r[1] || r[0]) : r[0]) + "」 = ?", q_romaji: kind === "v" ? toRomaji(r[0]) : "", options: [right].concat(wrong), options_romaji: [], answer: 0,
        why: kind === "v" ? r[0] + " · " + r[2] : r[2].concat(r[3].map(function (k) { return kunDisp(k).kana; })).join(" · ") + " — " + r[1] });
    }
    return { questions: qs };
  }

  // ---- Bunpou lokal (gratis, tanpa API): isi dari modules/jlpt/grammar.js, daftar pola tetap dari lea-study-data.js ----
  function mergeGrammarMy() { // tambahkan teks Myanmar (modules/jlpt/tr/grammar-my.js) ke data bunpou dan ke petunjuk di daftar pola
    var M = window.JLPT_GRAMMAR_MY; if (!M) return;
    var i, a, j, it;
    for (i = 0; i < LEVELS.length; i++) { a = ((window.LEA_STUDY || {})[LEVELS[i]] || {}).grammar || []; for (j = 0; j < a.length; j++) { it = a[j]; if (M[it.id]) { it.h = it.h || {}; it.h.my = M[it.id].h; } } }
    var G = window.JLPT_GRAMMAR; if (!G) return;
    Object.keys(M).forEach(function (id) {
      var g = G[id], m = M[id]; if (!g) return;
      g.m.my = m.m; g.e.my = m.e;
      (g.x || []).forEach(function (x, k) { if (m.x[k]) x.m.my = m.x[k]; });
      if (m.n && g.n) g.n.my = m.n;
    });
  }
  function loadMy(done) { // dipanggil saat modul dibuka dalam bahasa Myanmar
    if (host.lang !== "my") return done();
    if (window.JLPT_GRAMMAR_MY) { mergeGrammarMy(); return done(); }
    var sc = document.createElement("script"), fin = function () { mergeGrammarMy(); done(); };
    sc.src = "modules/jlpt/tr/grammar-my.js"; sc.onload = fin; sc.onerror = fin; document.head.appendChild(sc);
  }
  function loadGrammar() {
    return new Promise(function (ok, no) {
      if (window.JLPT_GRAMMAR) { mergeGrammarMy(); return ok(); }
      var sc = document.createElement("script"); sc.src = "modules/jlpt/grammar.js";
      sc.onload = function () { if (window.JLPT_GRAMMAR) { mergeGrammarMy(); ok(); } else no(); }; sc.onerror = no;
      document.head.appendChild(sc);
    });
  }
  function gFind(id) { // cari pola di level mana pun; list = pola selevel, dipakai sebagai pengecoh kuis
    var i, a, j;
    for (i = 0; i < LEVELS.length; i++) { a = ((window.LEA_STUDY || {})[LEVELS[i]] || {}).grammar || []; for (j = 0; j < a.length; j++) if (a[j].id === id) return { it: a[j], list: a }; }
    return null;
  }
  function gContent(id) {
    var g = window.JLPT_GRAMMAR[id], f = gFind(id);
    return { type: "grammar", pattern: f ? f.it.p : "", meaning: tl(g.m), formation: g.f, explain: tl(g.e), notes: g.n ? tl(g.n) : "",
      examples: g.x.map(function (x) { return { jp: x.jp, reading: x.r, romaji: "", meaning: tl(x.m) }; }) };
  }
  function gQuiz(id) {
    var G = window.JLPT_GRAMMAR, g = G[id], f = gFind(id), pat = f ? f.it.p : "";
    var pool = ((f && f.list) || []).map(function (x) { return x.id; }).filter(function (k) { return k !== id && G[k]; });
    function opts(getter, right) { var o = [right], c = shuffle(pool.slice()), i, v; for (i = 0; i < c.length && o.length < 4; i++) { v = getter(G[c[i]]); if (v && o.indexOf(v) < 0) o.push(v); } return o; }
    var why = pat + " — " + tl(g.m);
    var qs = g.x.map(function (x) { return { q: x.jp, q_romaji: toRomaji(x.r, true), options: opts(function (o) { return tl(o.x[Math.floor(Math.random() * o.x.length)].m); }, tl(x.m)), options_romaji: [], answer: 0, why: why }; });
    qs.push({ q: "「" + pat + "」 = ?", q_romaji: "", options: opts(function (o) { return tl(o.m); }, tl(g.m)), options_romaji: [], answer: 0, why: why });
    return { questions: shuffle(qs) };
  }
  function noData() { var e = new Error("data lokal tidak ditemukan"); e.code = "net"; return e; }
  function getStudy(kind, id, set) { // materi belajar 100% lokal; tidak ada panggilan API di sini
    var lm = /^l([vk])_(N[1-5])_(\d+)$/.exec(id);
    if (lm && localReady(lm[2])) return Promise.resolve(kind === "quiz" ? localQuiz(lm[1], lm[2], +lm[3], set) : localContent(lm[1], lm[2], +lm[3]));
    if (/^g_/.test(id)) return loadGrammar().then(function () { if (!window.JLPT_GRAMMAR[id]) throw noData(); return kind === "quiz" ? gQuiz(id) : gContent(id); }, function () { throw noData(); });
    return Promise.reject(noData());
  }

  function drawStudy() {
    view = "study"; var t = T();
    if (!localReady(level)) { // muat data level ini dulu (sekali, lalu tersimpan di cache browser)
      var lv0 = level, again = function () { if (view === "study" && level === lv0) drawStudy(); };
      body(head(t.study, level, true) + '<div class="la-body"><div class="la-typ" style="margin-top:40px">…</div></div>');
      loadLocal(lv0, again, function () { if (view !== "study") return; st.retry = drawStudy; body(head(t.study, level, true) + '<div class="la-body"><div class="la-err">' + esc(t.errNet) + '</div><button class="la-big" data-a="sretry">' + esc(t.sRetry) + "</button></div>"); });
      return;
    }
    var list = curr()[st.tab] || [];
    var h = head(t.study, level + " · " + ((t.lvDesc || [])[LEVELS.indexOf(level)] || ""), true) + '<div class="la-body"><div class="la-chips">' + LEVELS.map(function (l) { return '<button class="la-lv' + (l === level ? " on" : "") + '" data-a="slvl" data-l="' + l + '">' + l + "</button>"; }).join("") + '</div><div class="la-chips" style="margin:10px 0 12px"><button class="la-lv w' + (st.tab === "vocab" ? " on" : "") + '" data-a="stab" data-t="vocab">' + esc(t.tabV) + '</button><button class="la-lv w' + (st.tab === "grammar" ? " on" : "") + '" data-a="stab" data-t="grammar">' + esc(t.tabG) + '</button><button class="la-lv w' + (st.tab === "kanji" ? " on" : "") + '" data-a="stab" data-t="kanji">' + esc(t.tabKj) + "</button></div>";
    if (st.tab === "kanji" && !list.length) h += '<div class="la-vi"><div class="la-mn">' + esc(t.kanjiSoon) + "</div></div>";
    list.forEach(function (it, n) {
      var p = prog["s|" + it.id], sub = [topicSub(it), p ? t.sBest + ": " + p.best : ""].filter(Boolean).join(" · ");
      h += '<button class="la-card" data-a="topic" data-n="' + n + '"><div class="la-ico">' + (it.k ? "漢" : it.p ? "文" : "語") + '</div><div class="la-grow"><b' + (it.k ? ' style="font-size:18px;letter-spacing:.18em"' : "") + ">" + esc(topicLabel(it)) + "</b>" + (sub ? "<span>" + esc(sub) + "</span>" : "") + "</div></button>";
    });
    body(h + "</div>");
  }
  function drawWait() { body(head(topicLabel(st.item), level, true) + '<div class="la-body"><div class="la-typ" style="margin-top:40px">' + esc(T().prep) + "</div></div>"); }
  function drawStudyErr(e) { body(head(topicLabel(st.item), level, true) + '<div class="la-body"><div class="la-err">' + esc(errMsg(e)) + '</div><button class="la-big" data-a="sretry">' + esc(T().sRetry) + "</button></div>"); }
  function playBtn(txt) { return '<button class="la-ib" data-a="play" data-t="' + esc(txt) + '" aria-label="' + esc(T().say) + '">' + ic("vol", 18) + "</button>"; }
  function openTopic(n) {
    var it = curr()[st.tab][n]; if (!it) return;
    st.item = it; st.data = null; view = "topic"; var my = ++st.seq; drawWait();
    st.retry = function () { openTopic(n); };
    getStudy("content", it.id, 1).then(function (r) { if (my !== st.seq || view !== "topic") return; st.data = r; drawTopic(); })
      .catch(function (e) { if (my !== st.seq || view !== "topic") return; drawStudyErr(e); });
  }
  function drawTopic() {
    view = "topic"; var t = T(), it = st.item, d = st.data, h = head(topicLabel(it), topicSub(it) || level, true) + '<div class="la-body">';
    if (d.type === "vocab") {
      d.items.forEach(function (x) {
        h += '<div class="la-vi"><div class="la-vtop"><b class="la-jp">' + esc(x.jp) + '</b><span class="la-rd">' + esc(x.reading) + "</span>" + playBtn(x.jp) + '</div><div class="la-ro">' + esc(rj(x.romaji, x.reading)) + '</div><div class="la-mn">' + esc(x.meaning) + "</div>" +
          (x.example ? '<div class="la-ex"><div class="la-vtop"><span class="la-jp" style="font-size:15px">' + esc(x.example) + "</span>" + playBtn(x.example) + '</div><div class="la-rd">' + esc(x.example_reading) + '</div><div class="la-ro">' + esc(rj(x.example_romaji, x.example_reading, true)) + '</div><div class="la-mn">' + esc(x.example_meaning) + "</div></div>" : "") + "</div>";
      });
    } else if (d.type === "kanji") {
      var rdl = function (arr) { return arr.map(function (r) { return esc(r.kana) + " (" + esc(r.romaji || toRomaji(r.kana)) + ")"; }).join(" · "); };
      d.items.forEach(function (x) {
        h += '<div class="la-vi"><div class="la-vtop"><b class="la-kj">' + esc(x.kanji) + '</b><div class="la-grow"><div class="la-mn" style="font-weight:700;font-size:15px;margin:0">' + esc(x.meaning) + "</div></div>" + playBtn(x.kanji) + "</div>" +
          (x.onyomi.length ? '<div class="la-mn"><b>' + esc(t.onT) + ":</b> " + rdl(x.onyomi) + "</div>" : "") +
          (x.kunyomi.length ? '<div class="la-mn"><b>' + esc(t.kunT) + ":</b> " + rdl(x.kunyomi) + "</div>" : "") +
          x.examples.map(function (e) { return '<div class="la-ex"><div class="la-vtop"><span class="la-jp" style="font-size:16px">' + esc(e.word) + '</span><span class="la-rd">' + esc(e.reading) + "</span>" + playBtn(e.word) + '</div><div class="la-ro">' + esc(e.romaji || toRomaji(e.reading)) + '</div><div class="la-mn">' + esc(e.meaning) + "</div></div>"; }).join("") + "</div>";
      });
    } else {
      h += '<div class="la-vi"><div class="la-gh">' + esc(d.pattern || it.p) + '</div>' + (d.pattern_romaji ? '<div class="la-ro">' + esc(d.pattern_romaji) + "</div>" : "") + '<div class="la-mn" style="font-size:14.5px">' + esc(d.meaning) + "</div></div>";
      if (d.formation) h += '<div class="la-vi"><div class="la-h" style="margin:0 0 4px">' + esc(t.formT) + '</div><div class="la-mn">' + esc(d.formation) + "</div></div>";
      h += '<div class="la-vi"><div class="la-mn">' + esc(d.explain) + '</div></div><div class="la-h">' + esc(t.exampleT) + "</div>";
      d.examples.forEach(function (x) { h += '<div class="la-vi"><div class="la-vtop"><span class="la-jp" style="font-size:17px">' + esc(x.jp) + "</span>" + playBtn(x.jp) + '</div><div class="la-rd">' + esc(x.reading) + '</div><div class="la-ro">' + esc(rj(x.romaji, x.reading, true)) + '</div><div class="la-mn">' + esc(x.meaning) + "</div></div>"; });
      if (d.notes) h += '<div class="la-vi"><div class="la-h" style="margin:0 0 4px">' + esc(t.notesT) + '</div><div class="la-mn">' + esc(d.notes) + "</div></div>";
    }
    body(h + '<button class="la-big" data-a="quiz">' + esc(t.quizBtn) + "</button></div>");
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function startQuiz() {
    var it = st.item; if (!it) return; var p = prog["s|" + it.id] || { best: 0, tries: 0 }, set = (p.tries % 3) + 1;
    view = "quiz"; var my = ++st.seq; drawWait(); st.retry = startQuiz;
    getStudy("quiz", it.id, set).then(function (r) {
      if (my !== st.seq || view !== "quiz") return;
      st.qs = r.questions.map(function (q) { var idx = shuffle([0, 1, 2, 3]); return { q: q.q, qr: q.q_romaji || "", ro: idx.map(function (i) { return (q.options_romaji || [])[i] || ""; }), why: q.why, options: idx.map(function (i) { return q.options[i]; }), answer: idx.indexOf(q.answer) }; });
      st.qi = 0; st.score = 0; st.picked = -1; drawQuiz();
    }).catch(function (e) { if (my !== st.seq || view !== "quiz") return; drawStudyErr(e); });
  }
  function drawQuiz() {
    var t = T(), q = st.qs[st.qi], n = st.qs.length, ans = st.picked >= 0;
    var h = head(topicLabel(st.item), t.qOf.replace("{n}", st.qi + 1).replace("{m}", n), true) + '<div class="la-body"><div class="la-q">' + esc(q.q) + "</div>" + (q.qr ? '<div class="la-ro" style="margin:-8px 2px 12px">' + esc(q.qr) + "</div>" : "");
    q.options.forEach(function (o, i) { h += '<button class="la-opt' + (ans ? (i === q.answer ? " ok" : i === st.picked ? " no" : "") : "") + '" data-a="opt" data-i="' + i + '"' + (ans ? " disabled" : "") + ">" + esc(o) + (q.ro[i] ? '<small class="la-ro" style="display:block;font-weight:500;margin-top:2px">' + esc(q.ro[i]) + "</small>" : "") + "</button>"; });
    if (ans) h += '<div class="la-vi"><b>' + esc(st.picked === q.answer ? t.okT : t.noT) + "</b>" + (q.why ? '<div class="la-mn">' + esc(q.why) + "</div>" : "") + '</div><button class="la-big" data-a="qnext">' + esc(st.qi + 1 < n ? t.next : t.seeScore) + "</button>";
    body(h + "</div>");
  }
  function pickOpt(i) { if (st.picked >= 0 || !st.qs) return; st.picked = i; if (i === st.qs[st.qi].answer) st.score++; drawQuiz(); }
  function nextQ() { if (st.qi + 1 < st.qs.length) { st.qi++; st.picked = -1; drawQuiz(); } else finishQuiz(); }
  function finishQuiz() {
    var t = T(), n = st.qs.length, pct = Math.round(st.score / n * 100), k = "s|" + st.item.id, p = prog[k] || { best: 0, tries: 0 };
    p.best = Math.max(p.best, pct); p.tries++; p.at = Date.now(); prog[k] = p; saveProg(); view = "result";
    body(head(topicLabel(st.item), t.resultT, true) + '<div class="la-body"><div class="la-sum"><div class="la-ring" style="--p:' + pct + '"><i>' + pct + '</i></div><div style="text-align:center;font-weight:700">' + st.score + " / " + n + '</div></div><button class="la-big" data-a="quiz">' + esc(t.quizAgain) + '</button><button class="la-big g" data-a="tolist">' + esc(t.toList) + "</button></div>");
  }
  function goBack() {
    stopSay(); st.seq++;
    if (view === "quiz" || view === "result") { if (st.data) drawTopic(); else drawStudy(); }
    else if (view === "topic") drawStudy();
    else close();
  }
  function close() { stopSay(); if (el) { el.remove(); el = null; } }
  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a;
    if (a === "close") close();
    else if (a === "back") goBack();
    else if (a === "play") { stopSay(); sayBrowser(b.dataset.t); }
    else if (a === "slvl") { if (LEVELS.indexOf(b.dataset.l) >= 0) { level = b.dataset.l; try { localStorage.setItem("kakeibo-jlpt-level", level); } catch (x) {} drawStudy(); } }
    else if (a === "stab") { st.tab = ["vocab", "grammar", "kanji"].indexOf(b.dataset.t) >= 0 ? b.dataset.t : "vocab"; drawStudy(); }
    else if (a === "topic") openTopic(+b.dataset.n);
    else if (a === "quiz") startQuiz();
    else if (a === "opt") pickOpt(+b.dataset.i);
    else if (a === "qnext") nextQ();
    else if (a === "tolist") { st.seq++; drawStudy(); }
    else if (a === "sretry") { if (st.retry) st.retry(); }
  }
  function mount() {
    css(); if (el) return;
    el = document.createElement("div"); el.className = "la-root"; el.id = "jlptRoot"; el.innerHTML = '<div class="la-app"></div>';
    el.addEventListener("click", onClick);
    el.addEventListener("keydown", function (e) { if (e.key === "Escape") goBack(); });
    document.body.appendChild(el);
  }
  window.KakeiboJlpt = {
    open: function (ctx) { host = Object.assign(host, ctx || {}); mount(); loadMy(function () { drawStudy(); }); },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; goBack(); return true; }
  };
})();
