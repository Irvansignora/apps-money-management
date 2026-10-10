/* Kakeibo · modul Chat Lintas Bahasa v2 (lazy-load, mandiri).
 * Host: window.KakeiboChat.open({ lang, esc }). Backend: Worker chat.iranza.com (override: window.KAKEIBO_CHAT_API). */
(function () {
  "use strict";
  var API = window.KAKEIBO_CHAT_API || "https://chat.iranza.com", KEY = "kakeibo-chat-auth";
  var LG = [["id", "🇮🇩", "Indonesia"], ["ja", "🇯🇵", "日本語"], ["en", "🇬🇧", "English"], ["my", "🇲🇲", "မြန်မာ"], ["bn", "🇧🇩", "বাংলা"], ["vi", "🇻🇳", "Tiếng Việt"], ["th", "🇹🇭", "ไทย"], ["zh", "🇨🇳", "中文"], ["ko", "🇰🇷", "한국어"]];
  var UI = {
    id: { t: "Chat Lintas Bahasa", hero: "Ngobrol tanpa batas bahasa", heroSub: "Tulis dalam bahasamu. Temanmu membacanya dalam bahasa mereka, otomatis.", email: "Email kamu", sendc: "Kirim kode masuk", sending: "Mengirim…", code: "Kode 6 digit", login: "Masuk", name: "Namamu", mylang: "Bahasamu", mail: "Kode dikirim ke", resend: "Kirim ulang", resendIn: "Kirim ulang dalam", prof: "Akun baru! Isi nama dan bahasamu dulu.", mine: "Kode undanganmu", share: "Bagikan", copy: "Salin", copied: "Tersalin ✓", addph: "Masukkan kode teman", add: "Tambah", none: "Belum ada teman", noneSub: "Bagikan kode undanganmu atau masukkan kode temanmu di atas.", friends: "Teman", typ: "Tulis pesan…", off: "Terputus. Menyambung ulang…", wait: "menerjemahkan", fail: "terjemahan gagal", quota: "kuota terjemahan bulan ini habis", retry: "Coba lagi", on: "online", offl: "offline", typing: "sedang mengetik…", today: "Hari ini", yday: "Kemarin", you: "Kamu", settings: "Pengaturan", save: "Simpan", saved: "Tersimpan ✓", out: "Keluar", outAsk: "Keluar dari akun ini?", outYes: "Ya, keluar", cancel: "Batal", shareTxt: "Chat denganku di Kakeibo, pesannya otomatis diterjemahkan! Kode undangan: ", empty: "Belum ada pesan. Sapa duluan 👋", seesAs: "Dibaca sebagai",
      e: { email: "Email tidak valid.", wait: "Tunggu 30 detik sebelum minta kode lagi.", limit: "Terlalu banyak percobaan. Coba lagi nanti.", code: "Kode salah.", expired: "Kode kedaluwarsa. Minta kode baru.", notfound: "Kode undangan tidak ditemukan.", self: "Itu kodemu sendiri 😄", profile: "Isi nama dan bahasa.", net: "Tidak bisa terhubung ke server.", server: "Terjadi kesalahan. Coba lagi.", rate: "Pelan-pelan, kebanyakan pesan dalam 1 menit.", auth: "Sesi habis, silakan masuk lagi." } },
    en: { t: "Cross-Language Chat", hero: "Chat without language barriers", heroSub: "Write in your language. Your friend reads it in theirs, automatically.", email: "Your email", sendc: "Send sign-in code", sending: "Sending…", code: "6-digit code", login: "Sign in", name: "Your name", mylang: "Your language", mail: "Code sent to", resend: "Resend", resendIn: "Resend in", prof: "New account! Enter your name and language first.", mine: "Your invite code", share: "Share", copy: "Copy", copied: "Copied ✓", addph: "Enter friend's code", add: "Add", none: "No friends yet", noneSub: "Share your invite code or enter a friend's code above.", friends: "Friends", typ: "Type a message…", off: "Disconnected. Reconnecting…", wait: "translating", fail: "translation failed", quota: "translation quota used up this month", retry: "Retry", on: "online", offl: "offline", typing: "typing…", today: "Today", yday: "Yesterday", you: "You", settings: "Settings", save: "Save", saved: "Saved ✓", out: "Sign out", outAsk: "Sign out of this account?", outYes: "Yes, sign out", cancel: "Cancel", shareTxt: "Chat with me on Kakeibo, messages are translated automatically! Invite code: ", empty: "No messages yet. Say hi 👋", seesAs: "Read as",
      e: { email: "Invalid email.", wait: "Wait 30 seconds before requesting another code.", limit: "Too many attempts. Try again later.", code: "Wrong code.", expired: "Code expired. Request a new one.", notfound: "Invite code not found.", self: "That's your own code 😄", profile: "Enter a name and language.", net: "Cannot reach the server.", server: "Something went wrong. Try again.", rate: "Slow down, too many messages in a minute.", auth: "Session expired, please sign in again." } }
  };
  var COL = ["#ac3527", "#223a5c", "#d9822f", "#4a7c59", "#7a5c9e", "#2f7f8a"];
  var A = { tok: null, user: null }, host, root, view, tmp = {}, ws, peer, msgs = [], me, onl = [], retry = 0, closing = true, rt, pingT, typT, peerTyping = false, peerTypT, contacts = [], cdT, lastTypeSent = 0;
  try { A = Object.assign(A, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  var store = function () { try { localStorage.setItem(KEY, JSON.stringify({ tok: A.tok, user: A.user })); } catch (e) {} };
  var T = function () { return UI[host.lang] || UI.en; };
  var esc = function (s) { return host && host.esc ? host.esc(s) : String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var fl = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? x[1] : "🌐"; };
  var ln = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? x[2] : c; };
  var $ = function (s) { return root.querySelector(s); };
  var avCol = function (n) { var h = 0, s = String(n || "?"); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return COL[h % COL.length]; };
  var av = function (n, sz) { return '<span class="kc-av" style="--c:' + avCol(n) + ";width:" + (sz || 42) + "px;height:" + (sz || 42) + "px;font-size:" + Math.round((sz || 42) * .42) + 'px">' + esc(Array.from(String(n || "?"))[0] || "?").toUpperCase() + "</span>"; };
  var otherLang = function (m) { return m.uid === me ? peer.lang : A.user.lang; }; // bahasa yang dibutuhkan pembaca pesan ini

  function api(p, body) {
    return fetch(API + p, { method: body !== undefined ? "POST" : "GET", headers: Object.assign({ "content-type": "application/json" }, A.tok ? { authorization: "Bearer " + A.tok } : {}), body: body !== undefined ? JSON.stringify(body) : undefined })
      .catch(function () { throw { code: "net" }; })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.status === 401 && A.tok) { wipe(); go("login"); setTimeout(function () { err({ code: "auth" }); }, 0); }
          if (!r.ok) throw { code: j.error || "server" };
          return j;
        });
      });
  }
  function wipe() { A.tok = null; A.user = null; store(); }
  function err(e) { var n = $("#kcErr"); if (n) { n.textContent = T().e[e && e.code] || T().e.server; n.classList.add("on"); } }
  function clearErr() { var n = $("#kcErr"); if (n) { n.textContent = ""; n.classList.remove("on"); } }
  function busy(b, on, txt) { if (!b) return; b.disabled = !!on; if (txt != null) b.dataset.t = b.dataset.t || b.textContent; b.textContent = on ? (txt || "…") : (b.dataset.t || b.textContent); }

  function css() {
    if (document.getElementById("chatCss")) return;
    var s = document.createElement("style"); s.id = "chatCss";
    s.textContent = [
      "#kcRoot{position:fixed;inset:0;z-index:70;display:none;justify-content:center;background:rgba(23,35,61,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}#kcRoot.open{display:flex;animation:fadeIn .2s both}",
      ".kc-app{width:100%;max-width:480px;height:100%;height:100dvh;background:var(--washi);display:flex;flex-direction:column;position:relative;overflow:hidden;animation:sheetUp .35s cubic-bezier(.16,1,.3,1) both;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.022) 0,rgba(0,0,0,.022) 1px,transparent 1px,transparent 28px)}",
      ".kc-view{flex:1;min-height:0;display:flex;flex-direction:column;animation:riseIn .3s both}",
      ".kc-head{display:flex;align-items:center;gap:10px;padding:calc(env(safe-area-inset-top,0px) + 12px) 14px 12px;background:linear-gradient(150deg,#17233d,#26365c);color:#eee6d2;box-shadow:0 8px 20px -10px rgba(23,35,61,.6);position:relative;z-index:2}",
      ".kc-head .ttl{flex:1;min-width:0;font:700 17px 'Shippori Mincho',serif;line-height:1.2}.kc-head .sub{font:500 11.5px Inter,sans-serif;color:#b9c2d6;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kc-head .sub.on{color:#8fe0a8}",
      ".kc-ib{width:36px;height:36px;border-radius:50%;border:0;background:rgba(236,227,206,.13);color:#eee6d2;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 36px}.kc-ib:active{background:rgba(236,227,206,.25)}",
      ".kc-av{flex:0 0 auto;border-radius:50%;background:var(--c);color:#fff;font-family:'Shippori Mincho',serif;font-weight:800;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(255,255,255,.18)}",
      ".kc-scroll{flex:1;min-height:0;overflow-y:auto;padding:16px 16px calc(env(safe-area-inset-bottom,0px) + 20px);-webkit-overflow-scrolling:touch}",
      /* login */
      ".kc-hero{background:radial-gradient(120% 90% at 100% 0%,rgba(217,130,47,.35),transparent 55%),linear-gradient(150deg,#17233d,#2b4470);color:#f3ecd9;padding:calc(env(safe-area-inset-top,0px) + 18px) 22px 26px;border-radius:0 0 30px 30px;box-shadow:0 20px 40px -18px rgba(23,35,61,.6);position:relative}",
      ".kc-hero .x{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);right:14px}.kc-hero h2{font:800 26px/1.2 'Shippori Mincho',serif;margin:26px 0 8px}.kc-hero p{margin:0;font-size:13.5px;line-height:1.5;color:#c9d2e4}",
      ".kc-demo{margin-top:18px;display:flex;flex-direction:column;gap:7px}.kc-demo div{max-width:86%;padding:8px 12px;border-radius:15px;font-size:13px;line-height:1.35;opacity:0;animation:riseIn .5s forwards}.kc-demo .l{background:rgba(236,227,206,.15);border-bottom-left-radius:5px}.kc-demo .r{align-self:flex-end;background:#eee6d2;color:#17233d;border-bottom-right-radius:5px}.kc-demo small{display:block;opacity:.65;font-size:11px;margin-top:2px}",
      ".kc-form{padding:22px 20px calc(env(safe-area-inset-bottom,0px) + 22px)}",
      ".kc-in{width:100%;font:inherit;font-size:16px;padding:14px 14px;border-radius:14px;border:1.5px solid var(--line);background:#fff;color:var(--sumi);margin-bottom:10px;outline:0;transition:border-color .15s,box-shadow .15s}.kc-in:focus{border-color:var(--kabocha);box-shadow:0 0 0 4px rgba(217,130,47,.15)}",
      ".kc-otp{text-align:center;font:700 28px 'JetBrains Mono',monospace;letter-spacing:.45em;padding-left:.45em}",
      ".kc-btn{width:100%;padding:14px;border:0;border-radius:14px;background:linear-gradient(135deg,var(--hanko-2),var(--hanko));color:#fff;font:700 15px Inter,sans-serif;cursor:pointer;box-shadow:0 10px 22px -8px rgba(172,53,39,.6)}.kc-btn:disabled{opacity:.55}.kc-btn.sm{width:auto;padding:11px 16px;font-size:13.5px;border-radius:12px;box-shadow:none}.kc-btn.ghost{background:var(--card);color:var(--sumi);border:1px solid var(--line);box-shadow:none}.kc-btn.navy{background:var(--ai);box-shadow:none}",
      ".kc-note{font-size:13px;color:var(--mist);line-height:1.5;margin:2px 2px 12px}.kc-note b{color:var(--sumi)}.kc-link{background:none;border:0;color:var(--hanko);font:600 13px Inter,sans-serif;cursor:pointer;padding:6px}.kc-link:disabled{color:var(--mist)}",
      "#kcErr{font-size:13px;color:var(--hanko);background:rgba(172,53,39,.08);border-radius:10px;padding:0 12px;max-height:0;overflow:hidden;opacity:0;transition:all .2s;margin-bottom:0}#kcErr.on{max-height:60px;opacity:1;padding:9px 12px;margin-bottom:10px}",
      ".kc-lang{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.kc-lang button{border:1.5px solid var(--line);background:#fff;border-radius:12px;padding:9px 4px;font:600 12px Inter,sans-serif;color:var(--sumi);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}.kc-lang button b{font-size:20px}.kc-lang button.sel{border-color:var(--hanko);background:rgba(172,53,39,.08);box-shadow:0 0 0 3px rgba(172,53,39,.12)}",
      /* contacts */
      ".kc-inv{background:radial-gradient(120% 140% at 100% 0%,rgba(217,130,47,.4),transparent 55%),linear-gradient(135deg,#17233d,#2b4470);color:#f3ecd9;border-radius:20px;padding:16px;box-shadow:var(--shadow-md);margin-bottom:14px}.kc-inv .lb{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#b9c2d6}.kc-inv .cd{font:800 32px 'Shippori Mincho',serif;letter-spacing:.2em;margin:4px 0 12px}.kc-inv .row{display:flex;gap:8px}.kc-inv .kc-btn.sm{flex:1;background:rgba(236,227,206,.16);color:#eee6d2}.kc-inv .kc-btn.sm:first-child{background:#eee6d2;color:#17233d}",
      ".kc-add{display:flex;gap:8px;margin-bottom:6px}.kc-add .kc-in{margin:0;flex:1;text-transform:uppercase;letter-spacing:.12em;font-weight:600}",
      ".kc-h{font:700 12px Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--mist);margin:14px 4px 8px}",
      ".kc-peer{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:11px 12px;margin-bottom:8px;font:inherit;color:inherit;cursor:pointer;box-shadow:var(--shadow-sm)}.kc-peer .mid{flex:1;min-width:0}.kc-peer b{font-size:15px;display:flex;align-items:center;gap:6px}.kc-peer .pv{font-size:12.5px;color:var(--mist);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}.kc-peer .tm{font-size:11px;color:var(--mist);align-self:flex-start;margin-top:3px}",
      ".kc-emp{text-align:center;padding:34px 20px;color:var(--mist)}.kc-emp .ic{font-size:44px;margin-bottom:8px}.kc-emp b{display:block;color:var(--sumi);font:700 16px 'Shippori Mincho',serif;margin-bottom:4px}.kc-emp span{font-size:13px;line-height:1.5}",
      ".kc-sk{height:62px;border-radius:16px;margin-bottom:8px;background:linear-gradient(90deg,rgba(0,0,0,.04),rgba(0,0,0,.09),rgba(0,0,0,.04));background-size:200% 100%;animation:kcSh 1.2s infinite}@keyframes kcSh{to{background-position:-200% 0}}",
      /* chat */
      ".kc-list{flex:1;min-height:0;overflow-y:auto;padding:14px 12px 6px;display:flex;flex-direction:column;gap:3px;-webkit-overflow-scrolling:touch}",
      ".kc-day{align-self:center;font:600 11px Inter,sans-serif;color:var(--mist);background:rgba(42,37,29,.06);border-radius:99px;padding:3px 11px;margin:10px 0 6px}",
      ".kc-m{max-width:84%;display:flex;flex-direction:column;animation:riseIn .25s both;margin-top:5px}.kc-m.me{align-self:flex-end;align-items:flex-end}.kc-m.cont{margin-top:0}",
      ".kc-b{padding:9px 12px 7px;border-radius:18px 18px 18px 6px;background:var(--card);border:1px solid var(--line);font-size:15px;line-height:1.42;overflow-wrap:anywhere;white-space:pre-wrap;box-shadow:var(--shadow-sm)}.kc-m.me .kc-b{background:linear-gradient(135deg,#223a5c,#17233d);color:#eee6d2;border-color:transparent;border-radius:18px 18px 6px 18px}",
      ".kc-o{font-size:12.5px;line-height:1.4;margin-top:6px;padding-top:6px;border-top:1px dashed currentColor;border-top-color:rgba(124,139,163,.5);opacity:.78;white-space:pre-wrap}.kc-m.me .kc-o{border-top-color:rgba(236,227,206,.3)}",
      ".kc-st{font-size:11.5px;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(124,139,163,.5);color:var(--mist);display:flex;align-items:center;gap:6px}.kc-st.bad{color:var(--hanko)}.kc-m.me .kc-st{color:#b9c2d6}.kc-st button{border:0;background:none;color:inherit;text-decoration:underline;font:inherit;cursor:pointer;padding:0}",
      ".kc-dots{display:inline-flex;gap:3px}.kc-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;animation:kcB 1s infinite}.kc-dots i:nth-child(2){animation-delay:.15s}.kc-dots i:nth-child(3){animation-delay:.3s}@keyframes kcB{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}",
      ".kc-ts{font-size:10.5px;color:var(--mist);margin:2px 6px 0}",
      ".kc-typ{align-self:flex-start;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:9px 13px;color:var(--mist);margin:4px 0}",
      ".kc-bar{background:var(--hanko);color:#fff;font-size:12.5px;text-align:center;padding:6px;font-weight:600}",
      ".kc-comp{display:flex;gap:8px;align-items:flex-end;padding:8px 10px calc(env(safe-area-inset-bottom,0px) + 10px);background:rgba(251,247,234,.92);backdrop-filter:blur(8px);border-top:1px solid var(--line)}.kc-comp textarea{flex:1;font:inherit;font-size:16px;line-height:1.35;padding:10px 14px;border-radius:22px;border:1.5px solid var(--line);resize:none;max-height:120px;background:#fff;color:var(--sumi);outline:0}.kc-comp textarea:focus{border-color:var(--kabocha)}",
      ".kc-send{width:44px;height:44px;border-radius:50%;border:0;background:linear-gradient(135deg,var(--hanko-2),var(--hanko));color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 44px;box-shadow:0 8px 16px -6px rgba(172,53,39,.6)}.kc-send:disabled{opacity:.4;box-shadow:none}.kc-send svg{width:20px;height:20px}",
      ".kc-pair{font-size:11px;background:rgba(236,227,206,.16);border-radius:99px;padding:2px 8px;margin-left:6px;white-space:nowrap;font-weight:600}",
      /* settings sheet */
      ".kc-sheet{position:absolute;inset:0;background:rgba(23,35,61,.5);display:flex;align-items:flex-end;z-index:5;animation:fadeIn .2s both}.kc-sheet>div{width:100%;background:var(--washi);border-radius:24px 24px 0 0;padding:10px 18px calc(env(safe-area-inset-bottom,0px) + 20px);max-height:88%;overflow-y:auto;animation:sheetUp .3s cubic-bezier(.16,1,.3,1) both}.kc-sheet .grab{width:36px;height:4px;border-radius:99px;background:var(--line);margin:6px auto 14px}.kc-sheet h3{font:700 18px 'Shippori Mincho',serif;margin:0 0 12px}",
      ".kc-me{display:flex;align-items:center;gap:12px;margin-bottom:14px}.kc-me .em{font-size:12.5px;color:var(--mist);word-break:break-all}",
      "@media (prefers-reduced-motion:reduce){.kc-view,.kc-m,.kc-demo div{animation:none!important;opacity:1!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---------- helpers waktu ---------- */
  function hm(ts) { try { return new Date(ts).toLocaleTimeString(host.lang, { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }
  function dayKey(ts) { var d = new Date(ts); return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }
  function dayLabel(ts) {
    var t = T(), n = Date.now();
    if (dayKey(ts) === dayKey(n)) return t.today; if (dayKey(ts) === dayKey(n - 864e5)) return t.yday;
    try { return new Date(ts).toLocaleDateString(host.lang, { day: "numeric", month: "short", year: new Date(ts).getFullYear() === new Date().getFullYear() ? undefined : "numeric" }); } catch (e) { return ""; }
  }

  /* ---------- tampilan ---------- */
  var SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>';
  function langPicker(sel) { return '<div class="kc-lang" id="kcLangs">' + LG.map(function (l) { return '<button type="button" data-a="pick" data-l="' + l[0] + '" class="' + (l[0] === sel ? "sel" : "") + '"><b>' + l[1] + "</b>" + l[2] + "</button>"; }).join("") + "</div>"; }

  function go(v) {
    if (view === "chat" && v !== "chat") leaveChat();
    clearInterval(cdT);
    view = v; var t = T(), u = A.user, h = "";
    if (v === "login" || v === "code") {
      var demo = '<div class="kc-demo"><div class="l" style="animation-delay:.2s">こんにちは！調子はどう？<small>🇯🇵 → 🇮🇩 Halo! Apa kabar?</small></div><div class="r" style="animation-delay:.9s">Baik-baik aja, lagi kerja shift malam 😄<small>🇮🇩 → 🇯🇵 元気だよ、夜勤中 😄</small></div></div>';
      h = '<div class="kc-scroll" style="padding:0"><div class="kc-hero"><button class="kc-ib x" data-a="close" aria-label="Close">✕</button><div style="font-size:30px">💬</div><h2>' + t.hero + "</h2><p>" + t.heroSub + "</p>" + demo + "</div>";
      if (v === "login") {
        h += '<div class="kc-form"><input class="kc-in" id="kcEmail" type="email" autocomplete="email" inputmode="email" autocapitalize="off" placeholder="' + t.email + '" value="' + esc(tmp.email || "") + '"><div id="kcErr"></div><button class="kc-btn" data-a="req" data-t="' + t.sendc + '">' + t.sendc + "</button></div>";
      } else {
        h += '<div class="kc-form"><div class="kc-note">' + t.mail + " <b>" + esc(tmp.email) + "</b></div>" +
          '<input class="kc-in kc-otp" id="kcCode" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" placeholder="••••••">' +
          (tmp.need ? '<div class="kc-note"><b>' + t.prof + '</b></div><input class="kc-in" id="kcName" maxlength="24" autocomplete="nickname" placeholder="' + t.name + '"><div class="kc-note" style="margin-bottom:6px">' + t.mylang + "</div>" + langPicker(tmp.lang || host.lang) : "") +
          '<div id="kcErr"></div><button class="kc-btn" data-a="ver" data-t="' + t.login + '">' + t.login + '</button><div style="display:flex;justify-content:space-between;margin-top:8px"><button class="kc-link" data-a="relogin">← ' + t.email + '</button><button class="kc-link" id="kcResend" data-a="resend" disabled></button></div></div>';
      }
      h += "</div>";
    } else if (v === "contacts") {
      h = '<div class="kc-head">' + av(u.name, 40) + '<div class="ttl">' + esc(u.name) + '<div class="sub">' + fl(u.lang) + " " + ln(u.lang) + '</div></div><button class="kc-ib" data-a="settings" aria-label="' + t.settings + '">⚙️</button><button class="kc-ib" data-a="close" aria-label="Close">✕</button></div>' +
        '<div class="kc-scroll"><div class="kc-inv"><div class="lb">' + t.mine + '</div><div class="cd">' + esc(u.invite) + '</div><div class="row"><button class="kc-btn sm" data-a="share">' + t.share + '</button><button class="kc-btn sm" data-a="copy">' + t.copy + '</button></div></div>' +
        '<div class="kc-add"><input class="kc-in" id="kcAdd" maxlength="8" autocapitalize="characters" autocomplete="off" placeholder="' + t.addph + '"><button class="kc-btn sm navy" data-a="add" style="padding:0 18px">' + t.add + '</button></div><div id="kcErr"></div>' +
        '<div class="kc-h">' + t.friends + '</div><div id="kcPeers"><div class="kc-sk"></div><div class="kc-sk"></div></div></div>';
    } else if (v === "chat") {
      h = '<div class="kc-head"><button class="kc-ib" data-a="tocontacts" aria-label="Back">←</button>' + av(peer.name, 40) + '<div class="ttl"><span>' + esc(peer.name) + '</span><span class="kc-pair">' + fl(u.lang) + " ⇄ " + fl(peer.lang) + '</span><div class="sub" id="kcSt">' + t.offl + '</div></div></div>' +
        '<div class="kc-bar" id="kcBar" style="display:none">' + t.off + '</div><div class="kc-list" id="kcList"></div>' +
        '<form class="kc-comp" id="kcForm"><textarea id="kcTxt" rows="1" maxlength="1000" enterkeyhint="send" placeholder="' + t.typ + '"></textarea><button class="kc-send" id="kcSend" aria-label="send" disabled>' + SEND + "</button></form>";
    }
    $(".kc-view").innerHTML = h; $(".kc-view").style.animation = "none"; void $(".kc-view").offsetWidth; $(".kc-view").style.animation = "";
    if (v === "contacts") loadContacts();
    if (v === "code") { startCd(); var c = $("#kcCode"); if (c) setTimeout(function () { c.focus(); }, 250); }
    if (v === "chat") { drawMsgs(true); closing = false; retry = 0; connect(); }
  }

  function startCd() {
    var left = 30, b = $("#kcResend"); if (!b) return;
    function tick() { if (!b.isConnected) return clearInterval(cdT); if (left > 0) { b.disabled = true; b.textContent = T().resendIn + " " + left + "s"; left--; } else { b.disabled = false; b.textContent = T().resend; clearInterval(cdT); } }
    tick(); cdT = setInterval(tick, 1000);
  }

  function loadContacts() {
    api("/api/contacts").then(function (r) {
      contacts = r.contacts || []; var n = $("#kcPeers"); if (!n || view !== "contacts") return;
      n.innerHTML = contacts.length ? contacts.map(function (c, i) {
        var pv = c.last ? (c.last.mine ? T().you + ": " : "") + c.last.text : fl(c.lang) + " " + ln(c.lang);
        return '<button class="kc-peer" data-a="open" data-i="' + i + '">' + av(c.name, 46) + '<span class="mid"><b>' + esc(c.name) + " " + fl(c.lang) + '</b><div class="pv">' + esc(pv) + "</div></span>" + (c.last ? '<span class="tm">' + hm(c.last.ts) + "</span>" : "") + "</button>";
      }).join("") : '<div class="kc-emp"><div class="ic">🫶</div><b>' + T().none + "</b><span>" + T().noneSub + "</span></div>";
    }).catch(function (e) { var n = $("#kcPeers"); if (n) n.innerHTML = ""; err(e); });
  }

  /* ---------- realtime ---------- */
  function connect() {
    clearTimeout(rt);
    api("/api/ws-ticket", { peer: peer.id }).then(function (r) {
      if (closing || view !== "chat") return;
      try { ws && ws.close(); } catch (e) {}
      var sock = ws = new WebSocket(API.replace(/^http/, "ws") + "/ws?ticket=" + encodeURIComponent(r.ticket));
      sock.onopen = function () { if (sock !== ws) return; retry = 0; bar(false); clearInterval(pingT); pingT = setInterval(function () { try { sock.send("ping"); } catch (e) {} }, 25000); };
      sock.onmessage = function (e) {
        if (sock !== ws || e.data === "pong") return;
        var d; try { d = JSON.parse(e.data); } catch (x) { return; }
        if (d.type === "init") {
          me = d.me; msgs = d.history || [];
          msgs.forEach(function (m) { if (m.uid !== me && m.lang !== A.user.lang && !(m.tr && m.tr[A.user.lang])) { m.st = "wait"; askTr(m.id); } });
          online(d.online); drawMsgs(true);
        } else if (d.type === "online") online(d.online);
        else if (d.type === "typing") { if (d.uid !== me) { peerTyping = true; clearTimeout(peerTypT); peerTypT = setTimeout(function () { peerTyping = false; online(onl); drawMsgs(); }, 3500); online(onl); } }
        else if (d.type === "msg") { peerTyping = false; online(onl); if (!msgs.some(function (x) { return x.id === d.msg.id; })) msgs.push(d.msg); drawMsgs(d.msg.uid === me); if (d.msg.uid !== me && d.msg.lang !== A.user.lang) d.msg.st = "wait"; }
        else if (d.type === "tr") { var m = msgs.filter(function (x) { return x.id === d.id; })[0]; if (m) { m.tr = m.tr || {}; if (d.text) { m.tr[d.lang] = d.text; delete m.st; } else m.st = d.quota ? "quota" : "fail"; drawMsgs(); } }
        else if (d.type === "error") { var n = $("#kcTxt"); if (n) toast(T().e[d.code] || T().e.server); }
      };
      sock.onclose = function () { if (sock !== ws) return; clearInterval(pingT); if (closing || view !== "chat") return; bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); };
      sock.onerror = function () { try { sock.close(); } catch (e) {} };
    }).catch(function (e) { if (e && e.code === "notfound") return go("contacts"); if (!closing && view === "chat") { bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); } });
  }
  function askTr(id) { try { ws && ws.readyState === 1 && ws.send(JSON.stringify({ tr: id })); } catch (e) {} }
  function leaveChat() { closing = true; clearTimeout(rt); clearInterval(pingT); try { ws && ws.close(); } catch (e) {} ws = null; peerTyping = false; }
  function bar(on) { var b = $("#kcBar"); if (b) b.style.display = on ? "" : "none"; var s = $("#kcSend"); if (s && on) s.disabled = true; else upSend(); }
  function online(a) { onl = a || []; var s = $("#kcSt"); if (!s) return; var on = onl.indexOf(peer.id) >= 0; s.textContent = peerTyping ? T().typing : on ? "● " + T().on : T().offl; s.className = "sub" + (on ? " on" : ""); }
  function upSend() { var s = $("#kcSend"), x = $("#kcTxt"); if (s && x) s.disabled = !x.value.trim() || !ws || ws.readyState !== 1; }
  function toast(msg) { var n = $("#kcErr") || null; if (n) { n.textContent = msg; n.classList.add("on"); } else { var b = $("#kcBar"); if (b) { b.textContent = msg; b.style.display = ""; setTimeout(function () { b.textContent = T().off; if (ws && ws.readyState === 1) b.style.display = "none"; }, 2500); } } }

  function drawMsgs(force) {
    var box = $("#kcList"); if (!box) return;
    var end = force || box.scrollHeight - box.scrollTop - box.clientHeight < 90, t = T(), L = A.user.lang, prev = null, html = "";
    if (!msgs.length) html = '<div class="kc-emp" style="margin:auto"><div class="ic">👋</div><b>' + esc(peer.name) + " " + fl(peer.lang) + "</b><span>" + t.empty + "</span></div>";
    msgs.forEach(function (m, i) {
      var mine = m.uid === me, tgt = mine ? peer.lang : L, tr = m.tr && m.tr[tgt], main = m.text, sub = "";
      if (!prev || dayKey(prev.ts) !== dayKey(m.ts)) html += '<div class="kc-day">' + dayLabel(m.ts) + "</div>";
      if (m.lang !== tgt) {
        if (tr) { if (mine) sub = '<div class="kc-o">' + fl(tgt) + " " + esc(tr) + "</div>"; else { main = tr; sub = '<div class="kc-o">' + fl(m.lang) + " " + esc(m.text) + "</div>"; } }
        else if (m.st === "fail" || m.st === "quota") sub = '<div class="kc-st bad">⚠ ' + t[m.st] + (!mine ? ' · <button data-a="retr" data-id="' + esc(m.id) + '">' + t.retry + "</button>" : "") + "</div>";
        else sub = '<div class="kc-st"><span class="kc-dots"><i></i><i></i><i></i></span>' + t.wait + "</div>";
      }
      var cont = prev && prev.uid === m.uid && dayKey(prev.ts) === dayKey(m.ts) && m.ts - prev.ts < 120000;
      var nx = msgs[i + 1], last = !(nx && nx.uid === m.uid && dayKey(nx.ts) === dayKey(m.ts) && nx.ts - m.ts < 120000);
      html += '<div class="kc-m' + (mine ? " me" : "") + (cont ? " cont" : "") + '"><div class="kc-b">' + esc(main) + sub + "</div>" + (last ? '<div class="kc-ts">' + hm(m.ts) + "</div>" : "") + "</div>";
      prev = m;
    });
    if (peerTyping) html += '<div class="kc-typ"><span class="kc-dots"><i></i><i></i><i></i></span></div>';
    box.innerHTML = html;
    if (end) box.scrollTop = box.scrollHeight;
  }

  /* ---------- pengaturan ---------- */
  function openSettings() {
    var u = A.user, t = T(), s = document.createElement("div"); s.className = "kc-sheet"; s.id = "kcSheet"; tmp.selLang = u.lang;
    s.innerHTML = '<div><div class="grab"></div><h3>' + t.settings + '</h3><div class="kc-me">' + av(u.name, 46) + '<div><b>' + esc(u.name) + '</b><div class="em">' + esc(u.email || "") + '</div></div></div>' +
      '<input class="kc-in" id="kcPName" maxlength="24" value="' + esc(u.name) + '" placeholder="' + t.name + '"><div class="kc-note" style="margin-bottom:6px">' + t.mylang + "</div>" + langPicker(u.lang) +
      '<div id="kcErr"></div><button class="kc-btn" data-a="saveprof" data-t="' + t.save + '">' + t.save + '</button><button class="kc-btn ghost" style="margin-top:10px;color:var(--hanko)" data-a="logout">' + t.out + '</button><button class="kc-link" style="width:100%;margin-top:6px" data-a="closesheet">' + t.cancel + "</button></div>";
    $(".kc-app").appendChild(s);
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
  }
  function confirmLogout() {
    var t = T(), s = $("#kcSheet"); if (!s) return;
    s.firstChild.innerHTML = '<div class="grab"></div><h3>' + t.outAsk + '</h3><button class="kc-btn" data-a="logout2">' + t.outYes + '</button><button class="kc-btn ghost" style="margin-top:10px" data-a="closesheet">' + t.cancel + "</button>";
  }
  function doLogout() {
    var done = function () { wipe(); tmp = {}; msgs = []; contacts = []; var s = $("#kcSheet"); if (s) s.remove(); go("login"); };
    api("/api/auth/logout", {}).then(done, done);
  }

  /* ---------- aksi ---------- */
  function onClick(e) {
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a;
    if (a === "close") close();
    else if (a === "pick") { tmp.lang = tmp.selLang = b.dataset.l; Array.prototype.forEach.call(b.parentNode.children, function (x) { x.classList.toggle("sel", x === b); }); }
    else if (a === "req" || a === "resend") {
      var em = a === "req" ? ($("#kcEmail").value || "").trim() : tmp.email; if (a === "req") { tmp.email = em; tmp.need = false; } clearErr();
      busy(b, true, T().sending);
      api("/api/auth/request", { email: em }).then(function () { go("code"); }, function (x) { busy(b, false); err(x); });
    } else if (a === "ver") {
      var body = { email: tmp.email, code: ($("#kcCode").value || "").trim() }; clearErr();
      if (tmp.need) { body.name = ($("#kcName").value || "").trim(); body.lang = tmp.lang || host.lang; }
      busy(b, true, "…");
      api("/api/auth/verify", body).then(function (r) {
        if (r.need_profile) { tmp.need = true; var c = body.code; go("code"); $("#kcCode").value = c; $("#kcName").focus(); return; }
        A.tok = r.token; A.user = r.user; store(); tmp = {}; go("contacts");
      }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "relogin") go("login");
    else if (a === "add") {
      var c2 = $("#kcAdd"), code = (c2.value || "").trim(); if (!code) return; clearErr(); busy(b, true, "…");
      api("/api/contacts/add", { code: code }).then(function () { c2.value = ""; busy(b, false); loadContacts(); }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "open") { peer = contacts[+b.dataset.i]; msgs = []; go("chat"); }
    else if (a === "tocontacts") go("contacts");
    else if (a === "settings") openSettings();
    else if (a === "closesheet") { var s = $("#kcSheet"); if (s) s.remove(); }
    else if (a === "saveprof") {
      var nm = ($("#kcPName").value || "").trim(); clearErr(); busy(b, true, "…");
      api("/api/profile", { name: nm, lang: tmp.selLang || A.user.lang }).then(function (r) { A.user = Object.assign(A.user, r.user); store(); var s2 = $("#kcSheet"); if (s2) s2.remove(); go("contacts"); }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "logout") confirmLogout();
    else if (a === "logout2") doLogout();
    else if (a === "retr") { var m = msgs.filter(function (x) { return x.id === b.dataset.id; })[0]; if (m) { m.st = "wait"; drawMsgs(); askTr(m.id); } }
    else if (a === "share" || a === "copy") {
      var txt = T().shareTxt + A.user.invite, link = "https://kakeibo.iranza.com";
      if (a === "share" && navigator.share) navigator.share({ text: txt, url: link }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(txt + " " + link).then(function () { var o = b.textContent; b.textContent = T().copied; setTimeout(function () { b.textContent = o; }, 1500); });
    }
  }
  function onSubmit(e) {
    if (e.target.id !== "kcForm") return; e.preventDefault();
    var i = $("#kcTxt"), v = i.value.trim();
    if (!v || !ws || ws.readyState !== 1) return;
    ws.send(JSON.stringify({ text: v })); i.value = ""; i.style.height = "auto"; upSend(); i.focus();
  }
  function onInput(e) {
    if (e.target.id === "kcTxt") {
      var i = e.target; i.style.height = "auto"; i.style.height = Math.min(i.scrollHeight, 120) + "px"; upSend();
      if (ws && ws.readyState === 1 && Date.now() - lastTypeSent > 2000) { lastTypeSent = Date.now(); try { ws.send(JSON.stringify({ typing: 1 })); } catch (x) {} }
    } else if (e.target.id === "kcCode") { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6); if (e.target.value.length === 6 && !tmp.need) { var b = $('[data-a="ver"]'); if (b) b.click(); } }
  }
  function onKey(e) {
    if (e.target.id === "kcTxt" && e.key === "Enter" && !e.shiftKey && window.matchMedia && window.matchMedia("(hover:hover)").matches) { e.preventDefault(); $("#kcForm").requestSubmit ? $("#kcForm").requestSubmit() : $("#kcSend").click(); }
    else if (e.key === "Enter" && (e.target.id === "kcEmail")) { e.preventDefault(); $('[data-a="req"]').click(); }
    else if (e.key === "Enter" && (e.target.id === "kcAdd")) { e.preventDefault(); $('[data-a="add"]').click(); }
  }
  function onVis() { if (!root || !root.classList.contains("open") || view !== "chat" || closing) return; if (!ws || ws.readyState > 1) { clearTimeout(rt); retry = 0; connect(); } }
  function close() { if (!root) return; leaveChat(); clearInterval(cdT); root.classList.remove("open"); document.body.style.overflow = ""; }

  window.KakeiboChat = {
    open: function (ctx) {
      host = ctx; css();
      if (!root) {
        root = document.createElement("div"); root.id = "kcRoot"; root.innerHTML = '<div class="kc-app"><div class="kc-view"></div></div>';
        root.addEventListener("click", function (e) { if (e.target === root) return close(); onClick(e); });
        root.addEventListener("submit", onSubmit); root.addEventListener("input", onInput); root.addEventListener("keydown", onKey);
        document.addEventListener("visibilitychange", function () { if (!document.hidden) onVis(); }); window.addEventListener("online", onVis);
        document.body.appendChild(root);
      }
      root.classList.add("open"); document.body.style.overflow = "hidden";
      go(A.tok && A.user ? "contacts" : "login");
      if (A.tok) api("/api/me").then(function (r) { if (r.user) { A.user = Object.assign(A.user, r.user); store(); } }).catch(function () {});
    }
  };
})();
