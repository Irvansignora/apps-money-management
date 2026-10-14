/* Kakeibo · LEA Sensei: tutor bahasa Jepang berbasis AI (khusus Premium+).
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
    id: { lvl: "Level belajar (JLPT)", lvDesc: ["Pemula", "Dasar", "Menengah", "Menengah atas", "Mahir"], voiceT: "Suara LEA", preview: "Dengar contoh", title: "LEA Sensei", sub: "Belajar bahasa Jepang bareng AI", free: "Kaiwa bebas", freeSub: "Ngobrol santai, LEA mengoreksi kalimatmu", lessons: "Pelajaran terstruktur", lessonsSub: "Latihan dialog per tema, ada nilai di akhir", best: "Nilai terbaik", turns: "giliran", ph: "Tulis dalam bahasa Jepang…", say: "Ucapkan", send: "Kirim", mic: "Bicara", better: "Lebih natural", why: "Kenapa", tryHint: "Coba bilang", meaning: "Arti", sound: "Suara", score: "Nilai", good: "Sudah bagus", improve: "Perlu dilatih", again: "Ulangi", finish: "Selesai", back: "Kembali", thinking: "LEA sedang menulis…", left: "Sisa hari ini", errNet: "Tidak bisa terhubung. Coba lagi.", errAi: "AI sedang sibuk. Coba lagi sebentar.", errLimit: "Batas pesan LEA Sensei hari ini sudah habis. Besok bisa lanjut.", errPlus: "Fitur ini khusus Premium+.", retry: "Coba lagi", noMic: "HP ini belum mendukung input suara.", micDenied: "Izin mikrofon ditolak.", start: "Mulai", plusOnly: "Premium+" },
    en: { lvl: "Study level (JLPT)", lvDesc: ["Beginner", "Elementary", "Intermediate", "Upper-intermediate", "Advanced"], voiceT: "LEA's voice", preview: "Play sample", title: "LEA Sensei", sub: "Learn Japanese with AI", free: "Free conversation", freeSub: "Chat casually, LEA corrects your sentences", lessons: "Structured lessons", lessonsSub: "Dialogue practice by topic, with a score at the end", best: "Best score", turns: "turns", ph: "Write in Japanese…", say: "Play", send: "Send", mic: "Speak", better: "More natural", why: "Why", tryHint: "Try saying", meaning: "Meaning", sound: "Sound", score: "Score", good: "Done well", improve: "To practise", again: "Again", finish: "Finish", back: "Back", thinking: "LEA is writing…", left: "Left today", errNet: "Cannot connect. Try again.", errAi: "The AI is busy. Try again shortly.", errLimit: "You reached today's LEA Sensei message limit. Continue tomorrow.", errPlus: "This feature is for Premium+ only.", retry: "Retry", noMic: "This phone does not support voice input.", micDenied: "Microphone permission denied.", start: "Start", plusOnly: "Premium+" },
    my: { lvl: "သင်ယူမည့် အဆင့် (JLPT)", lvDesc: ["အစပြု", "အခြေခံ", "အလယ်အလတ်", "အလယ်အလတ်အထက်", "ကျွမ်းကျင်"], voiceT: "LEA ၏ အသံ", preview: "နမူနာ နားထောင်ရန်", title: "LEA Sensei", sub: "AI နှင့်အတူ ဂျပန်စာသင်ပါ", free: "လွတ်လပ်စွာ စကားပြော", freeSub: "ပေါ့ပေါ့ပါးပါး ပြောပါ၊ LEA က သင့်ဝါကျများကို ပြင်ပေးမည်", lessons: "အဆင့်လိုက် သင်ခန်းစာ", lessonsSub: "အကြောင်းအရာအလိုက် စကားပြောလေ့ကျင့်ပြီး အဆုံးတွင် အမှတ်ပေးမည်", best: "အမြင့်ဆုံးအမှတ်", turns: "ကြိမ်", ph: "ဂျပန်လိုရေးပါ…", say: "နားထောင်ရန်", send: "ပို့ရန်", mic: "ပြောရန်", better: "ပိုသဘာဝကျသော", why: "အကြောင်းရင်း", tryHint: "ဒီလိုပြောကြည့်ပါ", meaning: "အဓိပ္ပာယ်", sound: "အသံ", score: "အမှတ်", good: "ကောင်းသည့်အချက်", improve: "ထပ်လေ့ကျင့်ရန်", again: "ထပ်လုပ်ရန်", finish: "ပြီးပြီ", back: "နောက်သို့", thinking: "LEA ရေးနေသည်…", left: "ယနေ့ ကျန်ရှိ", errNet: "ချိတ်ဆက်၍မရပါ။ ထပ်ကြိုးစားပါ။", errAi: "AI အလုပ်များနေသည်။ ခဏနေပြီး ထပ်ကြိုးစားပါ။", errLimit: "ယနေ့ LEA Sensei မက်ဆေ့ချ် ကန့်သတ်ချက် ပြည့်သွားပြီ။ မနက်ဖြန် ဆက်လုပ်ပါ။", errPlus: "ဤလုပ်ဆောင်ချက်သည် Premium+ အတွက်သာ ဖြစ်သည်။", retry: "ထပ်ကြိုးစားရန်", noMic: "ဤဖုန်းတွင် အသံထည့်သွင်းမှု မပံ့ပိုးပါ။", micDenied: "မိုက်ခရိုဖုန်း ခွင့်ပြုချက် ငြင်းပယ်ခံရသည်။", start: "စတင်ရန်", plusOnly: "Premium+" }
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
      h = head(t.title, t.sub, false) + '<div class="la-body">' + sets + '<button class="la-card hero" data-a="free"><div class="la-ico">💬</div><div class="la-grow"><b>' + esc(t.free) + "</b><span>" + esc(t.freeSub) + '</span></div></button><div class="la-h">' + esc(t.lessons) + '</div><div class="la-note" style="font-size:12.5px;color:var(--mist,#6d6759);margin:-2px 2px 10px">' + esc(t.lessonsSub) + "</div>";
    units().forEach(function (u, n) { var p = prog[u.k]; h += '<button class="la-card" data-a="unit" data-n="' + n + '"><div class="la-ico">' + u.ico + '</div><div class="la-grow"><b>' + esc(uTitle(u)) + "</b>" + (p ? "<span>" + esc(t.best) + ': <b class="la-sc" style="display:inline">' + p.best + "</b> · " + p.tries + "×</span>" : "<span>" + esc(t.start) + " · 6 " + esc(t.turns) + "</span>") + "</div></button>"; });
    el.querySelector(".la-app").innerHTML = h + "</div>";
  }
  function bubble(m) {
    var t = T();
    if (m.role === "user") return '<div class="la-b me"><div class="la-jp" style="font-size:16px">' + esc(m.text) + "</div></div>" + (m.cor ? '<div class="la-cor"><b>' + esc(t.better) + '</b><div class="bt">' + esc(m.cor.better) + "</div>" + esc(m.cor.why) + "</div>" : "");
    return '<div class="la-b"><div class="la-jp">' + esc(m.text) + '</div><div class="la-rd">' + esc(m.reading) + '</div><div class="la-mn">' + esc(m.meaning) + '</div><button class="la-ib" data-a="play" data-t="' + esc(m.text) + '" aria-label="' + esc(t.say) + '" style="margin:4px 0 -6px -8px">' + ic("vol", 18) + "</button></div>";
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
      msgs.push({ role: "assistant", text: r.reply, reading: r.reading, meaning: r.meaning }); hint = r.hint || "";
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
  function go(home) { if (rec) { try { rec.stop(); } catch (e) {} } stopSay(); view = home ? "home" : view; if (home) drawHome(); }
  function close() { go(false); if (el) { el.remove(); el = null; } }

  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a;
    if (a === "close") close();
    else if (a === "back") go(true);
    else if (a === "lvl") { if (LEVELS.indexOf(b.dataset.l) >= 0) { level = b.dataset.l; try { localStorage.setItem("kakeibo-lea-level", level); } catch (x) {} drawHome(); } }
    else if (a === "preview") { prime(); say("こんにちは。一緒に日本語を勉強しましょう。"); }
    else if (a === "free") start(null);
    else if (a === "unit") start(units()[+b.dataset.n]);
    else if (a === "send") send();
    else if (a === "mic") listen();
    else if (a === "play") say(b.dataset.t);
    else if (a === "hint") { var ta = $("#laTxt"); if (ta) { ta.value = b.dataset.t; ta.focus(); } }
    else if (a === "retry") { var er = b.closest(".la-err"); if (er) er.remove(); ask(); }
    else if (a === "again") start(unit);
    else if (a === "finish") go(true);
    else if (a === "sound") { sound = !sound; try { localStorage.setItem(SKEY, sound ? "1" : "0"); } catch (x) {} if (!sound) stopSay(); else prime(); b.classList.toggle("on", sound); b.setAttribute("aria-pressed", sound); b.innerHTML = ic(sound ? "vol" : "mute"); }
  }
  function mount() {
    css(); if (el) return;
    el = document.createElement("div"); el.className = "la-root"; el.innerHTML = '<div class="la-app"></div>';
    el.addEventListener("click", onClick);
    el.addEventListener("change", function (e) { if (e.target.id === "laVoice" && VOICES.indexOf(e.target.value) >= 0) { voice = e.target.value; stopSay(); try { localStorage.setItem("kakeibo-lea-voice", voice); } catch (x) {} } });
    el.addEventListener("keydown", function (e) { if (e.target.id === "laTxt" && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } else if (e.key === "Escape") { if (view === "chat") go(true); else close(); } });
    el.addEventListener("input", function (e) { if (e.target.id === "laTxt") { e.target.style.height = "auto"; e.target.style.height = Math.min(110, e.target.scrollHeight) + "px"; } });
    document.body.appendChild(el); view = "home"; drawHome();
  }
  window.KakeiboLeaAI = {
    open: function (ctx) {
      host = Object.assign(host, ctx || {});
      if (!window.KakeiboAuth) return;
      window.KakeiboAuth.require(function () { mount(); });
    },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; if (view === "chat") go(true); else close(); return true; }
  };
})();
