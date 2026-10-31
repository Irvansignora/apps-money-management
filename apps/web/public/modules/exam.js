/* Persiapan JFT-Basic & SSW + sumber belajar. Teks UI: Indonesia (id) dan Inggris (en); bahasa lain memakai Inggris. */
(function () {
  "use strict";
  var D = null, host = { lang: "id", esc: null }, el = null, view = "home", track = "jft", tab = "info", setIdx = -1, hide = false, cat = "all", quiz = null, showScript = false;
  var BEST_KEY = "kakeibo-exam-best";

  var UI = {
    id: { title: "Persiapan JFT & SSW", sub: "Materi gratis, 2 bahasa", jft: "JFT-Basic", jftSub: "Tes bahasa Jepang dasar (A2): kosakata, ungkapan, dan latihan soal", ssw: "SSW (Tokutei Ginou)", sswSub: "Istilah per sektor kerja dan latihan pengetahuan dasar", res: "Sumber belajar", resSub: "Daftar situs dan aplikasi belajar bahasa Jepang pilihan", info: "Info", vocab: "Kosakata", phr: "Ungkapan", practice: "Latihan", words: "kata", items: "ungkapan", qs: "soal", back: "Kembali", hideMean: "Sembunyikan arti", showMean: "Tampilkan arti", play: "Putar suara", all: "Semua", start: "Mulai", again: "Ulangi", done: "Selesai", next: "Lanjut", finish: "Lihat hasil", correct: "Benar!", wrong: "Kurang tepat.", pickSec: "Pilih bagian latihan", best: "Skor terbaik", listenBtn: "🔊 Putar audio", scriptBtn: "Lihat teks", noAudio: "Suara tidak tersedia di perangkat ini. Lihat teks.", official: "Situs resmi", paid: "Berbayar/freemium", source: "Daftar tautan diadaptasi dari awesome-japanese (CC0).", note: "Materi ini dibuat sendiri untuk Kakeibo sebagai latihan, bukan soal ujian resmi. Cek situs resmi untuk aturan terbaru.", score: "Skor kamu", great: "Hebat! Pertahankan.", okay: "Bagus. Ulangi bagian yang masih salah.", low: "Ayo belajar lagi dulu, lalu coba ulang.", qOf: "Soal", sensei: "🎓 Belajar bareng Sensei (tanya jawab)", nb: "Buku soal salah", nbCount: "soal", nbEmpty: "Belum ada soal salah. Kerjakan latihan dulu, soal yang salah masuk ke sini otomatis.", nbHint: "Jawab benar 2 kali berturut-turut untuk mengeluarkan soal dari buku ini.", nbTrain: "Latih ulang", nbClear: "Kosongkan", nbClearAsk: "Hapus semua soal di buku ini?", nbAns: "Jawaban benar", nbWrong: "Salah", nbRemove: "Hapus", nbOpen: "Lihat buku soal salah", sec: { wrong: "📕 Buku soal salah", all: "Semua bagian", vocab: "文字と語彙 · Huruf & kosakata", conv: "会話と表現 · Percakapan", listen: "聴解 · Mendengar", read: "読解 · Membaca", kaigo: "介護 · Perawatan", food: "食品 · Makanan & restoran", hotel: "宿泊 · Hotel", cleaning: "清掃 · Kebersihan", agri: "農業 · Pertanian", construction: "建設 · Konstruksi", mfg: "製造 · Manufaktur", safety: "安全 · Keselamatan" } },
    en: { title: "JFT & SSW Prep", sub: "Free material, 2 languages", jft: "JFT-Basic", jftSub: "Basic Japanese test (A2): vocabulary, expressions and practice questions", ssw: "SSW (Tokutei Ginou)", sswSub: "Terms by work sector and basic knowledge practice", res: "Study resources", resSub: "A curated list of sites and apps for learning Japanese", info: "Info", vocab: "Vocabulary", phr: "Expressions", practice: "Practice", words: "words", items: "expressions", qs: "questions", back: "Back", hideMean: "Hide meanings", showMean: "Show meanings", play: "Play audio", all: "All", start: "Start", again: "Try again", done: "Done", next: "Next", finish: "See result", correct: "Correct!", wrong: "Not quite.", pickSec: "Choose a practice section", best: "Best score", listenBtn: "🔊 Play audio", scriptBtn: "Show text", noAudio: "Audio isn't available on this device. Show the text.", official: "Official sites", paid: "Paid/freemium", source: "Link list adapted from awesome-japanese (CC0).", note: "This material was written for Kakeibo as practice; it is not official exam content. Check the official sites for the latest rules.", score: "Your score", great: "Great job! Keep it up.", okay: "Good. Review the ones you missed.", low: "Study a bit more, then try again.", qOf: "Question", sensei: "🎓 Learn with Sensei (Q&A)", nb: "Wrong-answer notebook", nbCount: "questions", nbEmpty: "No wrong answers yet. Do some practice first; missed questions are added here automatically.", nbHint: "Answer correctly twice in a row to remove a question from this notebook.", nbTrain: "Practise again", nbClear: "Clear all", nbClearAsk: "Delete all questions in this notebook?", nbAns: "Correct answer", nbWrong: "Wrong", nbRemove: "Remove", nbOpen: "View wrong-answer notebook", sec: { wrong: "📕 Wrong-answer notebook", all: "All sections", vocab: "文字と語彙 · Script & vocabulary", conv: "会話と表現 · Conversation", listen: "聴解 · Listening", read: "読解 · Reading", kaigo: "介護 · Nursing care", food: "食品 · Food & restaurants", hotel: "宿泊 · Hotel", cleaning: "清掃 · Cleaning", agri: "農業 · Agriculture", construction: "建設 · Construction", mfg: "製造 · Manufacturing", safety: "安全 · Safety" } }
  };
  function isId() { return host.lang === "id"; }
  function T() { return isId() ? UI.id : UI.en; }
  function L(o) { return o ? (isId() ? o.id : o.en) || o.en || o.id || "" : ""; }
  function E(s) { return host.esc ? host.esc(s) : String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function mean(w) { return isId() ? w[2] : w[3]; }
  function best() { try { return JSON.parse(localStorage.getItem(BEST_KEY) || "{}"); } catch (e) { return {}; } }
  function saveBest(k, v) { try { var b = best(); if (!(b[k] >= v)) { b[k] = v; localStorage.setItem(BEST_KEY, JSON.stringify(b)); } } catch (e) {} }
  var WKEY = "kakeibo-exam-wrong";
  function loadW() { try { return JSON.parse(localStorage.getItem(WKEY) || "{}") || {}; } catch (e) { return {}; } }
  function saveW(w) { try { localStorage.setItem(WKEY, JSON.stringify(w)); } catch (e) {} }
  function hash(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function stable(x) { return typeof x === "string" ? x : (x && (x.en || x.id)) || ""; }
  function qid(q) { return track + ":" + hash(stable(q.q) + "|" + stable(q.o[q.a])); }
  function recordAnswer(q, ok) { // salah -> masuk buku; benar 2x berturut-turut -> keluar
    var W = loadW(), k = qid(q), r = W[k];
    if (ok) { if (r) { r.ok = (r.ok || 0) + 1; if (r.ok >= 2) delete W[k]; } }
    else W[k] = { w: (r ? r.w : 0) + 1, ok: 0, ts: Date.now() };
    saveW(W);
  }
  function wrongPool() { var W = loadW(); return trk().questions.filter(function (q) { return W[qid(q)]; }).sort(function (a, b) { var x = W[qid(a)], y = W[qid(b)]; return (y.w - x.w) || (y.ts - x.ts); }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  var IC = { back: '<path d="M15 5 8 12l7 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', vol: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>', link: '<path d="M7 17 17 7M9 7h8v8"/>' };
  function ic(n, s) { s = s || 20; return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>"; }

  function css() {
    if (document.getElementById("exCss")) return;
    var s = document.createElement("style"); s.id = "exCss";
    s.textContent = [
      ".ex-root{position:fixed;inset:0;z-index:67;display:flex;justify-content:center;background:rgba(23,35,61,.55);font-family:Inter,sans-serif;animation:fadeIn .2s both}",
      ".ex-app{width:100%;max-width:480px;height:100dvh;display:flex;flex-direction:column;background:var(--washi,#ece3ce);color:var(--sumi,#2a251d)}",
      ".ex-head{display:flex;align-items:center;gap:6px;padding:calc(env(safe-area-inset-top,0px) + 8px) 10px 8px 6px;background:rgba(251,247,234,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line,rgba(122,110,80,.24))}",
      ".ex-ib{width:42px;height:42px;border:0;border-radius:50%;background:none;color:inherit;display:grid;place-items:center;cursor:pointer;flex:0 0 42px}.ex-ib:active{background:rgba(23,35,61,.08)}",
      ".ex-ttl{flex:1;min-width:0}.ex-ttl b{display:block;font:800 17px 'Shippori Mincho',serif}.ex-ttl span{display:block;font-size:12px;color:var(--mist,#6d6759);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".ex-body{flex:1;min-height:0;overflow-y:auto;padding:16px 16px 28px;-webkit-overflow-scrolling:touch}",
      ".ex-card{display:flex;align-items:center;gap:13px;width:100%;text-align:left;background:var(--card,#fbf7ea);border:0;border-bottom:1px solid var(--line,rgba(122,110,80,.24));border-radius:0;padding:14px 4px;font:inherit;color:inherit;cursor:pointer;min-height:70px}.ex-card:active{background:rgba(23,35,61,.05)}",
      ".ex-ico{flex:0 0 46px;height:46px;border-radius:15px;background:var(--ai,#17233d);display:grid;place-items:center;color:#fff;font-size:22px}.ex-ico.h{background:linear-gradient(150deg,var(--hanko-2,#c9432f),var(--hanko,#ac3527))}",
      ".ex-grow{flex:1;min-width:0}.ex-grow b{display:block;font:700 15.5px Inter,sans-serif}.ex-grow span{display:block;font-size:12.5px;color:var(--mist,#6d6759);margin-top:3px;line-height:1.4}",
      ".ex-tabs{display:flex;gap:6px;margin:0 0 14px}.ex-tab{flex:1;border:0;border-radius:12px;padding:10px 4px;background:rgba(23,35,61,.07);color:inherit;font:700 12.5px Inter,sans-serif;cursor:pointer}.ex-tab.on{background:var(--ai,#17233d);color:#fff}",
      ".ex-h{font:700 12px Inter,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--mist,#6d6759);margin:18px 2px 8px}",
      ".ex-blk{background:var(--card,#fbf7ea);border-radius:18px;padding:14px 16px;margin-bottom:12px}.ex-blk h4{margin:0 0 8px;font:800 15px 'Shippori Mincho',serif}.ex-blk p{margin:0 0 8px;font-size:13.5px;line-height:1.55}.ex-blk p:last-child{margin-bottom:0}",
      ".ex-note{font-size:12px;color:var(--mist,#6d6759);line-height:1.5;margin:14px 2px}",
      ".ex-w{display:flex;align-items:center;gap:10px;padding:11px 2px;border-bottom:1px solid var(--line,rgba(122,110,80,.24))}.ex-w .m{flex:1;min-width:0}.ex-w .jp{font:700 19px/1.35 'Shippori Mincho',serif}.ex-w .rd{font-size:12.5px;color:var(--hanko,#ac3527);margin-top:1px}.ex-w .mn{font-size:13.5px;margin-top:3px;line-height:1.4}.ex-w .mn.hid{filter:blur(6px);cursor:pointer}",
      ".ex-act{display:flex;gap:8px;margin:0 0 6px}.ex-btn{flex:1;border:0;border-radius:13px;padding:12px;background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff;font:700 14px Inter,sans-serif;cursor:pointer}.ex-btn.g{background:rgba(23,35,61,.08);color:inherit}",
      ".ex-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin:0 -2px 8px;scrollbar-width:none}.ex-chips::-webkit-scrollbar{display:none}.ex-chip{flex:0 0 auto;border:0;border-radius:99px;padding:8px 13px;background:rgba(23,35,61,.07);color:inherit;font:700 12.5px Inter,sans-serif;cursor:pointer}.ex-chip.on{background:var(--ai,#17233d);color:#fff}",
      ".ex-sec{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;border:0;border-bottom:1px solid var(--line,rgba(122,110,80,.24));background:none;padding:14px 4px;font:600 14.5px Inter,sans-serif;color:inherit;text-align:left;cursor:pointer}.ex-sec small{font:600 11.5px Inter,sans-serif;color:var(--mist,#6d6759);white-space:nowrap}",
      ".ex-q{font:700 16.5px/1.6 Inter,sans-serif;margin:6px 2px 14px;white-space:pre-line}.ex-qn{font:700 12px Inter,sans-serif;color:var(--hanko,#ac3527);margin:2px 2px 0}",
      ".ex-opt{display:block;width:100%;text-align:left;border:1.5px solid var(--line,rgba(122,110,80,.3));background:var(--card,#fbf7ea);color:inherit;border-radius:14px;padding:12px 14px;margin-bottom:9px;font:600 15px/1.4 Inter,sans-serif;cursor:pointer}.ex-opt.ok{border-color:#3c9b5f;background:#eaf6ee}.ex-opt.no{border-color:#c9432f;background:#fdeceb}.ex-opt:disabled{cursor:default}",
      ".ex-ex{border-radius:14px;padding:11px 13px;font-size:13.5px;line-height:1.5;margin:6px 0 10px}.ex-ex.ok{background:#eaf6ee;border:1px solid #9fd2b0}.ex-ex.no{background:#fdeceb;border:1px solid #e8aaa4}.ex-ex b{display:block;margin-bottom:3px}",
      ".ex-say{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:99px;padding:10px 16px;background:var(--ai,#17233d);color:#fff;font:700 13.5px Inter,sans-serif;cursor:pointer;margin:0 8px 10px 0}.ex-say.g{background:rgba(23,35,61,.08);color:inherit}.ex-scr{background:var(--card,#fbf7ea);border-radius:14px;padding:11px 13px;font:600 16px/1.6 'Shippori Mincho',serif;margin-bottom:12px}",
      ".ex-ring{width:104px;height:104px;border-radius:50%;margin:10px auto 14px;display:grid;place-items:center;font:800 28px 'Shippori Mincho',serif;background:conic-gradient(var(--hanko,#ac3527) calc(var(--p)*1%),rgba(23,35,61,.1) 0)}.ex-ring i{width:82px;height:82px;border-radius:50%;background:var(--washi,#ece3ce);display:grid;place-items:center;font-style:normal}",
      ".ex-nb{background:var(--card,#fbf7ea);border-radius:16px;padding:12px 14px;margin-bottom:12px}.ex-nbh{display:flex;align-items:center;justify-content:space-between;margin:-4px -8px 4px 0}.ex-nb .ex-scr{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:14.5px}",
      ".ex-link{display:block;text-decoration:none;color:inherit;padding:13px 2px;border-bottom:1px solid var(--line,rgba(122,110,80,.24))}.ex-link b{display:flex;align-items:center;gap:6px;font:700 14.5px Inter,sans-serif}.ex-link span{display:block;font-size:12.8px;color:var(--mist,#6d6759);margin-top:3px;line-height:1.45}.ex-tag{font:700 10px Inter,sans-serif;background:rgba(217,130,47,.18);color:#8a5a0c;border-radius:99px;padding:2px 7px}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---- render ---- */
  function head(title, sub, showBack) { return '<div class="ex-head"><button class="ex-ib" data-a="' + (showBack ? "back" : "close") + '" aria-label="' + E(T().back) + '">' + ic(showBack ? "back" : "x") + '</button><div class="ex-ttl"><b>' + E(title) + "</b>" + (sub ? "<span>" + E(sub) + "</span>" : "") + "</div></div>"; }
  function setHtml(h, body) { el.querySelector(".ex-app").innerHTML = h + '<div class="ex-body" id="exBody">' + body + "</div>"; }
  function trk() { return D[track]; }
  function trkName() { return track === "jft" ? T().jft : T().ssw; }
  function wordRow(w, hideM) { return '<div class="ex-w"><div class="m"><div class="jp">' + E(w[0]) + '</div><div class="rd">' + E(w[1]) + '</div><div class="mn' + (hideM ? " hid" : "") + '" data-a="reveal">' + E(mean(w)) + '</div></div><button class="ex-ib" data-a="say" data-t="' + E(/[A-Za-z]/.test(w[0]) ? w[1] : w[0]) + '" aria-label="' + E(T().play) + '">' + ic("vol") + "</button></div>"; }

  function draw() {
    var t = T();
    if (view === "home") {
      var nQ = D.jft.questions.length + D.ssw.questions.length;
      setHtml(head(t.title, t.sub, false),
        '<button class="ex-card" data-a="track" data-t="jft"><div class="ex-ico h">🎌</div><div class="ex-grow"><b>' + t.jft + "</b><span>" + t.jftSub + "</span></div></button>" +
        '<button class="ex-card" data-a="track" data-t="ssw"><div class="ex-ico">🛠️</div><div class="ex-grow"><b>' + t.ssw + "</b><span>" + t.sswSub + "</span></div></button>" +
        '<button class="ex-card" data-a="links"><div class="ex-ico">📚</div><div class="ex-grow"><b>' + t.res + "</b><span>" + t.resSub + " · " + D.resources.length + "</span></div></button>" +
        '<div class="ex-note">' + t.note + "</div>");
    } else if (view === "track") drawTrack();
    else if (view === "set") drawSet();
    else if (view === "quiz") drawQuiz();
    else if (view === "result") drawResult();
    else if (view === "notebook") drawNotebook();
    else if (view === "links") drawLinks();
  }

  function drawTrack() {
    var t = T(), d = trk(), tabs = [["info", t.info], ["vocab", t.vocab]];
    if (track === "jft") tabs.push(["phr", t.phr]);
    tabs.push(["practice", t.practice]);
    var h = '<div class="ex-tabs">' + tabs.map(function (x) { return '<button class="ex-tab' + (tab === x[0] ? " on" : "") + '" data-a="tab" data-t="' + x[0] + '">' + E(x[1]) + "</button>"; }).join("") + "</div>", b = best();
    if (tab === "info") {
      h += d.info.map(function (blk) { return '<div class="ex-blk"><h4>' + E(L(blk.h)) + "</h4>" + blk.p.map(function (p) { return "<p>" + E(L(p)) + "</p>"; }).join("") + "</div>"; }).join("");
      h += '<div class="ex-h">' + t.official + "</div>" + d.links.map(function (l) { return '<a class="ex-link" href="' + E(l[1]) + '" target="_blank" rel="noopener noreferrer"><b>' + E(l[0]) + " " + ic("link", 14) + "</b><span>" + E(L(l[2])) + "</span></a>"; }).join("") + '<div class="ex-note">' + t.note + "</div>";
    } else if (tab === "vocab") {
      h += d.vocab.map(function (s, i) { return '<button class="ex-card" data-a="set" data-i="' + i + '"><div class="ex-ico">' + s.e + '</div><div class="ex-grow"><b>' + E(L(s.t)) + "</b><span>" + s.w.length + " " + t.words + "</span></div></button>"; }).join("");
    } else if (tab === "phr") {
      h += '<div class="ex-act"><button class="ex-btn" data-a="sensei">' + t.sensei + '</button></div><div class="ex-act"><button class="ex-btn g" data-a="hide">' + (hide ? t.showMean : t.hideMean) + "</button></div>" + d.phrases.map(function (g) { return '<div class="ex-h">' + E(L(g.t)) + "</div>" + g.p.map(function (w) { return wordRow(w, hide); }).join(""); }).join("");
    } else {
      h += '<button class="ex-sec" data-a="notebook"><span>📕 ' + E(t.nb) + "</span><small>" + wrongPool().length + " " + t.nbCount + "</small></button>";
      h += '<div class="ex-h">' + t.pickSec + "</div>" + secList().map(function (s) { var k = track + ":" + s, v = b[k]; return '<button class="ex-sec" data-a="quiz" data-s="' + s + '"><span>' + E(t.sec[s] || s) + "</span><small>" + (v != null ? t.best + " " + v + " · " : "") + qCount(s) + " " + t.qs + "</small></button>"; }).join("");
    }
    setHtml(head(trkName(), t.title, true), h);
  }
  function drawSet() {
    var t = T(), s = trk().vocab[setIdx];
    setHtml(head(L(s.t), s.w.length + " " + t.words, true), '<div class="ex-act"><button class="ex-btn" data-a="sensei">' + t.sensei + '</button></div><div class="ex-act"><button class="ex-btn g" data-a="hide">' + (hide ? t.showMean : t.hideMean) + "</button></div>" + s.w.map(function (w) { return wordRow(w, hide); }).join(""));
  }
  function secList() { var seen = {}, out = ["all"]; trk().questions.forEach(function (q) { if (!seen[q.sec]) { seen[q.sec] = 1; out.push(q.sec); } }); return out; }
  function qCount(s) { return s === "all" ? Math.min(10, trk().questions.length) : trk().questions.filter(function (q) { return q.sec === s; }).length; }

  function startQuiz(sec) {
    var pool = sec === "wrong" ? wrongPool() : trk().questions.filter(function (q) { return sec === "all" || q.sec === sec; });
    if (!pool.length) { view = "notebook"; draw(); return; }
    quiz = { sec: sec, list: shuffle(pool).slice(0, 10), i: 0, score: 0, picked: -1, order: null };
    showScript = false; view = "quiz"; draw();
  }
  function optText(o) { return typeof o === "string" ? o : L(o); }
  function drawQuiz() {
    var t = T(), q = quiz.list[quiz.i], h = '<div class="ex-qn">' + t.qOf + " " + (quiz.i + 1) + " / " + quiz.list.length + "</div>";
    if (!quiz.order || quiz.order.q !== quiz.i) quiz.order = { q: quiz.i, idx: shuffle([0, 1, 2, 3]) };
    var qt = typeof q.q === "string" ? q.q : L(q.q);
    if (q.sec === "listen") {
      h += '<div class="ex-q">' + E(qt) + "</div>";
      h += '<button class="ex-say" data-a="play">' + t.listenBtn + '</button><button class="ex-say g" data-a="script">' + t.scriptBtn + "</button>" + (showScript ? '<div class="ex-scr">' + E(q.say) + "</div>" : "");
    } else h += '<div class="ex-q">' + E(qt) + "</div>";
    var done = quiz.picked >= 0;
    h += quiz.order.idx.map(function (oi) {
      var cls = done ? (oi === q.a ? " ok" : oi === quiz.picked ? " no" : "") : "";
      return '<button class="ex-opt' + cls + '" data-a="pick" data-i="' + oi + '"' + (done ? " disabled" : "") + ">" + E(optText(q.o[oi])) + "</button>";
    }).join("");
    if (done) {
      var ok = quiz.picked === q.a;
      h += '<div class="ex-ex ' + (ok ? "ok" : "no") + '"><b>' + (ok ? "✅ " + t.correct : "❌ " + t.wrong) + "</b>" + E(L(q.e)) + "</div>" + '<div class="ex-act"><button class="ex-btn" data-a="next">' + (quiz.i + 1 >= quiz.list.length ? t.finish : t.next) + "</button></div>";
    }
    setHtml(head(trkName(), (t.sec[quiz.sec] || quiz.sec), true), h);
  }
  function drawResult() {
    var t = T(), n = quiz.list.length, pct = Math.round(quiz.score / n * 100);
    setHtml(head(trkName(), t.sec[quiz.sec] || quiz.sec, true), '<div class="ex-ring" style="--p:' + pct + '"><i>' + quiz.score + "/" + n + "</i></div>" +
      '<div style="text-align:center;font:700 15px Inter,sans-serif;margin-bottom:16px">' + (pct >= 80 ? t.great : pct >= 50 ? t.okay : t.low) + "</div>" +
      '<div class="ex-act"><button class="ex-btn g" data-a="back">' + t.done + '</button><button class="ex-btn" data-a="again">' + t.again + "</button></div>" +
      (wrongPool().length ? '<div class="ex-act"><button class="ex-btn g" data-a="notebook">📕 ' + E(t.nbOpen) + "</button></div>" : ""));
  }
  function drawNotebook() {
    var t = T(), list = wrongPool(), W = loadW(), h = "";
    if (!list.length) h = '<div class="ex-note">' + t.nbEmpty + "</div>";
    else {
      h = '<div class="ex-act"><button class="ex-btn" data-a="quiz" data-s="wrong">' + t.nbTrain + '</button><button class="ex-btn g" data-a="wclear">' + t.nbClear + '</button></div><div class="ex-note">' + t.nbHint + "</div>";
      h += list.map(function (q) {
        var r = W[qid(q)], qt = typeof q.q === "string" ? q.q : L(q.q);
        return '<div class="ex-nb"><div class="ex-nbh"><span class="ex-tag">' + t.nbWrong + " " + r.w + 'x</span><button class="ex-ib" data-a="wdel" data-id="' + E(qid(q)) + '" aria-label="' + E(t.nbRemove) + '">' + ic("x", 16) + "</button></div>" +
          (q.say ? '<div class="ex-scr"><span>' + E(q.say) + '</span><button class="ex-ib" data-a="say" data-t="' + E(q.say) + '" aria-label="' + E(t.play) + '">' + ic("vol") + "</button></div>" : "") +
          '<div class="ex-q" style="font-size:15px;margin:4px 0 8px">' + E(qt) + '</div><div class="ex-ex ok"><b>' + t.nbAns + "</b>" + E(optText(q.o[q.a])) + '<br><span style="opacity:.85">' + E(L(q.e)) + "</span></div></div>";
      }).join("");
    }
    setHtml(head(t.nb, trkName(), true), h);
  }
  function drawLinks() {
    var t = T(), cats = D.resCats, h = '<div class="ex-chips"><button class="ex-chip' + (cat === "all" ? " on" : "") + '" data-a="cat" data-c="all">' + t.all + "</button>" + cats.map(function (c) { return '<button class="ex-chip' + (cat === c[0] ? " on" : "") + '" data-a="cat" data-c="' + c[0] + '">' + E(L(c[1])) + "</button>"; }).join("") + "</div>";
    h += D.resources.filter(function (r) { return cat === "all" || r[0] === cat; }).map(function (r) {
      return '<a class="ex-link" href="' + E(r[2]) + '" target="_blank" rel="noopener noreferrer"><b>' + E(r[1]) + " " + ic("link", 14) + (r[3].paid ? ' <span class="ex-tag">' + t.paid + "</span>" : "") + "</b><span>" + E(L(r[3])) + "</span></a>";
    }).join("") + '<div class="ex-note">' + t.source + ' <a href="https://github.com/yudataguy/awesome-japanese" target="_blank" rel="noopener noreferrer" style="color:var(--hanko,#ac3527)">github.com/yudataguy/awesome-japanese</a></div>';
    setHtml(head(t.res, D.resources.length + "", true), h);
  }

  /* ---- suara (TTS bawaan perangkat) ---- */
  function speak(txt, cb) {
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return cb && cb(false);
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(txt).replace(/〜/g, "")); u.lang = "ja-JP"; u.rate = .85;
      var v = (window.speechSynthesis.getVoices() || []).filter(function (x) { return /^ja/i.test(x.lang); })[0]; if (v) u.voice = v;
      window.speechSynthesis.speak(u); if (cb) cb(true);
    } catch (e) { if (cb) cb(false); }
  }

  /* ---- aksi ---- */
  function goBack() {
    if (view === "notebook") { view = "track"; tab = "practice"; }
    else if (view === "result" || view === "quiz") { try { window.speechSynthesis.cancel(); } catch (e) {} view = "track"; tab = "practice"; }
    else if (view === "set") view = "track";
    else if (view === "track" || view === "links") view = "home";
    else return close();
    draw();
    var b = document.getElementById("exBody"); if (b) b.scrollTop = 0;
  }
  // Membuka kelas LEA Sensei dengan materi yang sedang dibuka (set kosakata atau daftar ungkapan)
  function askSensei() {
    var items, title, key;
    if (view === "set") { var s = trk().vocab[setIdx]; title = L(s.t); key = "exam_" + track + "_" + s.k; items = s.w; }
    else { items = []; trk().phrases.forEach(function (g) { g.p.forEach(function (w) { items.push(w); }); }); title = T().phr; key = "exam_" + track + "_phr"; }
    var c = { kind: "vocab", key: key, title: title + " · " + trkName(), items: items.slice(0, 12).map(function (w) { return { jp: w[0], rd: w[1], mean: mean(w) }; }) };
    if (window.kakeiboSensei) window.kakeiboSensei(c);
  }
  function close() { try { window.speechSynthesis.cancel(); } catch (e) {} if (el) { el.remove(); el = null; } }
  function onClick(e) {
    var b = e.target.closest && e.target.closest("[data-a]"); if (!b || !el.contains(b)) return;
    var a = b.dataset.a, d = b.dataset;
    if (a === "close") close(); else if (a === "back") goBack();
    else if (a === "track") { track = d.t; tab = "info"; view = "track"; draw(); }
    else if (a === "links") { cat = "all"; view = "links"; draw(); }
    else if (a === "tab") { tab = d.t; hide = false; draw(); }
    else if (a === "set") { setIdx = +d.i; hide = false; view = "set"; draw(); }
    else if (a === "hide") { hide = !hide; draw(); }
    else if (a === "sensei") askSensei();
    else if (a === "reveal") { if (b.classList.contains("hid")) b.classList.remove("hid"); }
    else if (a === "say") speak(d.t);
    else if (a === "cat") { cat = d.c; draw(); }
    else if (a === "quiz") startQuiz(d.s);
    else if (a === "notebook") { view = "notebook"; draw(); var nb = document.getElementById("exBody"); if (nb) nb.scrollTop = 0; }
    else if (a === "wdel") { var W1 = loadW(); delete W1[d.id]; saveW(W1); draw(); }
    else if (a === "wclear") { if (window.confirm(T().nbClearAsk)) { var W2 = loadW(); Object.keys(W2).forEach(function (k) { if (k.indexOf(track + ":") === 0) delete W2[k]; }); saveW(W2); draw(); } }
    else if (a === "again") startQuiz(quiz.sec);
    else if (a === "play") { var q = quiz.list[quiz.i]; speak(q.say, function (ok) { if (!ok) { showScript = true; drawQuiz(); } }); }
    else if (a === "script") { showScript = !showScript; drawQuiz(); }
    else if (a === "pick") { if (quiz.picked >= 0) return; var qq = quiz.list[quiz.i]; quiz.picked = +d.i; var okk = quiz.picked === qq.a; if (okk) quiz.score++; recordAnswer(qq, okk); drawQuiz(); }
    else if (a === "next") { if (quiz.i + 1 >= quiz.list.length) { if (quiz.sec !== "wrong") saveBest(track + ":" + quiz.sec, quiz.score); view = "result"; } else { quiz.i++; quiz.picked = -1; showScript = false; try { window.speechSynthesis.cancel(); } catch (x) {} } draw(); var bd = document.getElementById("exBody"); if (bd) bd.scrollTop = 0; }
  }

  window.KakeiboExam = {
    open: function (ctx) {
      D = window.EXAM_DATA; if (!D) return;
      host = { lang: (ctx && ctx.lang) || "id", esc: (ctx && ctx.esc) || null };
      css(); if (el) el.remove();
      el = document.createElement("div"); el.className = "ex-root"; el.innerHTML = '<div class="ex-app"></div>';
      el.addEventListener("click", onClick); document.body.appendChild(el);
      view = "home"; track = "jft"; tab = "info"; quiz = null; hide = false; draw();
    },
    isOpen: function () { return !!el; },
    back: function () { if (!el) return false; goBack(); return true; }
  };
})();
