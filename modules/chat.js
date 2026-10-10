/* Kakeibo · modul Chat Lintas Bahasa (lazy-load, mandiri).
 * Host: window.KakeiboChat.open({ lang, esc }). Backend: Worker di chat.iranza.com (override: window.KAKEIBO_CHAT_API). */
(function () {
  "use strict";
  var API = window.KAKEIBO_CHAT_API || "https://chat.iranza.com", KEY = "kakeibo-chat-auth";
  var LG = [["id", "🇮🇩", "Indonesia"], ["ja", "🇯🇵", "日本語"], ["en", "🇬🇧", "English"], ["my", "🇲🇲", "မြန်မာ"], ["bn", "🇧🇩", "বাংলা"], ["vi", "🇻🇳", "Tiếng Việt"], ["th", "🇹🇭", "ไทย"], ["zh", "🇨🇳", "中文"], ["ko", "🇰🇷", "한국어"]];
  var UI = {
    id: { t: "Chat Lintas Bahasa", email: "Email", sendc: "Kirim kode", code: "Kode 6 digit dari email", login: "Masuk", name: "Namamu", mylang: "Bahasamu", mail: "Cek emailmu untuk kode masuk.", prof: "Akun baru. Isi nama dan bahasamu, lalu tekan Masuk.", mine: "Kode undangan kamu", share: "Bagikan", addph: "Kode undangan teman", add: "Tambah", none: "Belum ada teman. Bagikan kodemu atau masukkan kode temanmu.", typ: "Tulis pesan…", snd: "Kirim", out: "Keluar", off: "Terputus. Menyambung ulang…", wait: "menerjemahkan…", fail: "(terjemahan gagal)", quota: "(kuota terjemahan bulan ini habis)", on: "online", offl: "offline",
      e: { email: "Email tidak valid.", wait: "Tunggu 30 detik sebelum minta kode lagi.", limit: "Terlalu banyak percobaan. Coba lagi nanti.", code: "Kode salah.", expired: "Kode kedaluwarsa. Minta kode baru.", notfound: "Kode undangan tidak ditemukan.", profile: "Isi nama dan bahasa.", net: "Tidak bisa terhubung ke server.", server: "Terjadi kesalahan. Coba lagi.", rate: "Pelan-pelan, kebanyakan pesan dalam 1 menit." } },
    en: { t: "Cross-Language Chat", email: "Email", sendc: "Send code", code: "6-digit code from email", login: "Sign in", name: "Your name", mylang: "Your language", mail: "Check your email for the sign-in code.", prof: "New account. Enter your name and language, then tap Sign in.", mine: "Your invite code", share: "Share", addph: "Friend's invite code", add: "Add", none: "No friends yet. Share your code or enter a friend's code.", typ: "Type a message…", snd: "Send", out: "Sign out", off: "Disconnected. Reconnecting…", wait: "translating…", fail: "(translation failed)", quota: "(translation quota used up this month)", on: "online", offl: "offline",
      e: { email: "Invalid email.", wait: "Wait 30 seconds before requesting another code.", limit: "Too many attempts. Try again later.", code: "Wrong code.", expired: "Code expired. Request a new one.", notfound: "Invite code not found.", profile: "Enter a name and language.", net: "Cannot reach the server.", server: "Something went wrong. Try again.", rate: "Slow down, too many messages in a minute." } }
  };
  var A = { tok: null, user: null }, host, el, view, tmp = {}, ws, peer, msgs = [], me, onl = [], retry = 0, closing = true, rt, contacts = [];
  try { A = Object.assign(A, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  var store = function () { try { localStorage.setItem(KEY, JSON.stringify({ tok: A.tok, user: A.user })); } catch (e) {} };
  var T = function () { return UI[host.lang] || UI.en; };
  var fl = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? x[1] : "🌐"; };
  var $ = function (s) { return el.querySelector(s); };
  var esc = function (s) { return host.esc(s); };

  function api(p, body) {
    return fetch(API + p, { method: body ? "POST" : "GET", headers: Object.assign({ "content-type": "application/json" }, A.tok ? { authorization: "Bearer " + A.tok } : {}), body: body ? JSON.stringify(body) : undefined })
      .catch(function () { throw { code: "net" }; })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.status === 401 && A.tok) { A.tok = null; A.user = null; store(); go("login"); }
          if (!r.ok) throw { code: j.error || "server" };
          return j;
        });
      });
  }
  var err = function (e) { var n = $("#chErr"); if (n) n.textContent = T().e[e && e.code] || T().e.server; };

  function css() {
    if (document.getElementById("chatCss")) return;
    var s = document.createElement("style"); s.id = "chatCss";
    s.textContent = ".ch-in{width:100%;font:inherit;font-size:16px;padding:12px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--sumi);margin-bottom:8px}" +
      ".ch-btn{width:100%;padding:13px;border:0;border-radius:12px;background:var(--ai);color:#eee6d2;font:600 15px Inter,sans-serif;cursor:pointer;margin-top:2px}.ch-btn.sm{width:auto;padding:10px 14px;margin:0}.ch-btn.ghost{background:var(--washi);color:var(--sumi);border:1px solid var(--line)}" +
      ".ch-note{font-size:12.5px;color:var(--mist);line-height:1.5;margin:6px 2px}#chErr{font-size:12.5px;color:var(--hanko);min-height:18px;margin:4px 2px}" +
      ".ch-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px}.ch-code{font:700 24px 'Shippori Mincho',serif;letter-spacing:.14em}" +
      ".ch-row{display:flex;gap:8px;align-items:center}.ch-row>input{margin:0;flex:1}.ch-peer{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:8px;font:inherit;color:inherit;cursor:pointer}" +
      ".ch-chat{display:flex;flex-direction:column;height:68vh}.ch-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}.ch-sm{font-size:12px;color:var(--mist)}" +
      ".ch-list{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:4px 2px}.ch-m{max-width:84%;display:flex;flex-direction:column}.ch-m.me{align-self:flex-end;align-items:flex-end}" +
      ".ch-b{padding:9px 12px;border-radius:14px;background:var(--card);border:1px solid var(--line);font-size:15px;line-height:1.4;overflow-wrap:anywhere}.ch-m.me .ch-b{background:var(--ai);color:#eee6d2;border-color:var(--ai)}" +
      ".ch-o{font-size:12px;opacity:.68;margin-top:5px;padding-top:5px;border-top:1px dashed currentColor}.ch-bar{background:var(--hanko);color:#fff;font-size:12.5px;text-align:center;border-radius:8px;padding:5px;margin-bottom:6px}" +
      ".ch-form{display:flex;gap:8px;align-items:flex-end;margin-top:8px}.ch-form textarea{flex:1;font:inherit;font-size:16px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);resize:none;max-height:100px;background:#fff;color:var(--sumi)}";
    document.head.appendChild(s);
  }

  function go(v) {
    if (view === "chat" && v !== "chat") leaveChat();
    view = v; var t = T(), u = A.user, h = "";
    if (v === "login") {
      h = '<input class="ch-in" id="chEmail" type="email" autocomplete="email" placeholder="' + t.email + '" value="' + esc(tmp.email || "") + '"><div id="chErr"></div><button class="ch-btn" data-a="req">' + t.sendc + "</button>";
    } else if (v === "code") {
      h = '<div class="ch-note">' + t.mail + '</div><input class="ch-in" id="chCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="' + t.code + '">' +
        (tmp.need ? '<div class="ch-note">' + t.prof + '</div><input class="ch-in" id="chName" maxlength="24" placeholder="' + t.name + '"><select class="ch-in" id="chLang">' +
          LG.map(function (l) { return '<option value="' + l[0] + '"' + (l[0] === host.lang ? " selected" : "") + ">" + l[1] + " " + l[2] + "</option>"; }).join("") + "</select>" : "") +
        '<div id="chErr"></div><button class="ch-btn" data-a="ver">' + t.login + '</button><button class="ch-btn ghost" style="margin-top:8px" data-a="relogin">←</button>';
    } else if (v === "contacts") {
      h = '<div class="ch-card"><div class="ch-note" style="margin:0">' + esc(u.name) + " " + fl(u.lang) + " · " + t.mine + '</div><div class="ch-row" style="justify-content:space-between"><div class="ch-code">' + esc(u.invite) +
        '</div><button class="ch-btn sm" data-a="share">' + t.share + '</button></div></div><div class="ch-row"><input class="ch-in" id="chAdd" maxlength="8" autocapitalize="characters" placeholder="' + t.addph + '"><button class="ch-btn sm" data-a="add">' + t.add + '</button></div><div id="chErr"></div><div id="chList2"></div>' +
        '<button class="ch-btn ghost" style="margin-top:12px" data-a="logout">' + t.out + "</button>";
      loadContacts();
    } else if (v === "chat") {
      h = '<div class="ch-chat"><div class="ch-top"><button class="ch-btn sm ghost" data-a="tocontacts">←</button><div><b>' + fl(peer.lang) + " " + esc(peer.name) + '</b><div class="ch-sm" id="chSt">' + t.offl + '</div></div></div><div id="chBar" class="ch-bar" style="display:none">' + t.off +
        '</div><div class="ch-list" id="chList"></div><form class="ch-form" id="chForm"><textarea id="chTxt" rows="1" maxlength="1000" placeholder="' + t.typ + '"></textarea><button class="ch-btn sm">' + t.snd + "</button></form></div>";
    }
    $(".ch-body").innerHTML = h; $(".sheet-title").textContent = t.t;
    if (v === "chat") { drawMsgs(); closing = false; retry = 0; connect(); }
  }

  function loadContacts() {
    api("/api/contacts").then(function (r) {
      contacts = r.contacts; var n = $("#chList2"); if (!n || view !== "contacts") return;
      n.innerHTML = contacts.length ? contacts.map(function (c, i) { return '<button class="ch-peer" data-a="open" data-i="' + i + '"><span style="font-size:22px">' + fl(c.lang) + "</span><b>" + esc(c.name) + "</b></button>"; }).join("") : '<div class="ch-note">' + T().none + "</div>";
    }).catch(err);
  }

  // ---- chat realtime ----
  function connect() {
    clearTimeout(rt);
    api("/api/ws-ticket", { peer: peer.id }).then(function (r) {
      if (closing || view !== "chat") return;
      ws = new WebSocket(API.replace(/^http/, "ws") + "/ws?ticket=" + r.ticket);
      ws.onopen = function () { retry = 0; bar(false); };
      ws.onmessage = function (e) {
        var d = JSON.parse(e.data);
        if (d.type === "init") { me = d.me; msgs = d.history; msgs.forEach(function (m) { if (m.lang !== (m.uid === me ? peer.lang : A.user.lang) && !(m.tr && m.tr[m.uid === me ? peer.lang : A.user.lang])) m.st = "fail"; }); online(d.online); drawMsgs(true); }
        else if (d.type === "online") online(d.online);
        else if (d.type === "msg") { msgs.push(d.msg); drawMsgs(); }
        else if (d.type === "tr") { var m = msgs.filter(function (x) { return x.id === d.id; })[0]; if (m) { m.tr = m.tr || {}; if (d.text) m.tr[d.lang] = d.text; else m.st = d.quota ? "quota" : "fail"; drawMsgs(); } }
        else if (d.type === "error") err({ code: d.code });
      };
      ws.onclose = function () { if (closing || view !== "chat") return; bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); };
    }).catch(function () { if (!closing && view === "chat") { bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); } });
  }
  function leaveChat() { closing = true; clearTimeout(rt); try { ws && ws.close(); } catch (e) {} ws = null; }
  function bar(on) { var b = $("#chBar"); if (b) b.style.display = on ? "" : "none"; }
  function online(a) { onl = a || []; var s = $("#chSt"); if (s) s.textContent = onl.indexOf(peer.id) >= 0 ? "● " + T().on : T().offl; }

  function drawMsgs(force) {
    var box = $("#chList"); if (!box) return;
    var end = force || box.scrollHeight - box.scrollTop - box.clientHeight < 80, t = T(), L = A.user.lang;
    box.innerHTML = msgs.map(function (m) {
      var mine = m.uid === me, main = m.text, sub = "", tgt = mine ? peer.lang : L, tr = m.tr && m.tr[tgt];
      if (m.lang !== tgt) {
        if (mine) sub = tr ? fl(tgt) + " " + tr : (m.st ? t[m.st] : t.wait);
        else if (tr) { main = tr; sub = m.text; } else sub = m.st ? t[m.st] : t.wait;
      }
      return '<div class="ch-m' + (mine ? " me" : "") + '"><div class="ch-b">' + esc(main) + (sub ? '<div class="ch-o">' + esc(sub) + "</div>" : "") + "</div></div>";
    }).join("");
    if (end) box.scrollTop = box.scrollHeight;
  }

  // ---- aksi ----
  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a;
    if (a === "req") {
      var em = $("#chEmail").value.trim(); tmp.email = em; tmp.need = false;
      api("/api/auth/request", { email: em }).then(function () { go("code"); }).catch(err);
    } else if (a === "ver") {
      var body = { email: tmp.email, code: $("#chCode").value.trim() };
      if (tmp.need) { body.name = $("#chName").value.trim(); body.lang = $("#chLang").value; }
      api("/api/auth/verify", body).then(function (r) {
        if (r.need_profile) { tmp.need = true; var c = body.code; go("code"); $("#chCode").value = c; return; }
        A.tok = r.token; A.user = r.user; store(); go("contacts");
      }).catch(err);
    } else if (a === "relogin") go("login");
    else if (a === "add") api("/api/contacts/add", { code: $("#chAdd").value }).then(function () { $("#chAdd").value = ""; $("#chErr").textContent = ""; loadContacts(); }).catch(err);
    else if (a === "open") { peer = contacts[+b.dataset.i]; msgs = []; go("chat"); }
    else if (a === "tocontacts") go("contacts");
    else if (a === "logout") { A.tok = null; A.user = null; store(); tmp = {}; go("login"); }
    else if (a === "share") {
      var txt = "Chat denganku di Kakeibo. Kode undangan: " + A.user.invite;
      if (navigator.share) navigator.share({ text: txt, url: "https://kakeibo.iranza.com" }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(txt + " https://kakeibo.iranza.com");
    }
  }
  function onSubmit(e) {
    if (e.target.id !== "chForm") return; e.preventDefault();
    var i = $("#chTxt"), v = i.value.trim();
    if (!v || !ws || ws.readyState !== 1) return;
    ws.send(JSON.stringify({ text: v })); i.value = "";
  }
  function close() { if (!el) return; leaveChat(); el.classList.remove("open"); }

  window.KakeiboChat = {
    open: function (ctx) {
      host = ctx; css();
      if (!el) {
        el = document.createElement("div"); el.className = "sheet-backdrop"; el.id = "chatBackdrop";
        el.innerHTML = '<div class="sheet"><div class="sheet-head"><div class="sheet-title"></div><button type="button" class="close-btn" id="chatClose" aria-label="Close">✕</button></div><div class="ch-body"></div></div>';
        el.addEventListener("click", onClick); el.addEventListener("submit", onSubmit); document.body.appendChild(el);
        el.querySelector("#chatClose").addEventListener("click", close);
      }
      go(A.tok && A.user ? "contacts" : "login"); requestAnimationFrame(function () { el.classList.add("open"); });
    }
  };
})();
