/* Kakeibo · modul Belajar Jepang (lazy-load, mandiri).
 * Dipanggil host: window.KakeiboBelajar.open({ lang, esc }). Tidak ikut siklus render() index.html. */
(function () {
  "use strict";
  var KEY = "jp-finance-belajar", st = { done: {} }, host, el, view = "list", ui = 0, qz = null;
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  var LI = { id: 0, en: 1, vi: 2 };
  var UI = {
    id: { title: "Belajar Jepang", ph: "frasa", done: "Hafal", quiz: "Kuis", back: "Kembali", next: "Lanjut", score: "Skor", again: "Ulangi", pick: "Pilih arti yang benar", tip: "Ganti 〇〇 dengan namamu dan negaramu.", nov: "Suara Jepang belum terpasang di HP-mu. Unduh dulu di Pengaturan, bagian Text-to-speech." },
    en: { title: "Learn Japanese", ph: "phrases", done: "Learned", quiz: "Quiz", back: "Back", next: "Next", score: "Score", again: "Try again", pick: "Pick the correct meaning", tip: "Replace 〇〇 with your name and country.", nov: "No Japanese voice is installed on your phone. Download one in Settings under Text-to-speech." },
    vi: { title: "Học tiếng Nhật", ph: "câu", done: "Đã thuộc", quiz: "Câu đố", back: "Quay lại", next: "Tiếp", score: "Điểm", again: "Làm lại", pick: "Chọn nghĩa đúng", tip: "Thay 〇〇 bằng tên và quốc gia của bạn.", nov: "Điện thoại chưa có giọng đọc tiếng Nhật. Hãy tải trong Cài đặt, mục Text-to-speech." }
  };
  var T = function () { return UI[host.lang] || UI.en; };
  var idx = function () { return LI[host.lang] !== undefined ? LI[host.lang] : 1; };
  var units = function () { return window.BELAJAR_DATA.units; };
  var pid = function (u, i) { return u.k + i; };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };

  function say(txt) {
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(txt.replace(/〇+/g, ""));
      u.lang = "ja-JP"; u.rate = 0.85;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0];
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function noJaVoice() { try { var vs = speechSynthesis.getVoices(); return vs.length > 0 && !vs.some(function (v) { return /^ja/i.test(v.lang); }); } catch (e) { return false; } }

  function css() {
    if (document.getElementById("belajarCss")) return;
    var s = document.createElement("style"); s.id = "belajarCss";
    s.textContent = ".bl-card{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:8px;font:inherit;color:inherit;cursor:pointer}" +
      ".bl-ico{flex:0 0 44px;height:44px;border-radius:12px;background:var(--ai);display:grid;place-items:center;font-size:22px}.bl-grow{flex:1;min-width:0}" +
      ".bl-bar{height:5px;border-radius:3px;background:var(--line);margin-top:7px;overflow:hidden}.bl-bar i{display:block;height:100%;background:var(--hanko)}" +
      ".bl-row{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:8px}" +
      ".bl-jp{font-family:'Shippori Mincho',serif;font-size:19px;line-height:1.4}.bl-ro{font-size:12px;color:var(--mist);margin-top:2px}.bl-mn{font-size:13.5px;margin-top:6px;line-height:1.4}" +
      ".bl-act{display:flex;gap:8px;margin-top:9px}.bl-btn{border:1px solid var(--line);background:var(--washi);color:inherit;border-radius:10px;padding:7px 12px;font:600 13px Inter,sans-serif;cursor:pointer}" +
      ".bl-btn.on{background:var(--hanko);border-color:var(--hanko);color:#fff}.bl-primary{width:100%;padding:13px;border:0;border-radius:12px;background:var(--ai);color:#eee6d2;font:600 15px Inter,sans-serif;cursor:pointer;margin-top:6px}" +
      ".bl-opt{display:block;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:11px 12px;margin-top:8px;font:inherit;font-size:14px;color:inherit;cursor:pointer;line-height:1.4}" +
      ".bl-opt.ok{border-color:#2f7d4f;background:rgba(47,125,79,.14)}.bl-opt.no{border-color:var(--hanko);background:rgba(172,53,39,.1)}" +
      ".bl-note{font-size:12px;color:var(--mist);line-height:1.5;margin:4px 2px 10px}.bl-top{display:flex;align-items:center;gap:8px;margin-bottom:10px}.bl-top b{font-size:15px}";
    document.head.appendChild(s);
  }

  function render() {
    var t = T(), h = "", D = units(), esc = host.esc, i = idx();
    if (view === "list") {
      h = D.map(function (u, n) {
        var d = u.p.filter(function (_, k) { return st.done[pid(u, k)]; }).length;
        return '<button type="button" class="bl-card" data-a="unit" data-n="' + n + '"><div class="bl-ico">' + u.ico + '</div><div class="bl-grow"><b>' + esc(u.n[i] || u.n[1]) +
          '</b><div class="bl-ro">' + d + " / " + u.p.length + " " + t.ph + '</div><div class="bl-bar"><i style="width:' + Math.round(d / u.p.length * 100) + '%"></i></div></div></button>';
      }).join("");
    } else if (view === "unit") {
      var u = D[ui];
      h = '<div class="bl-top"><button type="button" class="bl-btn" data-a="back">←</button><b>' + u.ico + " " + esc(u.n[i] || u.n[1]) + "</b></div>" +
        (noJaVoice() ? '<div class="bl-note">🔈 ' + esc(t.nov) + "</div>" : "") + '<div class="bl-note">' + esc(t.tip) + "</div>" +
        u.p.map(function (p, k) {
          return '<div class="bl-row"><div class="bl-jp">' + esc(p[0]) + '</div><div class="bl-ro">' + esc(p[1]) + '</div><div class="bl-mn">' + esc(p[2][i] || p[2][1]) + '</div>' +
            '<div class="bl-act"><button type="button" class="bl-btn" data-a="say" data-k="' + k + '" aria-label="Play">🔊</button>' +
            '<button type="button" class="bl-btn' + (st.done[pid(u, k)] ? " on" : "") + '" data-a="done" data-k="' + k + '">' + (st.done[pid(u, k)] ? "✓ " : "") + t.done + "</button></div></div>";
        }).join("") + '<button type="button" class="bl-primary" data-a="quiz">' + t.quiz + " · 5</button>";
    } else if (qz.n >= qz.q.length) {
      h = '<div class="bl-row" style="text-align:center"><div class="bl-ro">' + t.score + '</div><div class="bl-jp" style="font-size:40px">' + qz.s + " / " + qz.q.length + '</div></div>' +
        '<button type="button" class="bl-primary" data-a="quiz">' + t.again + '</button><button type="button" class="bl-opt" data-a="unit" data-n="' + ui + '">' + t.back + "</button>";
    } else {
      var q = qz.q[qz.n];
      h = '<div class="bl-top"><button type="button" class="bl-btn" data-a="unit" data-n="' + ui + '">←</button><b>' + (qz.n + 1) + " / " + qz.q.length + '</b></div>' +
        '<div class="bl-row"><div class="bl-jp">' + esc(q.p[0]) + '</div><div class="bl-act"><button type="button" class="bl-btn" data-a="qsay" aria-label="Play">🔊</button></div></div><div class="bl-note">' + t.pick + "</div>" +
        q.o.map(function (o, k) {
          var c = qz.pick === null ? "" : (o === q.ans ? " ok" : (k === qz.pick ? " no" : ""));
          return '<button type="button" class="bl-opt' + c + '" data-a="opt" data-k="' + k + '"' + (qz.pick !== null ? " disabled" : "") + ">" + esc(o) + "</button>";
        }).join("") + (qz.pick !== null ? '<button type="button" class="bl-primary" data-a="next">' + t.next + "</button>" : "");
      if (qz.n === 0 && qz.pick === null) setTimeout(function () { say(q.p[0]); }, 250);
    }
    el.querySelector(".bl-body").innerHTML = h;
    el.querySelector(".sheet-title").textContent = T().title;
  }

  function startQuiz() {
    var i = idx(), u = units()[ui], all = [];
    units().forEach(function (x) { x.p.forEach(function (p) { all.push(p[2][i] || p[2][1]); }); });
    var qs = shuffle(u.p).slice(0, 5).map(function (p) {
      var ans = p[2][i] || p[2][1];
      var wrong = shuffle(all.filter(function (m) { return m !== ans; })).slice(0, 2);
      return { p: p, ans: ans, o: shuffle([ans].concat(wrong)) };
    });
    qz = { q: qs, n: 0, s: 0, pick: null }; view = "quiz"; render();
  }

  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return;
    var a = b.dataset.a, k = +b.dataset.k, u = units()[ui];
    if (a === "unit") { ui = +b.dataset.n; view = "unit"; render(); }
    else if (a === "back") { view = "list"; render(); }
    else if (a === "say") say(u.p[k][0]);
    else if (a === "qsay") say(qz.q[qz.n].p[0]);
    else if (a === "done") { var id = pid(u, k); if (st.done[id]) delete st.done[id]; else st.done[id] = 1; save(); render(); }
    else if (a === "quiz") startQuiz();
    else if (a === "opt") { var q = qz.q[qz.n]; qz.pick = k; if (q.o[k] === q.ans) qz.s++; render(); }
    else if (a === "next") { qz.n++; qz.pick = null; render(); }
  }
  function close() { if (!el) return; el.classList.remove("open"); try { speechSynthesis.cancel(); } catch (e) {} }

  window.KakeiboBelajar = {
    open: function (ctx) {
      host = ctx; css(); view = "list";
      if (!el) {
        el = document.createElement("div"); el.className = "sheet-backdrop"; el.id = "belajarBackdrop";
        el.innerHTML = '<div class="sheet"><div class="sheet-head"><div class="sheet-title"></div><button type="button" class="close-btn" id="belajarClose" aria-label="Close">✕</button></div><div class="bl-body"></div></div>';
        el.addEventListener("click", onClick); document.body.appendChild(el);
        el.querySelector("#belajarClose").addEventListener("click", close);
      }
      render(); requestAnimationFrame(function () { el.classList.add("open"); });
    }
  };
})();
