/* Kakeibo · LEA Sensei: tutor kaiwa bahasa Jepang berbasis AI (khusus Premium+).
 * Dua mode: kaiwa bebas dan pelajaran terstruktur (unit dari modul Belajar). Tiap sesi 6 giliran lalu
 * AI memberi nilai dan saran. Dipanggil host: KakeiboLeaAI.open({ lang, esc }). Butuh KakeiboAuth. */
(function () {
  "use strict";
  var host = { lang: "id" }, el = null, view = "home", unit = null, msgs = [], sending = false, rec = null, done = null, hint = "", mode = "class", qa = { correct: 0, almost: 0, wrong: 0 }, call = null, curHooks = null, callTok = 0, cls = { ctx: { kind: "free", key: "_free", title: "", items: [] }, st: { turn: 0, covered: [], weak: [] } }, profile = {}, review = [], viewPref = "video", micNative = false;
  var KEY = "kakeibo-lea-progress", SKEY = "kakeibo-lea-sound";
  var LI = { id: 0, en: 1, vi: 2 }, AI_LANGS = ["id", "en", "my", "bn", "vi", "th", "zh", "ko"];
  var prog = {}, sound = true, voice = "coral", level = "N5", VOICES = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"], LEVELS = ["N5", "N4", "N3", "N2", "N1"];
  try { prog = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; sound = localStorage.getItem(SKEY) !== "0"; var sv = localStorage.getItem("kakeibo-lea-voice"), sl = localStorage.getItem("kakeibo-lea-level"); if (VOICES.indexOf(sv) >= 0) voice = sv; if (LEVELS.indexOf(sl) >= 0) level = sl; var sm0 = localStorage.getItem("kakeibo-lea-mode"); if (sm0 === "chat" || sm0 === "qa" || sm0 === "ask" || sm0 === "class") mode = sm0; } catch (e) {}
  var saveProg = function () { try { localStorage.setItem(KEY, JSON.stringify(prog)); } catch (e) {} };

  var UI = {"id": {"study": "Belajar JLPT", "studySub": "Kotoba, bunpou, kanji, dan latihan sesuai level", "lvl": "Level belajar (JLPT)", "lvDesc": ["Pemula", "Dasar", "Menengah", "Menengah atas", "Mahir"], "voiceT": "Suara LEA", "preview": "Dengar contoh", "title": "LEA Sensei", "sub": "Belajar bahasa Jepang bareng AI", "free": "Kaiwa bebas", "freeSub": "Ngobrol santai, LEA mengoreksi kalimatmu", "lessons": "Pelajaran terstruktur", "lessonsSub": "Latihan dialog per tema, ada nilai di akhir", "best": "Nilai terbaik", "turns": "giliran", "ph": "Tulis dalam bahasa Jepang…", "say": "Ucapkan", "send": "Kirim", "mic": "Bicara", "better": "Lebih natural", "tryHint": "Coba bilang", "sound": "Suara", "good": "Sudah bagus", "improve": "Perlu dilatih", "again": "Ulangi", "finish": "Selesai", "back": "Kembali", "thinking": "LEA sedang menulis…", "errNet": "Tidak bisa terhubung. Coba lagi.", "errAi": "AI sedang sibuk. Coba lagi sebentar.", "errLimit": "Batas pesan LEA Sensei hari ini sudah habis. Besok bisa lanjut.", "errPlus": "Fitur ini khusus Premium+.", "retry": "Coba lagi", "noMic": "HP ini belum mendukung input suara.", "micDenied": "Izin mikrofon ditolak.", "start": "Mulai", "plusOnly": "Premium+"}, "en": {"study": "JLPT study", "studySub": "Kotoba, bunpou, kanji and practice for your level", "lvl": "Study level (JLPT)", "lvDesc": ["Beginner", "Elementary", "Intermediate", "Upper-intermediate", "Advanced"], "voiceT": "LEA's voice", "preview": "Play sample", "title": "LEA Sensei", "sub": "Learn Japanese with AI", "free": "Free conversation", "freeSub": "Chat casually, LEA corrects your sentences", "lessons": "Structured lessons", "lessonsSub": "Dialogue practice by topic, with a score at the end", "best": "Best score", "turns": "turns", "ph": "Write in Japanese…", "say": "Play", "send": "Send", "mic": "Speak", "better": "More natural", "tryHint": "Try saying", "sound": "Sound", "good": "Done well", "improve": "To practise", "again": "Again", "finish": "Finish", "back": "Back", "thinking": "LEA is writing…", "errNet": "Cannot connect. Try again.", "errAi": "The AI is busy. Try again shortly.", "errLimit": "You reached today's LEA Sensei message limit. Continue tomorrow.", "errPlus": "This feature is for Premium+ only.", "retry": "Retry", "noMic": "This phone does not support voice input.", "micDenied": "Microphone permission denied.", "start": "Start", "plusOnly": "Premium+"}, "my": {"study": "JLPT လေ့လာရန်", "studySub": "အဆင့်အလိုက် ဝေါဟာရ၊ သဒ္ဒါနှင့် လေ့ကျင့်ခန်း", "lvl": "သင်ယူမည့် အဆင့် (JLPT)", "lvDesc": ["အစပြု", "အခြေခံ", "အလယ်အလတ်", "အလယ်အလတ်အထက်", "ကျွမ်းကျင်"], "voiceT": "LEA ၏ အသံ", "preview": "နမူနာ နားထောင်ရန်", "title": "LEA Sensei", "sub": "AI နှင့်အတူ ဂျပန်စာသင်ပါ", "free": "လွတ်လပ်စွာ စကားပြော", "freeSub": "ပေါ့ပေါ့ပါးပါး ပြောပါ၊ LEA က သင့်ဝါကျများကို ပြင်ပေးမည်", "lessons": "အဆင့်လိုက် သင်ခန်းစာ", "lessonsSub": "အကြောင်းအရာအလိုက် စကားပြောလေ့ကျင့်ပြီး အဆုံးတွင် အမှတ်ပေးမည်", "best": "အမြင့်ဆုံးအမှတ်", "turns": "ကြိမ်", "ph": "ဂျပန်လိုရေးပါ…", "say": "နားထောင်ရန်", "send": "ပို့ရန်", "mic": "ပြောရန်", "better": "ပိုသဘာဝကျသော", "tryHint": "ဒီလိုပြောကြည့်ပါ", "sound": "အသံ", "good": "ကောင်းသည့်အချက်", "improve": "ထပ်လေ့ကျင့်ရန်", "again": "ထပ်လုပ်ရန်", "finish": "ပြီးပြီ", "back": "နောက်သို့", "thinking": "LEA ရေးနေသည်…", "errNet": "ချိတ်ဆက်၍မရပါ။ ထပ်ကြိုးစားပါ။", "errAi": "AI အလုပ်များနေသည်။ ခဏနေပြီး ထပ်ကြိုးစားပါ။", "errLimit": "ယနေ့ LEA Sensei မက်ဆေ့ချ် ကန့်သတ်ချက် ပြည့်သွားပြီ။ မနက်ဖြန် ဆက်လုပ်ပါ။", "errPlus": "ဤလုပ်ဆောင်ချက်သည် Premium+ အတွက်သာ ဖြစ်သည်။", "retry": "ထပ်ကြိုးစားရန်", "noMic": "ဤဖုန်းတွင် အသံထည့်သွင်းမှု မပံ့ပိုးပါ။", "micDenied": "မိုက်ခရိုဖုန်း ခွင့်ပြုချက် ငြင်းပယ်ခံရသည်။", "start": "စတင်ရန်", "plusOnly": "Premium+"}};
  Object.assign(UI.id, { modeT: "Mode latihan", modeQa: "🎯 Tanya Jawab", modeChat: "💬 Ngobrol", modeQaD: "LEA bertanya, kamu menjawab. Setiap jawaban dinilai, dan kalau keliru LEA memberi koreksi beserta jawaban yang benar.", modeChatD: "Ngobrol bebas dengan LEA. Koreksi muncul kalau ada kesalahan.", qaFree: "Tanya Jawab Bebas", qaFreeSub: "LEA menanyaimu satu per satu sesuai level, lalu mengoreksi jawabanmu", qaQ: "pertanyaan", qaPh: "Jawab dalam bahasa Jepang…", vdcorrect: "Benar!", vdalmost: "Hampir tepat", vdwrong: "Kurang tepat", qaAnswer: "Jawaban yang benar", qaResult: "Hasil jawabanmu" });
  Object.assign(UI.en, { modeT: "Practice mode", modeQa: "🎯 Q&A", modeChat: "💬 Chat", modeQaD: "LEA asks, you answer. Every answer is graded, and if it is wrong LEA corrects it and shows the right answer.", modeChatD: "Free chat with LEA. Corrections appear when you make a mistake.", qaFree: "Free Q&A", qaFreeSub: "LEA asks you questions one by one at your level, then corrects your answers", qaQ: "questions", qaPh: "Answer in Japanese…", vdcorrect: "Correct!", vdalmost: "Almost there", vdwrong: "Not quite", qaAnswer: "Correct answer", qaResult: "Your answers" });
  Object.assign(UI.id, { modeAsk: "🙋 Tanya Sensei", modeAskD: "Kamu yang bertanya: arti kata, tata bahasa, cara mengucapkan sesuatu, atau hidup dan kerja di Jepang. LEA menjawab dan memberi contoh kalimat.", askFree: "Tanya Sensei", askFreeSub: "Tanya apa saja soal bahasa Jepang dan hidup di Jepang", askPh: "Ketik atau ucapkan pertanyaanmu…", callCard: "Video Sensei", callCardSub: "Bicara langsung dengan LEA Sensei yang beranimasi", toText: "Mode teks", toVideo: "Mode video", callHint: "Ketuk mikrofon lalu bicara, atau ketik di bawah.", callNoAv: "Animasi gagal dimuat, tampil sebagai teks.", replay: "Ulangi suara" });
  Object.assign(UI.en, { modeAsk: "🙋 Ask Sensei", modeAskD: "You ask: word meanings, grammar, how to say something, or life and work in Japan. LEA answers and gives an example sentence.", askFree: "Ask Sensei", askFreeSub: "Ask anything about Japanese and life in Japan", askPh: "Type or say your question…", callCard: "Video Sensei", callCardSub: "Talk face to face with an animated LEA Sensei", toText: "Text mode", toVideo: "Video mode", callHint: "Tap the microphone and speak, or type below.", callNoAv: "The animation failed to load, showing text instead.", replay: "Replay voice" });
  Object.assign(UI.id, { modeClass: "🎓 Kelas", modeClassD: "Sensei mengajar materi pilihanmu seperti guru les: menjelaskan, menyuruhmu mencoba, mengoreksi, dan kamu boleh bertanya kapan saja. Ia ingat kelemahanmu.", classFree: "Kelas bareng Sensei", classFreeSub: "Topik menyesuaikan pekerjaan dan tujuanmu", classPh: "Jawab Sensei, atau tanya apa saja…", profT: "Profil belajar", jobL: "Bidang kerja", goalL: "Tujuan", jobs: [["kaigo", "Perawatan lansia"], ["restoran", "Restoran"], ["pabrik", "Pabrik"], ["konstruksi", "Konstruksi"], ["pertanian", "Pertanian"], ["hotel", "Hotel"], ["lain", "Lainnya"]], goals: [["JFT-Basic", "JFT-Basic"], ["JLPT", "JLPT"], ["SSW", "Tes SSW"], ["sehari-hari", "Sehari-hari"]], viewL: "Tampilan", viewVideo: "📹 Video", viewText: "💬 Teks", reviewCard: "Ulangi yang masih lemah", reviewSub: "{n} kata atau frasa dari kelas sebelumnya", sayIt: "Ucapkan", topicsL: "Materi", teachMe: "Ajari aku tentang 「{x}」", scoreL: "Kemiripan ucapan", savedReview: "{n} item masuk daftar ulangan. Sensei akan mengulangnya di kelas berikutnya.", micJa: "Bicara dalam bahasa Jepang", micNative: "Bicara dalam bahasamu", classSub: "{a} dari {b} materi", classSubFree: "{n} giliran" });
  Object.assign(UI.en, { modeClass: "🎓 Class", modeClassD: "Sensei teaches your chosen material like a private tutor: explaining, getting you to try, correcting, and you can ask anything at any time. She remembers your weak points.", classFree: "Class with Sensei", classFreeSub: "Topics fit your job and your goal", classPh: "Answer Sensei, or ask anything…", profT: "Learning profile", jobL: "Field of work", goalL: "Goal", jobs: [["kaigo", "Nursing care"], ["restoran", "Restaurant"], ["pabrik", "Factory"], ["konstruksi", "Construction"], ["pertanian", "Agriculture"], ["hotel", "Hotel"], ["lain", "Other"]], goals: [["JFT-Basic", "JFT-Basic"], ["JLPT", "JLPT"], ["SSW", "SSW test"], ["sehari-hari", "Daily life"]], viewL: "View", viewVideo: "📹 Video", viewText: "💬 Text", reviewCard: "Review your weak points", reviewSub: "{n} words or phrases from earlier classes", sayIt: "Say it", topicsL: "Material", teachMe: "Teach me about 「{x}」", scoreL: "Pronunciation match", savedReview: "{n} items added to your review list. Sensei will bring them back next class.", micJa: "Speak Japanese", micNative: "Speak your language", classSub: "{a} of {b} items", classSubFree: "{n} turns" });
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
      ".la-root{position:fixed;inset:0;z-index:70;display:flex;justify-content:center;background:rgba(23,35,61,.55);font-family:Inter,sans-serif;animation:fadeIn .2s both}",
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
      ".la-fb{align-self:flex-end;max-width:88%;border-radius:14px;padding:10px 12px;font-size:13px;line-height:1.5;border:1px solid}.la-fb b{display:block;font:800 13px Inter,sans-serif;margin-bottom:3px}.la-fb .bt{font:600 15px 'Shippori Mincho',serif;margin:4px 0 2px}.la-fb.correct{background:#eaf6ee;border-color:#9fd2b0}.la-fb.correct b{color:#25724a}.la-fb.almost{background:#fff7e2;border-color:#e6c97a}.la-fb.almost b{color:#8a5a0c}.la-fb.wrong{background:#fdeceb;border-color:#e8aaa4}.la-fb.wrong b{color:#ac3527}.la-fb .la-ib{width:30px;height:30px;flex:0 0 30px;display:inline-grid;vertical-align:middle;margin:-4px 0 -4px 2px}.la-qs{display:flex;justify-content:center;gap:14px;font:700 14px Inter,sans-serif;margin:0 0 8px}",
      ".la-exp{font-size:14px;line-height:1.5;margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed var(--line,rgba(122,110,80,.3))}",
      ".lc-top{position:relative;z-index:2;display:flex;align-items:center;gap:4px;padding:calc(env(safe-area-inset-top,0px) + 6px) 8px 8px}.lc-modes{flex:1;min-width:0;display:flex;gap:5px;overflow-x:auto;scrollbar-width:none}.lc-modes::-webkit-scrollbar{display:none}.lc-mode{flex:0 0 auto;border:0;border-radius:99px;padding:8px 12px;background:rgba(23,35,61,.08);color:inherit;font:700 12px Inter,sans-serif;cursor:pointer;white-space:nowrap}.lc-mode.on{background:var(--ai,#17233d);color:#fff}",
      ".lc-av{flex:0 0 auto;height:min(42vh,340px);margin:0 12px;border-radius:26px;overflow:hidden;box-shadow:0 14px 30px -18px rgba(23,35,61,.6);background:#e8dcc0}.lc-av svg{display:block}.lc-fb{height:100%;display:grid;place-items:center;align-content:center;font-size:92px;text-align:center}.lc-fb small{font-size:12px;opacity:.7}",
      ".lc-sub{flex:1;min-height:0;overflow-y:auto;padding:12px 18px 6px;-webkit-overflow-scrolling:touch}.lc-hint{color:var(--mist,#6d6759);font-size:13px;line-height:1.5;text-align:center;padding:14px 0}.lc-you{font-size:13.5px;color:var(--mist,#6d6759);margin-bottom:8px;padding-left:10px;border-left:3px solid var(--line,rgba(122,110,80,.4))}.lc-ex{font-size:14.5px;line-height:1.55;margin-bottom:10px}",
      ".lc-jp{font:700 22px/1.45 'Shippori Mincho',serif}.lc-rd{margin-top:3px;font-size:14.5px;color:var(--hanko,#ac3527);line-height:1.6}.lc-m{border-radius:4px;padding:1px 0;transition:background .1s,opacity .1s}.lc-m.on{background:rgba(217,130,47,.4)}.lc-m.d{opacity:.5}.lc-ro{font-size:12.5px;color:var(--mist,#6d6759);margin-top:2px}.lc-mn{font-size:14px;margin-top:6px;line-height:1.5}",
      ".la-btn.mini{width:38px;height:38px;flex:0 0 38px;font-size:18px;background:rgba(23,35,61,.08);color:inherit;border-radius:50%;padding:0}",
      ".lc-tp{display:flex;gap:6px;overflow-x:auto;padding:4px 12px 8px;scrollbar-width:none;align-items:center}.lc-tp::-webkit-scrollbar{display:none}.lc-tp>span{flex:0 0 auto;font:700 11px Inter,sans-serif;color:var(--mist,#6d6759);margin-right:2px}.lc-t{flex:0 0 auto;border:1px solid var(--line,rgba(122,110,80,.35));background:transparent;color:inherit;border-radius:99px;padding:6px 11px;font:600 13px 'Shippori Mincho',serif;cursor:pointer;white-space:nowrap}.lc-t.ok{background:#eaf6ee;border-color:#9fd2b0;color:#25724a}.lc-t.wk{background:#fff7e2;border-color:#e6c97a;color:#8a5a0c}",
      ".lc-cb{margin:8px 0 6px}.lc-pr{font-size:13.5px;color:#25724a;font-weight:600;margin-bottom:6px}.lc-ask{font-size:15px;line-height:1.5;font-weight:600;margin:6px 0 10px;padding:10px 12px;border-radius:14px;background:rgba(23,35,61,.06)}",
      ".lc-rep{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;border:0;border-radius:16px;padding:12px 14px;background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff;font:600 14px Inter,sans-serif;text-align:left;cursor:pointer}.lc-rep b{font:700 19px 'Shippori Mincho',serif}.lc-rep small{font-size:12.5px;opacity:.85}.lc-rep.rec{animation:laPulse 1s infinite}",
      ".lc-ch{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.lc-c{border:1.5px solid var(--ai,#17233d);background:transparent;color:inherit;border-radius:99px;padding:9px 15px;font:600 14px Inter,sans-serif;cursor:pointer}.lc-c:active{background:var(--ai,#17233d);color:#fff}",
      ".lc-sc{display:inline-block;margin-top:6px;font:700 11.5px Inter,sans-serif;border-radius:99px;padding:3px 9px}.lc-sc.ok{background:#eaf6ee;color:#25724a}.lc-sc.mid{background:#fff7e2;color:#8a5a0c}.lc-sc.lo{background:#fdeceb;color:#ac3527}",
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
  var IC = { video: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 11 5-3v8l-5-3z"/>', back: '<path d="M15 5 8 12l7 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', send: '<path d="M4 12 20 4l-4 16-4-7z"/>', mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>', vol: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>', mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>' };
  var ic = function (n, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>"; };

  /* ---------- suara ---------- */
  var player = null, ttsCache = {}, ttsOrder = [], ttsSeq = 0, SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
  // iOS/Safari hanya mengizinkan audio kalau elemennya sudah "dibuka" oleh sentuhan pengguna, jadi dibuka saat tombol ditekan
  function prime() { try { if (!player) player = new Audio(); player.src = SILENT; var pr = player.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
  function stopSay() { ttsSeq++; curHooks = null; try { speechSynthesis.cancel(); } catch (e) {} try { if (player) player.pause(); } catch (e) {} if (call) call.stopSpeak(); }
  function sayBrowser(txt, hooks) { // cadangan: suara bawaan HP
    try {
      speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(txt); u.lang = "ja-JP"; u.rate = 0.9; var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0]; if (v) u.voice = v;
      if (hooks) { // posisi diperkirakan dari jumlah mora (bahasa Jepang berirama per mora)
        var st = 0, fin = false, n = window.KakeiboLeaAvatar ? window.KakeiboLeaAvatar.moras(hooks.reading || txt).length : 12, dur = Math.max(1, n * 0.14 / u.rate);
        u.onstart = function () { st = performance.now(); }; u.onend = u.onerror = function () { fin = true; };
        hooks.audio(function () { if (fin) return -1; if (!st) return 0; var p = (performance.now() - st) / 1000 / dur; return p >= 1 ? 0.999 : p; });
      }
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function ttsUrl(txt, style) { // suara GPT lewat worker; hasilnya disimpan sementara (per suara) supaya putar ulang tidak memanggil server lagi
    var ck = voice + "|" + (style || "") + "|" + txt;
    if (ttsCache[ck]) return ttsCache[ck];
    var pr = window.KakeiboAuth.blob("/api/ai/tts", { text: txt, voice: voice, style: style || undefined }).then(function (b) { return URL.createObjectURL(b); });
    ttsCache[ck] = pr; ttsOrder.push(ck);
    pr.catch(function () { delete ttsCache[ck]; });
    if (ttsOrder.length > 20) { var old = ttsOrder.shift(), op = ttsCache[old]; delete ttsCache[old]; if (op) op.then(function (u) { URL.revokeObjectURL(u); }).catch(function () {}); }
    return pr;
  }
  // hooks (opsional): { reading, audio(get) } dipakai mode video; get() mengembalikan posisi audio 0..1, atau -1 bila sudah selesai/dihentikan
  function say(txt, hooks, style) {
    stopSay(); if (!txt) return; var seq = ttsSeq; curHooks = hooks || null;
    if (!window.KakeiboAuth || !window.KakeiboAuth.blob) return sayBrowser(txt, hooks);
    ttsUrl(txt, style).then(function (url) {
      if (seq !== ttsSeq) return;
      if (!player) player = new Audio();
      player.src = url; var pr = player.play();
      var get = function () { if (seq !== ttsSeq || player.ended) return -1; var d = player.duration; return d && isFinite(d) ? Math.min(0.999, player.currentTime / d) : 0.02; };
      if (pr && pr.then) pr.then(function () { if (hooks && seq === ttsSeq) hooks.audio(get); }, function () { if (seq === ttsSeq) sayBrowser(txt, hooks); });
      else if (hooks) hooks.audio(get);
    }).catch(function () { if (seq === ttsSeq) sayBrowser(txt, hooks); });
  }
  function listen() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return flash(T().noMic);
    if (rec) { try { rec.stop(); } catch (e) {} return; }
    stopSay(); prime();
    var SRL = { id: "id-ID", en: "en-US", my: "my-MM", bn: "bn-BD", vi: "vi-VN", th: "th-TH" }; rec = new SR(); rec.lang = (mode === "ask" || (mode === "class" && micNative)) ? (SRL[host.lang] || "en-US") : "ja-JP"; rec.interimResults = false; rec.maxAlternatives = 1;
    if (view === "call") setFace("listen");
    var m = $('[data-a="mic"]'); if (m) m.classList.add("rec");
    rec.onresult = function (e) { var t = e.results[0] && e.results[0][0] && e.results[0][0].transcript; if (t) { var ta = $("#laTxt"); if (ta) ta.value = t; send(); } };
    rec.onerror = function (e) { if (e.error === "not-allowed" || e.error === "service-not-allowed") flash(T().micDenied); };
    rec.onend = function () { rec = null; var b = $('[data-a="mic"]'); if (b) b.classList.remove("rec"); };
    try { rec.start(); } catch (e) { rec = null; }
  }
  function flash(msg) { var l = $("#laList") || $("#lcSub"); if (l) { l.insertAdjacentHTML("beforeend", '<div class="la-err">' + esc(msg) + "</div>"); l.scrollTop = l.scrollHeight; } }

  /* ---------- tampilan ---------- */
  function head(title, sub, back) {
    return '<div class="la-head"><button class="la-ib" data-a="' + (back ? "back" : "close") + '" aria-label="' + esc(T().back) + '">' + ic(back ? "back" : "x") + '</button><div class="la-ttl"><b>' + esc(title) + "</b><span>" + esc(sub) + "</span></div>" +
      (view === "chat" ? '<button class="la-ib" data-a="tocall" aria-label="' + esc(T().toVideo) + '">' + ic("video") + '</button><button class="la-ib' + (sound ? " on" : "") + '" data-a="sound" aria-label="' + esc(T().sound) + '" aria-pressed="' + sound + '">' + ic(sound ? "vol" : "mute") + "</button>" : '<span class="la-chip">' + esc(T().plusOnly) + "</span>") + "</div>";
  }
  function drawHome() {
    var t = T(), li = LEVELS.indexOf(level), sets = '<div class="la-set"><div class="la-h">' + esc(t.lvl) + '</div><div class="la-chips">' + LEVELS.map(function (l) { return '<button class="la-lv' + (l === level ? " on" : "") + '" data-a="lvl" data-l="' + l + '">' + l + "</button>"; }).join("") + '</div><div class="la-lvd">' + esc((t.lvDesc || [])[li] || "") + '</div><div class="la-h">' + esc(t.voiceT) + '</div><div class="la-vrow"><select id="laVoice" aria-label="' + esc(t.voiceT) + '">' + VOICES.map(function (v) { return '<option value="' + v + '"' + (v === voice ? " selected" : "") + ">" + v.charAt(0).toUpperCase() + v.slice(1) + "</option>"; }).join("") + '</select><button data-a="preview">▶ ' + esc(t.preview) + "</button></div></div>",
      chip = function (on, a, k, v, label) { return '<button class="la-lv' + (on ? " on" : "") + '" data-a="' + a + '" ' + (k ? 'data-k="' + k + '" ' : "") + 'data-v="' + esc(v) + '">' + esc(label) + "</button>"; },
      profBlock = '<div class="la-set"><div class="la-h">' + esc(t.profT) + '</div><div class="la-lvd" style="margin:0 0 6px">' + esc(t.jobL) + '</div><div class="la-chips">' + (t.jobs || []).map(function (j) { return chip(profile.job === j[0], "prof", "job", j[0], j[1]); }).join("") + '</div><div class="la-lvd" style="margin:8px 0 6px">' + esc(t.goalL) + '</div><div class="la-chips">' + (t.goals || []).map(function (g) { return chip(profile.goal === g[0], "prof", "goal", g[0], g[1]); }).join("") + "</div></div>",
      modes = [["class", t.modeClass], ["qa", t.modeQa], ["ask", t.modeAsk], ["chat", t.modeChat]],
      desc = { "class": t.modeClassD, qa: t.modeQaD, ask: t.modeAskD, chat: t.modeChatD },
      hero = { "class": ["🎓", t.classFree, t.classFreeSub], qa: ["🎯", t.qaFree, t.qaFreeSub], ask: ["🙋", t.askFree, t.askFreeSub], chat: ["💬", t.free, t.freeSub] }[mode],
      h = head(t.title, t.sub, false) + '<div class="la-body"><div class="la-set"><div class="la-chips">' + modes.map(function (m) { return '<button class="la-lv' + (mode === m[0] ? " on" : "") + '" data-a="mode" data-m="' + m[0] + '">' + esc(m[1]) + "</button>"; }).join("") + '</div><div class="la-lvd">' + esc(desc[mode]) + "</div></div>" +
        '<button class="la-card hero" data-a="free"><div class="la-ico">' + hero[0] + '</div><div class="la-grow"><b>' + esc(hero[1]) + "</b><span>" + esc(hero[2]) + "</span></div></button>" +
        '<div class="la-chips" style="margin:-2px 2px 12px"><span class="la-lvd" style="margin:0 6px 0 0;align-self:center">' + esc(t.viewL) + "</span>" + chip(viewPref === "video", "viewpref", "", "video", t.viewVideo) + chip(viewPref === "text", "viewpref", "", "text", t.viewText) + "</div>";
    if (mode === "class" && review.length) h += '<button class="la-card" data-a="review"><div class="la-ico">📒</div><div class="la-grow"><b>' + esc(t.reviewCard) + "</b><span>" + esc(t.reviewSub.replace("{n}", review.length)) + "</span></div></button>";
    if (mode !== "ask") h += '<div class="la-h">' + esc(t.lessons) + '</div><div class="la-note" style="font-size:12.5px;color:var(--mist,#6d6759);margin:-2px 2px 10px">' + esc(t.lessonsSub) + "</div>";
    if (mode !== "ask") units().forEach(function (u, n) { var p = prog[mode === "class" ? "cls_" + u.k : u.k + (mode === "qa" ? "_qa" : "")]; h += '<button class="la-card" data-a="unit" data-n="' + n + '"><div class="la-ico">' + u.ico + '</div><div class="la-grow"><b>' + esc(uTitle(u)) + "</b>" + (p ? "<span>" + esc(t.best) + ': <b class="la-sc" style="display:inline">' + p.best + "</b> · " + p.tries + "×</span>" : "<span>" + esc(t.start) + (mode === "class" ? "" : " · 6 " + esc(mode === "qa" ? t.qaQ : t.turns)) + "</span>") + "</div></button>"; });
    h += profBlock + sets;
    el.querySelector(".la-app").innerHTML = h + "</div>";
  }
  function bubble(m) {
    var t = T();
    if (m.role === "user" && m.vd) {
      var ic0 = m.vd === "correct" ? "✅" : m.vd === "almost" ? "🟡" : "❌";
      return '<div class="la-b me"><div class="la-jp" style="font-size:16px">' + esc(m.text) + '</div></div><div class="la-fb ' + m.vd + '"><b>' + ic0 + " " + esc(t["vd" + m.vd]) + "</b>" + (m.fb ? "<div>" + esc(m.fb) + "</div>" : "") +
        (m.cor ? '<div style="margin-top:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;opacity:.75">' + esc(t.qaAnswer) + '</div><div class="bt">' + esc(m.cor.better) + '<button class="la-ib" data-a="play" data-t="' + esc(m.cor.better) + '" aria-label="' + esc(t.say) + '">' + ic("vol", 16) + "</button></div><div>" + esc(m.cor.why) + "</div>" : "") + "</div>";
    }
    if (m.role === "user") return '<div class="la-b me"><div class="la-jp" style="font-size:16px">' + esc(m.text) + "</div>" + scoreChip(m) + "</div>" + (m.cor ? '<div class="la-cor"><b>' + esc(t.better) + '</b><div class="bt">' + esc(m.cor.better) + "</div>" + esc(m.cor.why) + "</div>" : "");
    return '<div class="la-b">' + (m.explain ? '<div class="la-exp">' + esc(m.explain) + "</div>" : "") + '<div class="la-jp">' + esc(m.text) + '</div><div class="la-rd">' + esc(m.reading) + '</div><div class="la-ro">' + esc(m.romaji || toRomaji(m.reading, true)) + '</div><div class="la-mn">' + esc(m.meaning) + '</div><button class="la-ib" data-a="play" data-t="' + esc(m.text) + '" aria-label="' + esc(t.say) + '" style="margin:4px 0 -6px -8px">' + ic("vol", 18) + "</button></div>" + (mode === "class" ? classBlock(m, m === lastAssistant()) : "");
  }
  function drawList() {
    var l = $("#laList"); if (!l) return; var t = T(), h = msgs.map(bubble).join("");
    if (done) h += '<div class="la-sum"><div class="la-ring" style="--p:' + done.score + '"><i>' + done.score + "</i></div>" + (mode === "qa" ? '<div class="la-qs"><span>✅ ' + qa.correct + "</span><span>🟡 " + qa.almost + "</span><span>❌ " + qa.wrong + "</span></div>" : "") + "<h4>" + esc(t.good) + "</h4><ul>" + done.good.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul><h4>" + esc(t.improve) + "</h4><ul>" + done.improve.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><div class="la-act"><button class="g" data-a="again">' + esc(t.again) + '</button><button data-a="finish">' + esc(t.finish) + "</button></div></div>";
    else if (hint && !sending) h += '<button class="la-hint" data-a="hint" data-t="' + esc(hint.split(" (")[0]) + '">' + esc(t.tryHint) + ": " + esc(hint) + "</button>";
    if (sending) h += '<div class="la-typ">' + esc(t.thinking) + "</div>";
    if (done && mode === "class" && cls.st.weak.length) h += '<div class="la-note" style="font-size:12.5px;color:var(--mist,#6d6759);margin:8px 4px">📒 ' + esc(t.savedReview.replace("{n}", cls.st.weak.length)) + "</div>";
    l.innerHTML = h; l.scrollTop = l.scrollHeight; refreshTopics();
  }
  function qaSub() { return "✅ " + qa.correct + "  ·  🟡 " + qa.almost + "  ·  ❌ " + qa.wrong; }
  function drawChat() {
    var t = T(); el.querySelector(".la-app").innerHTML = head(mode === "class" ? (cls.ctx.title || t.classFree) : unit ? uTitle(unit) : (mode === "qa" ? t.qaFree : mode === "ask" ? t.askFree : t.free), mode === "qa" ? qaSub() : mode === "class" ? classSub() : t.sub, true) + '<div id="lcTpWrap">' + topicsHtml() + '</div><div class="la-list" id="laList"></div><div class="la-comp"' + (done ? ' style="display:none"' : "") + '><button class="la-btn mic" data-a="mic" aria-label="' + esc(t.mic) + '">' + ic("mic", 22) + '</button>' + micLangBtn() + '<textarea id="laTxt" rows="1" maxlength="300" placeholder="' + esc(phText()) + '" enterkeyhint="send" lang="ja"></textarea><button class="la-btn" data-a="send" aria-label="' + esc(t.send) + '">' + ic("send", 22) + "</button></div>";
    drawList();
  }

  /* ---------- alur ---------- */
  function errMsg(e) { var t = T(); if (e && e.code === "limit") return t.errLimit; if (e && e.code === "plus") return t.errPlus; if (e && e.code === "net") return t.errNet; return t.errAi; }
  function ask(retry) { // minta giliran LEA berikutnya
    sending = true; hint = ""; drawList(); if (view === "call") callThinking();
    var payload = msgs.map(function (m) { var o = { role: m.role, text: m.text }; if (mode === "class") { if (m.role === "assistant") { o.explain = m.explain; o.ask = m.ask; o.expect = m.expect; o.target = m.target; } else if (m.meta) o.meta = m.meta; } return o; });
    var body = { mode: mode, lang: aiLang(), level: level, unit: unit ? { title: unit.n[1], phrases: unit.p.map(function (p) { return p[0]; }) } : null, messages: payload };
    if (mode === "class") { body.ctx = { title: cls.ctx.title, kind: cls.ctx.kind, items: cls.ctx.items.map(function (x) { return { jp: x.jp, mean: x.mean }; }) }; body.profile = { job: profile.job || "", goal: profile.goal || "" }; body.state = cls.st; body.review = review.slice(0, 5).map(function (r) { return { jp: r.jp, mean: r.mean }; }); }
    window.KakeiboAuth.api("/api/ai/lea", body).then(function (r) {
      sending = false;
      var last = msgs[msgs.length - 1]; if (last && last.role === "user" && r.correction) last.cor = r.correction;
      if (mode === "qa" && last && last.role === "user" && r.verdict) { last.vd = r.verdict; last.fb = r.feedback || ""; qa[r.verdict]++; var sp = $(".la-ttl span"); if (sp) sp.textContent = qaSub(); }
      msgs.push({ role: "assistant", text: r.reply, reading: r.reading, romaji: r.romaji, meaning: r.meaning, explain: r.explain || "", ask: r.ask || "", expect: r.expect || "", target: r.target || "", targetReading: r.targetReading || "", choices: r.choices || [], praise: r.praise || "", focus: r.focus }); hint = r.hint || ""; if (mode === "class") classMerge(r);
      if (r.final && r.summary) { done = { score: r.summary.score, good: r.summary.good || [], improve: r.summary.improve || [] }; record(done.score); if (el.querySelector(".la-comp")) el.querySelector(".la-comp").style.display = "none"; }
      if (view === "call") { callTurn(); return; }
      drawList(); if (sound) say(r.reply, null, mode === "class" ? "talk" : undefined);
    }).catch(function (e) {
      sending = false; drawList(); if (view === "call") { callErr(e); return; } var l = $("#laList"); if (!l) return;
      l.insertAdjacentHTML("beforeend", '<div class="la-err">' + esc(errMsg(e)) + (e && e.code !== "limit" && e.code !== "plus" ? '<br><button data-a="retry">' + esc(T().retry) + "</button>" : "") + "</div>"); l.scrollTop = l.scrollHeight;
    });
  }
  function record(score) { var k = mode === "class" ? "cls_" + (cls.ctx.key || "_free") : (unit ? unit.k : "_free") + (mode === "qa" ? "_qa" : ""), p = prog[k] || { best: 0, tries: 0 }; p.best = Math.max(p.best, score); p.tries++; p.at = Date.now(); prog[k] = p; saveProg(); }
  function start(u) { prime(); unit = u || null; msgs = []; qa = { correct: 0, almost: 0, wrong: 0 }; done = null; hint = ""; sending = false; view = "chat"; drawChat(); ask(); }
  function sendText(v, meta) {
    if (sending || done) return; v = String(v || "").trim(); if (!v) return;
    stopSay(); prime(); var m = { role: "user", text: v }; if (meta) m.meta = meta; msgs.push(m);
    if (mode === "class") cls.st.turn = msgs.filter(function (x) { return x.role === "user"; }).length;
    ask();
  }
  function send() {
    var ta = $("#laTxt"); if (!ta || sending || done) return; var v = ta.value.trim(); if (!v) return;
    ta.value = ""; ta.style.height = ""; sendText(v);
  }
  /* ---------- mode video: LEA Sensei beranimasi (lip-sync mengikuti audio) ---------- */
  function lastAssistant() { for (var i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === "assistant") return msgs[i]; return null; }
  function loadAvatar(cb) {
    if (window.KakeiboLeaAvatar) return cb();
    var sc = document.createElement("script"); sc.src = "modules/lea-avatar.js?v=1"; sc.onload = function () { cb(); }; sc.onerror = function () { cb(); }; document.head.appendChild(sc);
  }
  function destroyAvatar() { if (call) { try { call.destroy(); } catch (e) {} call = null; } }
  function setFace(n) { if (call) call.setExpression(n); }
  function mountAvatar() {
    var h = $("#lcAv"); destroyAvatar(); if (!h) return;
    if (window.KakeiboLeaAvatar) { call = window.KakeiboLeaAvatar.create(h); call.setExpression("neutral"); }
    else h.innerHTML = '<div class="lc-fb">👩‍🏫<small>' + esc(T().callNoAv) + "</small></div>";
  }
  function drawCall() {
    var t = T(), modes = [["class", t.modeClass], ["qa", t.modeQa], ["ask", t.modeAsk], ["chat", t.modeChat]];
    el.querySelector(".la-app").innerHTML = '<div class="lc-top"><button class="la-ib" data-a="back" aria-label="' + esc(t.back) + '">' + ic("back") + '</button><div class="lc-modes">' +
      modes.map(function (m) { return '<button class="lc-mode' + (mode === m[0] ? " on" : "") + '" data-a="cmode" data-m="' + m[0] + '">' + esc(m[1]) + "</button>"; }).join("") + '</div><button class="la-ib" data-a="totext" aria-label="' + esc(t.toText) + '">💬</button><button class="la-ib' + (sound ? " on" : "") + '" data-a="sound" aria-label="' + esc(t.sound) + '" aria-pressed="' + sound + '">' + ic(sound ? "vol" : "mute") + "</button></div>" +
      '<div class="lc-av" id="lcAv"></div><div id="lcTpWrap">' + topicsHtml() + '</div><div class="lc-sub" id="lcSub"><div class="lc-hint">' + esc(t.callHint) + '</div></div>' +
      '<div class="la-comp"><button class="la-btn mic" data-a="mic" aria-label="' + esc(t.mic) + '">' + ic("mic", 22) + '</button>' + micLangBtn() + '<textarea id="laTxt" rows="1" maxlength="300" placeholder="' + esc(phText()) + '" enterkeyhint="send"></textarea><button class="la-btn" data-a="send" aria-label="' + esc(t.send) + '">' + ic("send", 22) + "</button></div>";
  }
  function enterCall(fresh) {
    prime(); view = "call"; drawCall();
    loadAvatar(function () { if (view !== "call" || !el) return; mountAvatar(); if (fresh) ask(); else callTurn(true); });
  }
  function startCall() { if (mode === "class") cls.st = { turn: 0, covered: [], weak: [] }; unit = null; msgs = []; qa = { correct: 0, almost: 0, wrong: 0 }; done = null; hint = ""; sending = false; enterCall(true); }
  function toChat() { stopSay(); destroyAvatar(); view = "chat"; drawChat(); }
  function moraHl(i) { var rd = $("#lcRd"); if (!rd) return; var ch = rd.children; for (var k = 0; k < ch.length; k++) ch[k].className = "lc-m" + (k < i ? " d" : k === i ? " on" : ""); }
  function speakTurn(m, face) { // face = ekspresi selama bicara; callTok mencegah akhir ucapan lama menimpa ekspresi giliran baru
    if (!m || !m.text) return; var tok = ++callTok;
    say(m.text, { reading: m.reading, audio: function (get) { if (!call || tok !== callTok) return; if (face) setFace(face); call.speak(m.reading || m.text, get, moraHl, function () { moraHl(9999); if (tok === callTok) setFace("listen"); }); } }, mode === "class" ? "talk" : undefined);
  }
  function callSub() {
    var s = $("#lcSub"); if (!s) return; var t = T(), m = lastAssistant(), u = msgs[msgs.length - 2], h = "";
    if (u && u.role === "user") {
      h += '<div class="lc-you">' + esc(u.text) + scoreChip(u) + "</div>";
      if (u.vd) h += '<div class="la-fb ' + u.vd + '" style="align-self:auto;max-width:100%"><b>' + (u.vd === "correct" ? "✅" : u.vd === "almost" ? "🟡" : "❌") + " " + esc(t["vd" + u.vd]) + "</b>" + (u.fb ? "<div>" + esc(u.fb) + "</div>" : "") + (u.cor ? '<div class="bt">' + esc(u.cor.better) + "</div><div>" + esc(u.cor.why) + "</div>" : "") + "</div>";
      else if (u.cor) h += '<div class="la-cor"><b>' + esc(t.better) + '</b><div class="bt">' + esc(u.cor.better) + "</div>" + esc(u.cor.why) + "</div>";
    }
    if (m) {
      if (m.explain) h += '<div class="lc-ex">' + esc(m.explain) + "</div>";
      h += '<div class="lc-jp">' + esc(m.text) + "</div>";
      if (m.reading && window.KakeiboLeaAvatar) h += '<div class="lc-rd" id="lcRd">' + window.KakeiboLeaAvatar.moras(m.reading).map(function (x, i) { return '<span class="lc-m" data-i="' + i + '">' + esc(x.t) + "</span>"; }).join("") + "</div>";
      else if (m.reading) h += '<div class="lc-rd">' + esc(m.reading) + "</div>";
      h += '<div class="lc-ro">' + esc(m.romaji || toRomaji(m.reading, true)) + '</div><div class="lc-mn">' + esc(m.meaning) + '</div><button class="la-ib" data-a="cplay" aria-label="' + esc(t.replay) + '" style="margin:4px 0 0 -8px">' + ic("vol", 20) + "</button>" + (mode === "class" ? classBlock(m, true) : "");
    }
    if (hint && !sending) h += '<button class="la-hint" data-a="hint" data-t="' + esc(hint.split(" (")[0]) + '">' + esc(t.tryHint) + ": " + esc(hint) + "</button>";
    s.innerHTML = h || '<div class="lc-hint">' + esc(t.callHint) + "</div>"; s.scrollTop = 0; refreshTopics();
  }
  function callTurn(silent) {
    if (view !== "call") return;
    var m = lastAssistant(), u = msgs[msgs.length - 2], face = "happy";
    if (mode === "qa" && u && u.role === "user" && u.vd) face = u.vd === "correct" ? "happy" : u.vd === "almost" ? "listen" : "sorry";
    if (mode === "class") face = m && m.praise ? "happy" : u && u.cor ? "listen" : "neutral";
    setFace(silent ? "listen" : face); callSub();
    if (done) { toChat(); return; }
    if (m && !silent && sound) speakTurn(m, face);
  }
  function callThinking() {
    setFace("think"); var s = $("#lcSub"); if (!s) return;
    var old = $("#lcTyp"); if (old) old.remove();
    s.insertAdjacentHTML("beforeend", '<div class="la-typ" id="lcTyp">' + esc(T().thinking) + "</div>"); s.scrollTop = s.scrollHeight;
  }
  function callErr(e) {
    setFace("sorry"); var s = $("#lcSub"); if (!s) return; var old = $("#lcTyp"); if (old) old.remove();
    s.insertAdjacentHTML("beforeend", '<div class="la-err">' + esc(errMsg(e)) + (e && e.code !== "limit" && e.code !== "plus" ? '<br><button data-a="retry">' + esc(T().retry) + "</button>" : "") + "</div>"); s.scrollTop = s.scrollHeight;
  }

  /* ---------- Kelas bareng Sensei: materi, profil, ingatan kelemahan, dan latihan ucapan ---------- */
  var PKEY = "kakeibo-lea-profile", RKEY = "kakeibo-lea-review", VKEY = "kakeibo-lea-view";
  function loadStore() {
    try { profile = JSON.parse(localStorage.getItem(PKEY) || "{}") || {}; } catch (e) { profile = {}; }
    try { review = JSON.parse(localStorage.getItem(RKEY) || "[]"); if (!Array.isArray(review)) review = []; } catch (e) { review = []; }
    try { var v = localStorage.getItem(VKEY); if (v === "video" || v === "text") viewPref = v; } catch (e) {}
  }
  function saveProfile() { try { localStorage.setItem(PKEY, JSON.stringify(profile)); } catch (e) {} }
  function saveReview() { try { localStorage.setItem(RKEY, JSON.stringify(review.slice(0, 40))); } catch (e) {} }
  function mi() { return LI[host.lang] !== undefined ? LI[host.lang] : 1; }
  function ctxFromUnit(u) { var i = mi(); return { kind: "unit", key: u.k, title: uTitle(u), items: u.p.slice(0, 12).map(function (p) { return { jp: p[0], rd: p[1] || "", mean: (p[2] && (p[2][i] || p[2][1])) || "" }; }) }; }
  function ctxFree() { return { kind: "free", key: "_free", title: "", items: [] }; }
  function ctxFromReview() { return { kind: "review", key: "_review", title: T().reviewCard, items: review.slice(0, 10).map(function (r) { return { jp: r.jp, rd: r.rd || "", mean: r.mean || "" }; }) }; }
  function beginSession(c) { // mulai kelas baru (video atau teks sesuai pilihan)
    mode = "class"; cls = { ctx: c || ctxFree(), st: { turn: 0, covered: [], weak: [] } }; unit = null; msgs = []; qa = { correct: 0, almost: 0, wrong: 0 }; done = null; hint = ""; sending = false;
    if (viewPref === "video") enterCall(true); else { prime(); view = "chat"; drawChat(); ask(); }
  }
  function touchReview(it, d) {
    if (!it) return; var k = -1; review.forEach(function (x, n) { if (x.jp === it.jp) k = n; });
    if (d > 0) { if (k < 0) review.unshift({ jp: it.jp, rd: it.rd, mean: it.mean, miss: 1 }); else review[k].miss = (review[k].miss || 1) + 1; }
    else if (k >= 0) { review[k].miss = (review[k].miss || 1) - 1; if (review[k].miss <= 0) review.splice(k, 1); }
  }
  function classMerge(r) { // gabungkan kemajuan dari jawaban Sensei; hanya item yang BARU dihitung agar daftar ulangan tidak berlipat
    var st = cls.st, items = cls.ctx.items, wk = r.weak || [], cv = r.covered || [];
    wk.forEach(function (i) { if (st.weak.indexOf(i) < 0) { st.weak.push(i); touchReview(items[i], 1); } });
    cv.forEach(function (i) { if (st.covered.indexOf(i) < 0) { st.covered.push(i); if (wk.indexOf(i) < 0) touchReview(items[i], -1); } });
    saveReview();
  }
  function classSub() { var n = cls.ctx.items.length; return n ? T().classSub.replace("{a}", cls.st.covered.length).replace("{b}", n) : T().classSubFree.replace("{n}", cls.st.turn); }
  function phText() { var t = T(); return mode === "class" ? t.classPh : mode === "ask" ? t.askPh : mode === "qa" ? t.qaPh : t.ph; }
  var FLAG = { id: "🇮🇩", en: "🇬🇧", my: "🇲🇲", bn: "🇧🇩", vi: "🇻🇳", th: "🇹🇭" };
  function micLangBtn() { return mode === "class" ? '<button class="la-btn mini" data-a="miclang" aria-label="' + esc(micNative ? T().micNative : T().micJa) + '">' + (micNative ? (FLAG[host.lang] || "🌐") : "🇯🇵") + "</button>" : ""; }
  function topicsHtml() {
    if (mode !== "class" || !cls.ctx.items.length) return "";
    var t = T(), st = cls.st;
    return '<div class="lc-tp"><span>' + esc(t.topicsL) + " " + st.covered.length + "/" + cls.ctx.items.length + "</span>" + cls.ctx.items.map(function (it, i) { var c = st.covered.indexOf(i) >= 0, w = st.weak.indexOf(i) >= 0; return '<button class="lc-t' + (c ? " ok" : w ? " wk" : "") + '" data-a="topic" data-i="' + i + '">' + (c ? "✓ " : "") + esc(it.jp) + "</button>"; }).join("") + "</div>";
  }
  function refreshTopics() { var w = $("#lcTpWrap"); if (w) w.innerHTML = topicsHtml(); }
  function classBlock(m, live) {
    var t = T(), h = "";
    if (m.praise) h += '<div class="lc-pr">👏 ' + esc(m.praise) + "</div>";
    if (m.ask) h += '<div class="lc-ask">' + esc(m.ask) + "</div>";
    if (live && !done) {
      if (m.expect === "repeat" && m.target) h += '<button class="lc-rep" data-a="repeat" data-t="' + esc(m.target) + '" data-r="' + esc(m.targetReading || "") + '">🎤 ' + esc(t.sayIt) + ": <b>" + esc(m.target) + "</b>" + (m.targetReading ? "<small>" + esc(m.targetReading) + "</small>" : "") + "</button>";
      if (m.choices && m.choices.length) h += '<div class="lc-ch">' + m.choices.map(function (c) { return '<button class="lc-c" data-a="pickc" data-t="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div>";
    }
    return h ? '<div class="lc-cb">' + h + "</div>" : "";
  }
  function scoreChip(m) { return m.meta && m.meta.target ? '<div class="lc-sc ' + (m.meta.score >= 80 ? "ok" : m.meta.score >= 55 ? "mid" : "lo") + '">🎤 ' + esc(T().scoreL) + ": " + m.meta.score + "%</div>" : ""; }
  // kemiripan ucapan (perkiraan): hiragana/katakana disamakan, tanda baca dibuang, lalu jarak edit
  function hiraN(s) { return String(s || "").replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }).replace(/[\s、。，,.!?！？「」『』・\-ー…~〜]/g, "").toLowerCase(); }
  function simScore(a, b) {
    a = hiraN(a); b = hiraN(b); if (!a || !b) return 0;
    var d = [], i, j; for (i = 0; i <= a.length; i++) { d[i] = [i]; } for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return Math.max(0, Math.round((1 - d[a.length][b.length] / Math.max(a.length, b.length)) * 100));
  }
  function repeatTry(target, tr, btn) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return flash(T().noMic);
    if (rec) { try { rec.stop(); } catch (e) {} return; }
    stopSay(); prime(); rec = new SR(); rec.lang = "ja-JP"; rec.interimResults = false; rec.maxAlternatives = 3; setFace("listen");
    if (btn) btn.classList.add("rec");
    rec.onresult = function (e) {
      var alts = []; for (var k = 0; k < e.results[0].length; k++) alts.push(e.results[0][k].transcript);
      var best = alts[0] || "", sc = -1; alts.forEach(function (x) { var v = Math.max(simScore(x, target), tr ? simScore(x, tr) : 0); if (v > sc) { sc = v; best = x; } });
      sendText(best, { target: target, score: Math.max(0, sc) });
    };
    rec.onerror = function (e) { if (e.error === "not-allowed" || e.error === "service-not-allowed") flash(T().micDenied); };
    rec.onend = function () { rec = null; if (btn) btn.classList.remove("rec"); };
    try { rec.start(); } catch (e) { rec = null; }
  }

  function plusOk() { var A = window.KakeiboAuth; if (A && A.isPlus && A.isPlus()) return true; if (A && A.require) A.require(); return false; }
  function go(home) { if (rec) { try { rec.stop(); } catch (e) {} } stopSay(); if (home || !el) destroyAvatar(); view = home ? "home" : view; if (home) drawHome(); }
  function close() { go(false); destroyAvatar(); if (el) { el.remove(); el = null; } }

  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a;
    if (a === "close") close();
    else if (a === "back") goBack();
    else if (a === "lvl") { if (LEVELS.indexOf(b.dataset.l) >= 0) { level = b.dataset.l; try { localStorage.setItem("kakeibo-lea-level", level); } catch (x) {} drawHome(); } }
    else if (a === "mode") { if (b.dataset.m === "qa" || b.dataset.m === "chat" || b.dataset.m === "ask" || b.dataset.m === "class") { mode = b.dataset.m; try { localStorage.setItem("kakeibo-lea-mode", mode); } catch (x) {} drawHome(); } }
    else if (a === "preview") { if (plusOk()) { prime(); say("こんにちは。一緒に日本語を勉強しましょう。"); } }
    else if (a === "free") { if (plusOk()) { if (mode === "class") beginSession(ctxFree()); else if (viewPref === "video") startCall(); else start(null); } }
    else if (a === "review") { if (plusOk()) beginSession(ctxFromReview()); }
    else if (a === "prof") { profile[b.dataset.k] = profile[b.dataset.k] === b.dataset.v ? "" : b.dataset.v; saveProfile(); drawHome(); }
    else if (a === "viewpref") { viewPref = b.dataset.v === "text" ? "text" : "video"; try { localStorage.setItem(VKEY, viewPref); } catch (x) {} drawHome(); }
    else if (a === "topic") { var it = cls.ctx.items[+b.dataset.i]; if (it && !sending) sendText(T().teachMe.replace("{x}", it.jp)); }
    else if (a === "pickc") sendText(b.dataset.t);
    else if (a === "repeat") repeatTry(b.dataset.t, b.dataset.r, b);
    else if (a === "miclang") { micNative = !micNative; b.textContent = micNative ? (FLAG[host.lang] || "🌐") : "🇯🇵"; b.setAttribute("aria-label", micNative ? T().micNative : T().micJa); }
    else if (a === "unit") { if (plusOk()) { if (mode === "class") beginSession(ctxFromUnit(units()[+b.dataset.n])); else start(units()[+b.dataset.n]); } }
    else if (a === "callcard") { if (plusOk()) startCall(); }
    else if (a === "tocall") { if (plusOk()) enterCall(false); }
    else if (a === "totext") toChat();
    else if (a === "cmode") { if (b.dataset.m === "qa" || b.dataset.m === "chat" || b.dataset.m === "ask" || b.dataset.m === "class") { mode = b.dataset.m; try { localStorage.setItem("kakeibo-lea-mode", mode); } catch (x) {} stopSay(); startCall(); } }
    else if (a === "cplay") { prime(); speakTurn(lastAssistant(), "happy"); }
    else if (a === "send") send();
    else if (a === "mic") listen();
    else if (a === "play") { prime(); say(b.dataset.t); }
    else if (a === "hint") { var ta = $("#laTxt"); if (ta) { ta.value = b.dataset.t; ta.focus(); } }
    else if (a === "retry") { var er = b.closest(".la-err"); if (er) er.remove(); ask(); }
    else if (a === "again") { if (mode === "class") beginSession(cls.ctx); else start(unit); }
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
  function goBack() { stopSay(); go(true); }
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
      mount(); loadStore(); // gerbang Premium+ ada di pemuat modul (index.html) dan di plusOk()
      if (host["class"]) { var cc = host["class"]; host["class"] = null; if (plusOk()) beginSession(cc); else drawHome(); } else if (view === "home") drawHome();
    },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; if (view !== "home") goBack(); else close(); return true; }
  };
})();
