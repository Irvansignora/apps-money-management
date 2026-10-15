/* Kakeibo · LEA Sensei: tutor bahasa Jepang berbasis AI (belajar JLPT gratis dan offline; kaiwa AI khusus Premium+).
 * Dua mode: kaiwa bebas dan pelajaran terstruktur (unit dari modul Belajar). Tiap sesi 6 giliran lalu
 * AI memberi nilai dan saran. Dipanggil host: KakeiboLeaAI.open({ lang, esc }). Butuh KakeiboAuth. */
(function () {
  "use strict";
  var host = { lang: "id" }, el = null, view = "home", unit = null, msgs = [], sending = false, rec = null, done = null, hint = "";
  var KEY = "kakeibo-lea-progress", SKEY = "kakeibo-lea-sound";
  var LI = { id: 0, en: 1, vi: 2 }, AI_LANGS = ["id", "en", "my", "bn", "vi", "th", "zh", "ko"];
  var prog = {}, sound = true, voice = "coral", level = "N5", VOICES = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"], LEVELS = ["N5", "N4", "N3", "N2", "N1"];
  try { prog = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; sound = localStorage.getItem(SKEY) !== "0"; var sv = localStorage.getItem("kakeibo-lea-voice"), sl = localStorage.getItem("kakeibo-lea-level"); if (VOICES.indexOf(sv) >= 0) voice = sv; if (LEVELS.indexOf(sl) >= 0) level = sl; } catch (e) {}
  var saveProg = function () { try { localStorage.setItem(KEY, JSON.stringify(prog)); } catch (e) {} };

  var UI = {
    id: { tabKj: "Kanji 漢字", kanjiSoon: "Kanji level ini menyusul. Saat ini tersedia N5 dan N4.", onT: "On (bacaan Cina)", kunT: "Kun (bacaan Jepang)", study: "Belajar JLPT", studySub: "Kotoba, bunpou, kanji, dan latihan sesuai level", tabV: "Kotoba", tabG: "Bunpou", quizBtn: "Latihan soal", prep: "Menyiapkan materi… (pertama kali bisa 10-20 detik)", exampleT: "Contoh", notesT: "Catatan", formT: "Cara membentuk", qOf: "Soal {n} dari {m}", next: "Lanjut", seeScore: "Lihat nilai", okT: "Benar!", noT: "Kurang tepat", resultT: "Hasil latihan", quizAgain: "Latihan lagi", toList: "Kembali ke daftar", sRetry: "Coba lagi", sBest: "Nilai terbaik", lvl: "Level belajar (JLPT)", lvDesc: ["Pemula", "Dasar", "Menengah", "Menengah atas", "Mahir"], voiceT: "Suara LEA", preview: "Dengar contoh", title: "LEA Sensei", sub: "Belajar bahasa Jepang bareng AI", free: "Kaiwa bebas", freeSub: "Ngobrol santai, LEA mengoreksi kalimatmu", lessons: "Pelajaran terstruktur", lessonsSub: "Latihan dialog per tema, ada nilai di akhir", best: "Nilai terbaik", turns: "giliran", ph: "Tulis dalam bahasa Jepang…", say: "Ucapkan", send: "Kirim", mic: "Bicara", better: "Lebih natural", why: "Kenapa", tryHint: "Coba bilang", meaning: "Arti", sound: "Suara", score: "Nilai", good: "Sudah bagus", improve: "Perlu dilatih", again: "Ulangi", finish: "Selesai", back: "Kembali", thinking: "LEA sedang menulis…", left: "Sisa hari ini", errNet: "Tidak bisa terhubung. Coba lagi.", errAi: "AI sedang sibuk. Coba lagi sebentar.", errLimit: "Batas pesan LEA Sensei hari ini sudah habis. Besok bisa lanjut.", errPlus: "Fitur ini khusus Premium+.", retry: "Coba lagi", noMic: "HP ini belum mendukung input suara.", micDenied: "Izin mikrofon ditolak.", start: "Mulai", plusOnly: "Premium+" },
    en: { tabKj: "Kanji 漢字", kanjiSoon: "Kanji for this level is coming. N5 and N4 are available now.", onT: "On'yomi", kunT: "Kun'yomi", study: "JLPT study", studySub: "Kotoba, bunpou, kanji and practice for your level", tabV: "Kotoba", tabG: "Bunpou", quizBtn: "Practice quiz", prep: "Preparing the lesson… (the first time can take 10-20 seconds)", exampleT: "Examples", notesT: "Notes", formT: "How to form", qOf: "Question {n} of {m}", next: "Next", seeScore: "See score", okT: "Correct!", noT: "Not quite", resultT: "Practice result", quizAgain: "Practice again", toList: "Back to the list", sRetry: "Try again", sBest: "Best score", lvl: "Study level (JLPT)", lvDesc: ["Beginner", "Elementary", "Intermediate", "Upper-intermediate", "Advanced"], voiceT: "LEA's voice", preview: "Play sample", title: "LEA Sensei", sub: "Learn Japanese with AI", free: "Free conversation", freeSub: "Chat casually, LEA corrects your sentences", lessons: "Structured lessons", lessonsSub: "Dialogue practice by topic, with a score at the end", best: "Best score", turns: "turns", ph: "Write in Japanese…", say: "Play", send: "Send", mic: "Speak", better: "More natural", why: "Why", tryHint: "Try saying", meaning: "Meaning", sound: "Sound", score: "Score", good: "Done well", improve: "To practise", again: "Again", finish: "Finish", back: "Back", thinking: "LEA is writing…", left: "Left today", errNet: "Cannot connect. Try again.", errAi: "The AI is busy. Try again shortly.", errLimit: "You reached today's LEA Sensei message limit. Continue tomorrow.", errPlus: "This feature is for Premium+ only.", retry: "Retry", noMic: "This phone does not support voice input.", micDenied: "Microphone permission denied.", start: "Start", plusOnly: "Premium+" },
    my: { tabKj: "ကန်ဂျိ 漢字", kanjiSoon: "ဤအဆင့်၏ ကန်ဂျိ မကြာမီ ထည့်သွင်းမည်။ N5 နှင့် N4 ရနိုင်ပါပြီ။", onT: "On'yomi", kunT: "Kun'yomi", study: "JLPT လေ့လာရန်", studySub: "အဆင့်အလိုက် ဝေါဟာရ၊ သဒ္ဒါနှင့် လေ့ကျင့်ခန်း", tabV: "ဝေါဟာရ", tabG: "သဒ္ဒါ", quizBtn: "လေ့ကျင့်ခန်း", prep: "သင်ခန်းစာ ပြင်ဆင်နေသည်… (ပထမဆုံးအကြိမ် စက္ကန့် ၂၀ ခန့် ကြာနိုင်သည်)", exampleT: "ဥပမာ", notesT: "မှတ်ချက်", formT: "ဖွဲ့နည်း", qOf: "မေးခွန်း {n}/{m}", next: "ဆက်သွားရန်", seeScore: "ရလဒ်ကြည့်ရန်", okT: "မှန်ပါသည်!", noT: "မမှန်ပါ", resultT: "လေ့ကျင့်ခန်း ရလဒ်", quizAgain: "ထပ်လေ့ကျင့်ရန်", toList: "စာရင်းသို့ ပြန်သွားရန်", sRetry: "ထပ်ကြိုးစားပါ", sBest: "အကောင်းဆုံးရမှတ်", lvl: "သင်ယူမည့် အဆင့် (JLPT)", lvDesc: ["အစပြု", "အခြေခံ", "အလယ်အလတ်", "အလယ်အလတ်အထက်", "ကျွမ်းကျင်"], voiceT: "LEA ၏ အသံ", preview: "နမူနာ နားထောင်ရန်", title: "LEA Sensei", sub: "AI နှင့်အတူ ဂျပန်စာသင်ပါ", free: "လွတ်လပ်စွာ စကားပြော", freeSub: "ပေါ့ပေါ့ပါးပါး ပြောပါ၊ LEA က သင့်ဝါကျများကို ပြင်ပေးမည်", lessons: "အဆင့်လိုက် သင်ခန်းစာ", lessonsSub: "အကြောင်းအရာအလိုက် စကားပြောလေ့ကျင့်ပြီး အဆုံးတွင် အမှတ်ပေးမည်", best: "အမြင့်ဆုံးအမှတ်", turns: "ကြိမ်", ph: "ဂျပန်လိုရေးပါ…", say: "နားထောင်ရန်", send: "ပို့ရန်", mic: "ပြောရန်", better: "ပိုသဘာဝကျသော", why: "အကြောင်းရင်း", tryHint: "ဒီလိုပြောကြည့်ပါ", meaning: "အဓိပ္ပာယ်", sound: "အသံ", score: "အမှတ်", good: "ကောင်းသည့်အချက်", improve: "ထပ်လေ့ကျင့်ရန်", again: "ထပ်လုပ်ရန်", finish: "ပြီးပြီ", back: "နောက်သို့", thinking: "LEA ရေးနေသည်…", left: "ယနေ့ ကျန်ရှိ", errNet: "ချိတ်ဆက်၍မရပါ။ ထပ်ကြိုးစားပါ။", errAi: "AI အလုပ်များနေသည်။ ခဏနေပြီး ထပ်ကြိုးစားပါ။", errLimit: "ယနေ့ LEA Sensei မက်ဆေ့ချ် ကန့်သတ်ချက် ပြည့်သွားပြီ။ မနက်ဖြန် ဆက်လုပ်ပါ။", errPlus: "ဤလုပ်ဆောင်ချက်သည် Premium+ အတွက်သာ ဖြစ်သည်။", retry: "ထပ်ကြိုးစားရန်", noMic: "ဤဖုန်းတွင် အသံထည့်သွင်းမှု မပံ့ပိုးပါ။", micDenied: "မိုက်ခရိုဖုန်း ခွင့်ပြုချက် ငြင်းပယ်ခံရသည်။", start: "စတင်ရန်", plusOnly: "Premium+" }
  };
  var T = function () { return Object.assign({}, UI.en, UI[host.lang] || {}); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var $ = function (s) { return el && el.querySelector(s); };
  var aiLang = function () { return AI_LANGS.indexOf(host.lang) >= 0 ? host.lang : "en"; };
  var units = function () { return window.BELAJAR_DATA && window.BELAJAR_DATA.units || []; };
  var uTitle = function (u) { var i = LI[host.lang] !== undefined ? LI[host.lang] : 1; return u.n[i] || u.n[1]; };

  function css() {
    if (document.getElementById("laCss")) return;
    var s = document.createElement("style"); s.id = "laCss";
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
      ".la-ico{flex:0 0 46px;height:46px;border-radius:14px;background:var(--ai,#17233d);display:grid;place-items:center;font-size:22px}.la-card.hero .la-ico{background:linear-gradient(150deg,var(--hanko-2,#c9432f),var(--hanko,#ac3527))}",
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

  /* ---------- suara ---------- */
  var player = null, ttsCache = {}, ttsOrder = [], ttsSeq = 0, SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
  // iOS/Safari hanya mengizinkan audio kalau elemennya sudah "dibuka" oleh sentuhan pengguna, jadi dibuka saat tombol ditekan
  function prime() { try { if (!player) player = new Audio(); player.src = SILENT; var pr = player.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
  function stopSay() { ttsSeq++; try { speechSynthesis.cancel(); } catch (e) {} try { if (player) player.pause(); } catch (e) {} }
  function sayBrowser(txt) { // cadangan: suara bawaan HP
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(txt); u.lang = "ja-JP"; u.rate = 0.9; var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0]; if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) {}
  }
  function ttsUrl(txt) { // suara GPT lewat worker; hasilnya disimpan sementara (per suara) supaya putar ulang tidak memanggil server lagi
    var ck = voice + "|" + txt;
    if (ttsCache[ck]) return ttsCache[ck];
    var pr = window.KakeiboAuth.blob("/api/ai/tts", { text: txt, voice: voice }).then(function (b) { return URL.createObjectURL(b); });
    ttsCache[ck] = pr; ttsOrder.push(ck);
    pr.catch(function () { delete ttsCache[ck]; });
    if (ttsOrder.length > 20) { var old = ttsOrder.shift(), op = ttsCache[old]; delete ttsCache[old]; if (op) op.then(function (u) { URL.revokeObjectURL(u); }).catch(function () {}); }
    return pr;
  }
  function say(txt) {
    stopSay(); if (!txt) return; var seq = ttsSeq;
    if (!window.KakeiboAuth || !window.KakeiboAuth.blob) return sayBrowser(txt);
    ttsUrl(txt).then(function (url) {
      if (seq !== ttsSeq) return;
      if (!player) player = new Audio();
      player.src = url; var pr = player.play();
      if (pr && pr.catch) pr.catch(function () { if (seq === ttsSeq) sayBrowser(txt); });
    }).catch(function () { if (seq === ttsSeq) sayBrowser(txt); });
  }
  function listen() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return flash(T().noMic);
    if (rec) { try { rec.stop(); } catch (e) {} return; }
    stopSay(); prime();
    rec = new SR(); rec.lang = "ja-JP"; rec.interimResults = false; rec.maxAlternatives = 1;
    var m = $('[data-a="mic"]'); if (m) m.classList.add("rec");
    rec.onresult = function (e) { var t = e.results[0] && e.results[0][0] && e.results[0][0].transcript; if (t) { var ta = $("#laTxt"); if (ta) ta.value = t; send(); } };
    rec.onerror = function (e) { if (e.error === "not-allowed" || e.error === "service-not-allowed") flash(T().micDenied); };
    rec.onend = function () { rec = null; var b = $('[data-a="mic"]'); if (b) b.classList.remove("rec"); };
    try { rec.start(); } catch (e) { rec = null; }
  }
  function flash(msg) { var l = $("#laList"); if (l) { l.insertAdjacentHTML("beforeend", '<div class="la-err">' + esc(msg) + "</div>"); l.scrollTop = l.scrollHeight; } }

  /* ---------- tampilan ---------- */
  function head(title, sub, back) {
    return '<div class="la-head"><button class="la-ib" data-a="' + (back ? "back" : "close") + '" aria-label="' + esc(T().back) + '">' + ic(back ? "back" : "x") + '</button><div class="la-ttl"><b>' + esc(title) + "</b><span>" + esc(sub) + "</span></div>" +
      (view === "chat" ? '<button class="la-ib' + (sound ? " on" : "") + '" data-a="sound" aria-label="' + esc(T().sound) + '" aria-pressed="' + sound + '">' + ic(sound ? "vol" : "mute") + "</button>" : '<span class="la-chip">' + esc(T().plusOnly) + "</span>") + "</div>";
  }
  function drawHome() {
    var t = T(), li = LEVELS.indexOf(level), sets = '<div class="la-set"><div class="la-h">' + esc(t.lvl) + '</div><div class="la-chips">' + LEVELS.map(function (l) { return '<button class="la-lv' + (l === level ? " on" : "") + '" data-a="lvl" data-l="' + l + '">' + l + "</button>"; }).join("") + '</div><div class="la-lvd">' + esc((t.lvDesc || [])[li] || "") + '</div><div class="la-h">' + esc(t.voiceT) + '</div><div class="la-vrow"><select id="laVoice" aria-label="' + esc(t.voiceT) + '">' + VOICES.map(function (v) { return '<option value="' + v + '"' + (v === voice ? " selected" : "") + ">" + v.charAt(0).toUpperCase() + v.slice(1) + "</option>"; }).join("") + '</select><button data-a="preview">▶ ' + esc(t.preview) + "</button></div></div>",
      h = head(t.title, t.sub, false) + '<div class="la-body">' + sets + '<button class="la-card hero" data-a="free"><div class="la-ico">💬</div><div class="la-grow"><b>' + esc(t.free) + "</b><span>" + esc(t.freeSub) + '</span></div></button><button class="la-card" data-a="study"><div class="la-ico">📚</div><div class="la-grow"><b>' + esc(t.study) + "</b><span>" + esc(t.studySub) + " · " + level + '</span></div></button><div class="la-h">' + esc(t.lessons) + '</div><div class="la-note" style="font-size:12.5px;color:var(--mist,#6d6759);margin:-2px 2px 10px">' + esc(t.lessonsSub) + "</div>";
    units().forEach(function (u, n) { var p = prog[u.k]; h += '<button class="la-card" data-a="unit" data-n="' + n + '"><div class="la-ico">' + u.ico + '</div><div class="la-grow"><b>' + esc(uTitle(u)) + "</b>" + (p ? "<span>" + esc(t.best) + ': <b class="la-sc" style="display:inline">' + p.best + "</b> · " + p.tries + "×</span>" : "<span>" + esc(t.start) + " · 6 " + esc(t.turns) + "</span>") + "</div></button>"; });
    el.querySelector(".la-app").innerHTML = h + "</div>";
  }
  function bubble(m) {
    var t = T();
    if (m.role === "user") return '<div class="la-b me"><div class="la-jp" style="font-size:16px">' + esc(m.text) + "</div></div>" + (m.cor ? '<div class="la-cor"><b>' + esc(t.better) + '</b><div class="bt">' + esc(m.cor.better) + "</div>" + esc(m.cor.why) + "</div>" : "");
    return '<div class="la-b"><div class="la-jp">' + esc(m.text) + '</div><div class="la-rd">' + esc(m.reading) + '</div><div class="la-ro">' + esc(m.romaji || toRomaji(m.reading, true)) + '</div><div class="la-mn">' + esc(m.meaning) + '</div><button class="la-ib" data-a="play" data-t="' + esc(m.text) + '" aria-label="' + esc(t.say) + '" style="margin:4px 0 -6px -8px">' + ic("vol", 18) + "</button></div>";
  }
  function drawList() {
    var l = $("#laList"); if (!l) return; var t = T(), h = msgs.map(bubble).join("");
    if (done) h += '<div class="la-sum"><div class="la-ring" style="--p:' + done.score + '"><i>' + done.score + "</i></div><h4>" + esc(t.good) + "</h4><ul>" + done.good.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul><h4>" + esc(t.improve) + "</h4><ul>" + done.improve.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><div class="la-act"><button class="g" data-a="again">' + esc(t.again) + '</button><button data-a="finish">' + esc(t.finish) + "</button></div></div>";
    else if (hint && !sending) h += '<button class="la-hint" data-a="hint" data-t="' + esc(hint.split(" (")[0]) + '">' + esc(t.tryHint) + ": " + esc(hint) + "</button>";
    if (sending) h += '<div class="la-typ">' + esc(t.thinking) + "</div>";
    l.innerHTML = h; l.scrollTop = l.scrollHeight;
  }
  function drawChat() {
    var t = T(); el.querySelector(".la-app").innerHTML = head(unit ? uTitle(unit) : t.free, t.sub, true) + '<div class="la-list" id="laList"></div><div class="la-comp"' + (done ? ' style="display:none"' : "") + '><button class="la-btn mic" data-a="mic" aria-label="' + esc(t.mic) + '">' + ic("mic", 22) + '</button><textarea id="laTxt" rows="1" maxlength="300" placeholder="' + esc(t.ph) + '" enterkeyhint="send" lang="ja"></textarea><button class="la-btn" data-a="send" aria-label="' + esc(t.send) + '">' + ic("send", 22) + "</button></div>";
    drawList();
  }

  /* ---------- alur ---------- */
  function errMsg(e) { var t = T(); if (e && e.code === "limit") return t.errLimit; if (e && e.code === "plus") return t.errPlus; if (e && e.code === "net") return t.errNet; return t.errAi; }
  function ask(retry) { // minta giliran LEA berikutnya
    sending = true; hint = ""; drawList();
    var payload = msgs.map(function (m) { return { role: m.role, text: m.text }; });
    window.KakeiboAuth.api("/api/ai/lea", { lang: aiLang(), level: level, unit: unit ? { title: unit.n[1], phrases: unit.p.map(function (p) { return p[0]; }) } : null, messages: payload }).then(function (r) {
      sending = false;
      var last = msgs[msgs.length - 1]; if (last && last.role === "user" && r.correction) last.cor = r.correction;
      msgs.push({ role: "assistant", text: r.reply, reading: r.reading, romaji: r.romaji, meaning: r.meaning }); hint = r.hint || "";
      if (r.final && r.summary) { done = { score: r.summary.score, good: r.summary.good || [], improve: r.summary.improve || [] }; record(done.score); if (el.querySelector(".la-comp")) el.querySelector(".la-comp").style.display = "none"; }
      drawList(); if (sound) say(r.reply);
    }).catch(function (e) {
      sending = false; drawList(); var l = $("#laList"); if (!l) return;
      l.insertAdjacentHTML("beforeend", '<div class="la-err">' + esc(errMsg(e)) + (e && e.code !== "limit" && e.code !== "plus" ? '<br><button data-a="retry">' + esc(T().retry) + "</button>" : "") + "</div>"); l.scrollTop = l.scrollHeight;
    });
  }
  function record(score) { var k = unit ? unit.k : "_free", p = prog[k] || { best: 0, tries: 0 }; p.best = Math.max(p.best, score); p.tries++; p.at = Date.now(); prog[k] = p; saveProg(); }
  function start(u) { prime(); unit = u || null; msgs = []; done = null; hint = ""; sending = false; view = "chat"; drawChat(); ask(); }
  function send() {
    var ta = $("#laTxt"); if (!ta || sending || done) return; var v = ta.value.trim(); if (!v) return;
    ta.value = ""; ta.style.height = ""; stopSay(); prime();
    msgs.push({ role: "user", text: v }); ask();
  }
  function plusOk() { var A = window.KakeiboAuth; if (A && A.isPlus && A.isPlus()) return true; if (A && A.require) A.require(); return false; }
  function go(home) { if (rec) { try { rec.stop(); } catch (e) {} } stopSay(); view = home ? "home" : view; if (home) drawHome(); }
  function close() { go(false); if (el) { el.remove(); el = null; } }

  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a;
    if (a === "close") close();
    else if (a === "back") goBack();
    else if (a === "lvl") { if (LEVELS.indexOf(b.dataset.l) >= 0) { level = b.dataset.l; try { localStorage.setItem("kakeibo-lea-level", level); } catch (x) {} drawHome(); } }
    else if (a === "preview") { if (plusOk()) { prime(); say("こんにちは。一緒に日本語を勉強しましょう。"); } }
    else if (a === "free") { if (plusOk()) start(null); }
    else if (a === "unit") { if (plusOk()) start(units()[+b.dataset.n]); }
    else if (a === "send") send();
    else if (a === "mic") listen();
    else if (a === "play") { if (view === "study" || view === "topic" || view === "quiz" || view === "result") { stopSay(); sayBrowser(b.dataset.t); } else { prime(); say(b.dataset.t); } } // kartu belajar: suara bawaan browser (gratis), bukan TTS API
    else if (a === "study") drawStudy();
    else if (a === "slvl") { if (LEVELS.indexOf(b.dataset.l) >= 0) { level = b.dataset.l; try { localStorage.setItem("kakeibo-lea-level", level); } catch (x) {} drawStudy(); } }
    else if (a === "stab") { st.tab = ["vocab", "grammar", "kanji"].indexOf(b.dataset.t) >= 0 ? b.dataset.t : "vocab"; drawStudy(); }
    else if (a === "topic") openTopic(+b.dataset.n);
    else if (a === "quiz") startQuiz();
    else if (a === "opt") pickOpt(+b.dataset.i);
    else if (a === "qnext") nextQ();
    else if (a === "tolist") { st.seq++; drawStudy(); }
    else if (a === "sretry") { if (st.retry) st.retry(); }
    else if (a === "hint") { var ta = $("#laTxt"); if (ta) { ta.value = b.dataset.t; ta.focus(); } }
    else if (a === "retry") { var er = b.closest(".la-err"); if (er) er.remove(); ask(); }
    else if (a === "again") start(unit);
    else if (a === "finish") go(true);
    else if (a === "sound") { sound = !sound; try { localStorage.setItem(SKEY, sound ? "1" : "0"); } catch (x) {} if (!sound) stopSay(); else prime(); b.classList.toggle("on", sound); b.setAttribute("aria-pressed", sound); b.innerHTML = ic(sound ? "vol" : "mute"); }
  }
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
  // ---- Belajar JLPT: kotoba, bunpou, kanji, latihan. Daftar topik dari modul lea-study-data.js, isi dibuat AI oleh worker lalu disimpan ----
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

  // ---- Materi lokal (gratis, tanpa API): kotoba & kanji dibaca dari modules/jlpt/n5..n1.js. API hanya dipakai untuk kaiwa dan bunpou ----
  var VCH = 30, KCH = 10, topicMemo = {};
  function localReady(lv) { return !!(window.JLPT_LOCAL && window.JLPT_LOCAL[lv]); }
  function loadLocal(lv, ok, fail) {
    if (localReady(lv)) return ok();
    var s = document.createElement("script"); s.src = "modules/jlpt/" + lv.toLowerCase() + ".js";
    s.onload = function () { if (localReady(lv)) ok(); else fail(); }; s.onerror = fail;
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
  function loadGrammar() {
    return new Promise(function (ok, no) {
      if (window.JLPT_GRAMMAR) return ok();
      var sc = document.createElement("script"); sc.src = "modules/jlpt/grammar.js";
      sc.onload = function () { if (window.JLPT_GRAMMAR) ok(); else no(); }; sc.onerror = no;
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
    else if (view === "study") { view = "home"; drawHome(); }
    else go(true);
  }
  function mount() {
    css(); if (el) return;
    el = document.createElement("div"); el.className = "la-root"; el.innerHTML = '<div class="la-app"></div>';
    el.addEventListener("click", onClick);
    el.addEventListener("change", function (e) { if (e.target.id === "laVoice" && VOICES.indexOf(e.target.value) >= 0) { voice = e.target.value; stopSay(); try { localStorage.setItem("kakeibo-lea-voice", voice); } catch (x) {} } });
    el.addEventListener("keydown", function (e) { if (e.target.id === "laTxt" && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } else if (e.key === "Escape") { if (view !== "home") goBack(); else close(); } });
    el.addEventListener("input", function (e) { if (e.target.id === "laTxt") { e.target.style.height = "auto"; e.target.style.height = Math.min(110, e.target.scrollHeight) + "px"; } });
    document.body.appendChild(el); view = "home"; drawHome();
  }
  window.KakeiboLeaAI = {
    open: function (ctx) {
      host = Object.assign(host, ctx || {});
      mount(); // belajar JLPT gratis & offline; fitur kaiwa dicek Premium+ di plusOk()
    },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; if (view !== "home") goBack(); else close(); return true; }
  };
})();
