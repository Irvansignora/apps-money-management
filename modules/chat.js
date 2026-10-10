/* Kakeibo · modul Chat Lintas Bahasa v2 (lazy-load, mandiri).
 * Host: window.KakeiboChat.open({ lang, esc }). Backend: Worker chat.iranza.com (override: window.KAKEIBO_CHAT_API). */
(function () {
  "use strict";
  var API = window.KAKEIBO_CHAT_API || "https://chat.iranza.com", KEY = "kakeibo-chat-auth";
  var LG = [["id", "ID", "Indonesia"], ["ja", "JA", "日本語"], ["en", "EN", "English"], ["my", "MY", "မြန်မာ"], ["bn", "BN", "বাংলা"], ["vi", "VI", "Tiếng Việt"], ["th", "TH", "ไทย"], ["zh", "ZH", "中文"], ["ko", "KO", "한국어"]];
  var UI = {
    id: { t: "Chat Lintas Bahasa", hero: "Ngobrol tanpa batas bahasa", heroSub: "Tulis dalam bahasamu. Temanmu membacanya dalam bahasa mereka, otomatis.", email: "Email kamu", sendc: "Kirim kode masuk", sending: "Mengirim…", code: "Kode 6 digit", login: "Masuk", name: "Namamu", mylang: "Bahasamu", mail: "Kode dikirim ke", resend: "Kirim ulang", resendIn: "Kirim ulang dalam", prof: "Akun baru! Isi nama dan bahasamu dulu.", mine: "Kode undanganmu", share: "Bagikan", copy: "Salin", copied: "Tersalin ✓", addph: "Masukkan kode teman", add: "Tambah", none: "Belum ada teman", noneSub: "Bagikan kode undanganmu atau masukkan kode temanmu di atas.", friends: "Teman", typ: "Tulis pesan…", off: "Terputus. Menyambung ulang…", wait: "menerjemahkan", fail: "terjemahan gagal", quota: "kuota terjemahan bulan ini habis", retry: "Coba lagi", on: "online", offl: "offline", typing: "sedang mengetik…", today: "Hari ini", yday: "Kemarin", you: "Kamu", avChange: "Ganti foto", avK: "Pakai foto profil Kakeibo", avDel: "Hapus foto", avUp: "Mengunggah…", avShared: "Foto ini terlihat oleh teman chat-mu.", avLocal: "Foto Kakeibo-mu belum dibagikan ke teman. Ketuk “Pakai foto profil Kakeibo”.", avNone: "Belum ada foto. Temanmu melihat inisial namamu.", wpUpload: "Upload foto sendiri", wpBlur: "Blur latar", settings: "Pengaturan", profT: "Profil", useK: "Pakai nama dari profil Kakeibo", wp: "Wallpaper chat", wpGal: "Foto dari galeri", wpDim: "Redupkan latar", wpReset: "Kembali ke default", wpBig: "Foto terlalu besar/gagal dibaca", savedP: "Profil tersimpan ✓", langNote: "Bahasa baru dipakai untuk pesan berikutnya.", save: "Simpan", saved: "Tersimpan ✓", out: "Keluar", outAsk: "Keluar dari akun ini?", outYes: "Ya, keluar", cancel: "Batal", shareTxt: "Chat denganku di Kakeibo, pesannya otomatis diterjemahkan! Kode undangan: ", empty: "Belum ada pesan. Sapa duluan 👋", seesAs: "Dibaca sebagai",
      e: { email: "Email tidak valid.", wait: "Tunggu 30 detik sebelum minta kode lagi.", limit: "Terlalu banyak percobaan. Coba lagi nanti.", code: "Kode salah.", expired: "Kode kedaluwarsa. Minta kode baru.", notfound: "Kode undangan tidak ditemukan.", self: "Itu kodemu sendiri 😄", profile: "Isi nama dan bahasa.", net: "Tidak bisa terhubung ke server.", server: "Terjadi kesalahan. Coba lagi.", rate: "Pelan-pelan, kebanyakan pesan dalam 1 menit.", auth: "Sesi habis, silakan masuk lagi.", wpbig: "Foto terlalu besar atau gagal dibaca.", avatar: "Foto ditolak server. Coba foto lain.", avfail: "Foto gagal diproses. Coba foto lain." } },
    en: { t: "Cross-Language Chat", hero: "Chat without language barriers", heroSub: "Write in your language. Your friend reads it in theirs, automatically.", email: "Your email", sendc: "Send sign-in code", sending: "Sending…", code: "6-digit code", login: "Sign in", name: "Your name", mylang: "Your language", mail: "Code sent to", resend: "Resend", resendIn: "Resend in", prof: "New account! Enter your name and language first.", mine: "Your invite code", share: "Share", copy: "Copy", copied: "Copied ✓", addph: "Enter friend's code", add: "Add", none: "No friends yet", noneSub: "Share your invite code or enter a friend's code above.", friends: "Friends", typ: "Type a message…", off: "Disconnected. Reconnecting…", wait: "translating", fail: "translation failed", quota: "translation quota used up this month", retry: "Retry", on: "online", offl: "offline", typing: "typing…", today: "Today", yday: "Yesterday", you: "You", avChange: "Change photo", avK: "Use Kakeibo profile photo", avDel: "Remove photo", avUp: "Uploading…", avShared: "Your chat friends can see this photo.", avLocal: "Your Kakeibo photo is not shared yet. Tap “Use Kakeibo profile photo”.", avNone: "No photo yet. Friends see your initial.", wpUpload: "Upload your own photo", wpBlur: "Blur background", settings: "Settings", profT: "Profile", useK: "Use name from Kakeibo profile", wp: "Chat wallpaper", wpGal: "Photo from gallery", wpDim: "Dim background", wpReset: "Back to default", wpBig: "Photo too large / unreadable", savedP: "Profile saved ✓", langNote: "The new language applies to your next messages.", save: "Save", saved: "Saved ✓", out: "Sign out", outAsk: "Sign out of this account?", outYes: "Yes, sign out", cancel: "Cancel", shareTxt: "Chat with me on Kakeibo, messages are translated automatically! Invite code: ", empty: "No messages yet. Say hi 👋", seesAs: "Read as",
      e: { email: "Invalid email.", wait: "Wait 30 seconds before requesting another code.", limit: "Too many attempts. Try again later.", code: "Wrong code.", expired: "Code expired. Request a new one.", notfound: "Invite code not found.", self: "That's your own code 😄", profile: "Enter a name and language.", net: "Cannot reach the server.", server: "Something went wrong. Try again.", rate: "Slow down, too many messages in a minute.", auth: "Session expired, please sign in again.", wpbig: "Photo too large or unreadable.", avatar: "Photo rejected by the server. Try another.", avfail: "Could not process the photo. Try another." } }
  };
  var COL = ["#ac3527", "#223a5c", "#d9822f", "#4a7c59", "#7a5c9e", "#2f7f8a"];
  var A = { tok: null, user: null }, host, root, view, tmp = {}, ws, peer, msgs = [], me, onl = [], retry = 0, closing = true, rt, pingT, typT, peerTyping = false, peerTypT, contacts = [], cdT, lastTypeSent = 0;
  try { A = Object.assign(A, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  var store = function () { try { localStorage.setItem(KEY, JSON.stringify({ tok: A.tok, user: A.user })); } catch (e) {} };
  var T = function () { return UI[host.lang] || UI.en; };
  var esc = function (s) { return host && host.esc ? host.esc(s) : String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var fl = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? x[1] : String(c || "").toUpperCase(); };
  var ln = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? x[2] : c; };
  var $ = function (s) { return root.querySelector(s); };
  var avCol = function (n) { var h = 0, s = String(n || "?"); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return COL[h % COL.length]; };
  var av = function (n, sz) { return '<span class="kc-av" style="--c:' + avCol(n) + ";width:" + (sz || 42) + "px;height:" + (sz || 42) + "px;font-size:" + Math.round((sz || 42) * .42) + 'px">' + esc(Array.from(String(n || "?"))[0] || "?").toUpperCase() + "</span>"; };
  var kp = function () { try { var p = JSON.parse(localStorage.getItem("jp-finance-profile") || "{}"); return { name: String(p.name || "").trim(), photo: /^data:image\//.test(p.photo || "") ? p.photo : "" }; } catch (e) { return { name: "", photo: "" }; } };
  var avImg = function (src, sz) { return '<span class="kc-av" style="width:' + sz + "px;height:" + sz + 'px;background:#fff"><img src="' + esc(src) + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></span>'; };
  var avP = function (o, sz) { return o && /^data:image\//.test(o.avatar || "") ? avImg(o.avatar, sz) : av(o && o.name, sz); };
  var avMe = function (sz) { var ph = /^data:image\//.test(A.user.avatar || "") ? A.user.avatar : kp().photo; return ph ? avImg(ph, sz) : av(A.user.name, sz); };
  var svgUrl = function (svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29") + '")'; };
  var ring = function (cx, cy) { return [[20, "#cfd9e6"], [15, "#e9eef5"], [10, "#cfd9e6"], [5, "#e9eef5"]].map(function (r) { return "<circle cx='" + cx + "' cy='" + cy + "' r='" + r[0] + "' fill='" + r[1] + "'/>"; }).join(""); };
  var WPS = [
    { id: "washi", n: "Washi", L: [], c: "transparent" },
    { id: "navy", n: "Malam", L: [{ i: "linear-gradient(160deg,#17233d,#2b4470)" }], c: "#17233d" },
    { id: "sakura", n: "Sakura", L: [{ i: "linear-gradient(160deg,#f8e3e8,#efc4d0)" }], c: "#f8e3e8" },
    { id: "matcha", n: "Matcha", L: [{ i: "linear-gradient(160deg,#e3ead3,#bccf9c)" }], c: "#e3ead3" },
    { id: "senja", n: "Senja", L: [{ i: "linear-gradient(160deg,#f6dfbd,#e2a064)" }], c: "#f6dfbd" },
    { id: "seigaiha", n: "Seigaiha", L: [{ i: svgUrl("<svg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'><g stroke='#7c8ba3' stroke-opacity='.55' stroke-width='.8'>" + ring(0, 10) + ring(40, 10) + ring(20, 20) + "</g></svg>"), sz: "40px 20px" }], c: "#dfe6ee" },
    { id: "titik", n: "Titik", L: [{ i: "radial-gradient(circle,rgba(124,139,163,.35) 1.3px,transparent 1.6px)", sz: "18px 18px" }], c: "#ece3ce" },
    { id: "kotak", n: "Kotak", L: [{ i: "linear-gradient(rgba(23,35,61,.07) 1px,transparent 1px)", sz: "22px 22px" }, { i: "linear-gradient(90deg,rgba(23,35,61,.07) 1px,transparent 1px)", sz: "22px 22px" }], c: "#f3ecd9" }
  ];
  var WPKEY = "kakeibo-chat-wp", WP = { id: "washi", dim: 0, blur: 0, img: "" };
  try { WP = Object.assign(WP, JSON.parse(localStorage.getItem(WPKEY) || "{}")); } catch (e) {}
  var saveWp = function () { try { localStorage.setItem(WPKEY, JSON.stringify(WP)); return true; } catch (e) { return false; } };
  function wpSpec(id, img) { // -> { L: [{i,sz,pos,rep}], c }
    if (id === "custom" && img) return { L: [{ i: 'url("' + img + '")', sz: "cover", pos: "center", rep: "no-repeat" }], c: "#17233d" };
    var w = WPS.filter(function (x) { return x.id === id; })[0] || WPS[0]; return { L: w.L, c: w.c };
  }
  function wpText(L, c) { // properti terpisah (bukan shorthand) biar aman di semua browser
    if (!L.length) return "background-image:none;background-color:" + c;
    var f = function (k, d) { return L.map(function (x) { return x[k] || d; }).join(","); };
    return "background-image:" + f("i") + ";background-size:" + f("sz", "auto") + ";background-position:" + f("pos", "0 0") + ";background-repeat:" + f("rep", "repeat") + ";background-color:" + c;
  }
  function applyWp() {
    var el = $("#kcWp"); if (!el) return;
    var sp = wpSpec(WP.id, WP.img), L = sp.L.slice(), d = Math.max(0, Math.min(60, +WP.dim || 0)) / 100;
    if (d) L.unshift({ i: "linear-gradient(rgba(10,14,24," + d + "),rgba(10,14,24," + d + "))", sz: "100% 100%", pos: "0 0", rep: "no-repeat" });
    el.style.cssText = wpText(L, sp.c);
    var bl = Math.max(0, Math.min(12, +WP.blur || 0));
    el.style.filter = bl ? "blur(" + bl + "px)" : ""; el.style.transform = bl ? "scale(1.12)" : "";
  }
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
  function err(e) { var n = $("#kcSheet #kcErr") || $("#kcErr"); if (n) { n.textContent = T().e[e && e.code] || T().e.server; n.classList.add("on"); } }
  function clearErr() { var n = $("#kcSheet #kcErr") || $("#kcErr"); if (n) { n.textContent = ""; n.classList.remove("on"); } }
  function busy(b, on, txt) { if (!b) return; b.disabled = !!on; if (txt != null) b.dataset.t = b.dataset.t || b.textContent; b.textContent = on ? (txt || "…") : (b.dataset.t || b.textContent); }

  function css() {
    if (document.getElementById("chatCss")) return;
    var s = document.createElement("style"); s.id = "chatCss";
    s.textContent = [
      "#kcRoot{position:fixed;inset:0;z-index:70;display:none;justify-content:center;background:rgba(23,35,61,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}#kcRoot.open{display:flex;animation:fadeIn .2s both}",
      ".kc-app{width:100%;max-width:480px;height:100%;height:100dvh;background:var(--washi);display:flex;flex-direction:column;position:relative;overflow:hidden;animation:sheetUp .35s cubic-bezier(.16,1,.3,1) both}",
      ".kc-view{flex:1;min-height:0;display:flex;flex-direction:column;animation:riseIn .3s both}",
      ".kc-head{display:flex;align-items:center;gap:12px;padding:calc(env(safe-area-inset-top,0px) + 10px) 12px 10px;background:var(--ai);color:#f3ecd9;border-bottom:1px solid rgba(243,236,217,.1);position:relative;z-index:2}",
      ".kc-head .ttl{flex:1;min-width:0;font:700 18px 'Shippori Mincho',serif;line-height:1.2;display:flex;align-items:center;flex-wrap:wrap}.kc-head .ttl>span:first-child{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".kc-head .sub{flex:0 0 100%;font:500 12px Inter,sans-serif;color:#aab4c8;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kc-head .sub.on{color:#9fdcb4}.kc-head .sub.on::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:#7fd6a0;margin-right:6px;vertical-align:1px}",
      ".kc-ib{width:44px;height:44px;border-radius:12px;border:1px solid rgba(243,236,217,.2);background:transparent;color:#f3ecd9;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 44px}.kc-ib:active{background:rgba(243,236,217,.14)}",
      ".kc-av{flex:0 0 auto;border-radius:50%;background:var(--c);color:#fff;font-family:'Shippori Mincho',serif;font-weight:800;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 0 0 1.5px rgba(243,236,217,.35)}",
      ".kc-pair{font:700 10px Inter,sans-serif;letter-spacing:.06em;border:1px solid rgba(243,236,217,.32);border-radius:4px;padding:2px 6px;margin-left:10px;white-space:nowrap;color:#d9dfeb}",
      ".kc-scroll{flex:1;min-height:0;overflow-y:auto;padding:18px 16px calc(env(safe-area-inset-bottom,0px) + 20px);-webkit-overflow-scrolling:touch}",
      ".kc-hero{color:var(--sumi);padding:calc(env(safe-area-inset-top,0px) + 16px) 24px 6px;position:relative}.kc-hero .x{position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);right:12px;color:var(--sumi);border-color:var(--line)}.kc-hero .x:active{background:rgba(0,0,0,.05)}",
      ".kc-seal{width:48px;height:48px;border-radius:6px;background:var(--hanko);color:#fbf1e2;display:grid;place-items:center;font:800 27px 'Shippori Mincho',serif;margin-top:8px}",
      ".kc-hero h2{font:800 31px/1.15 'Shippori Mincho',serif;margin:24px 0 10px;color:var(--ai)}.kc-hero p{margin:0;font-size:14px;line-height:1.55;color:#5c6679;max-width:34ch}",
      ".kc-demo{margin-top:22px;display:flex;flex-direction:column;gap:8px}.kc-demo div{max-width:88%;padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.4;opacity:0;animation:riseIn .5s forwards}.kc-demo .l{background:#fffdf6;border:1px solid var(--line);border-bottom-left-radius:4px}.kc-demo .r{align-self:flex-end;background:var(--ai);color:#f3ecd9;border-bottom-right-radius:4px}.kc-demo small{display:block;opacity:.62;font-size:11.5px;margin-top:4px}",
      ".kc-form{padding:24px 24px calc(env(safe-area-inset-bottom,0px) + 24px)}",
      ".kc-in{width:100%;font:inherit;font-size:16px;padding:14px;border-radius:10px;border:1px solid var(--line);background:#fffdf6;color:var(--sumi);margin-bottom:10px;outline:0}.kc-in:focus{border-color:var(--ai);box-shadow:0 0 0 1px var(--ai)}",
      ".kc-otp{text-align:center;font:700 28px 'JetBrains Mono',monospace;letter-spacing:.45em;padding-left:.45em}",
      ".kc-btn{width:100%;padding:14px;border:0;border-radius:10px;background:var(--ai);color:#f3ecd9;font:600 15px Inter,sans-serif;cursor:pointer;min-height:48px}.kc-btn:active{background:var(--ai-2)}.kc-btn:disabled{opacity:.5}.kc-btn.sm{width:auto;padding:11px 16px;font-size:13.5px;min-height:44px}.kc-btn.ghost{background:transparent;color:var(--sumi);border:1px solid var(--line)}.kc-btn.navy{background:var(--ai)}",
      ".kc-note{font-size:13px;color:#5c6679;line-height:1.55;margin:2px 2px 12px}.kc-note b{color:var(--sumi)}.kc-link{background:none;border:0;color:var(--hanko);font:600 13px Inter,sans-serif;cursor:pointer;padding:12px 6px}.kc-link:disabled{color:var(--mist)}",
      "#kcErr{font-size:13px;color:var(--hanko);border:1px solid rgba(172,53,39,.35);border-radius:8px;padding:0 12px;max-height:0;overflow:hidden;opacity:0;transition:all .2s;margin-bottom:0;border-width:0}#kcErr.on{max-height:60px;opacity:1;padding:9px 12px;margin-bottom:10px;border-width:1px}",
      ".kc-lang{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.kc-lang button{border:1px solid var(--line);background:#fffdf6;border-radius:10px;padding:11px 4px;font:500 12px Inter,sans-serif;color:#5c6679;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:56px}.kc-lang button b{font:700 15px Inter,sans-serif;letter-spacing:.06em;color:var(--ai)}.kc-lang button.sel{border:1.5px solid var(--ai);background:#fff;color:var(--ai)}",
      ".kc-inv{background:var(--ai);color:#f3ecd9;border-radius:12px;padding:18px 18px 16px;margin-bottom:18px}.kc-inv .lb{font-size:12.5px;color:#aab4c8}.kc-inv .cd{font:800 32px 'Shippori Mincho',serif;letter-spacing:.2em;margin:6px 0 14px}.kc-inv .row{display:flex;gap:8px}.kc-inv .kc-btn.sm{flex:1;background:transparent;color:#f3ecd9;border:1px solid rgba(243,236,217,.35)}.kc-inv .kc-btn.sm:first-child{background:#f3ecd9;color:var(--ai);border-color:#f3ecd9}",
      ".kc-add{display:flex;gap:8px;margin-bottom:6px}.kc-add .kc-in{margin:0;flex:1;text-transform:uppercase;letter-spacing:.12em;font-weight:600}",
      ".kc-h{font:600 12.5px Inter,sans-serif;color:var(--mist);margin:18px 2px 4px}",
      ".kc-peer{display:flex;align-items:center;gap:14px;width:100%;text-align:left;background:transparent;border:0;border-bottom:1px solid var(--line);border-radius:0;padding:13px 2px;font:inherit;color:inherit;cursor:pointer;min-height:64px}.kc-peer:active{background:rgba(0,0,0,.035)}.kc-peer .mid{flex:1;min-width:0}.kc-peer b{font-size:15.5px;display:flex;align-items:center;gap:8px}.kc-peer .pv{font-size:13px;color:var(--mist);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}.kc-peer .tm{font-size:11.5px;color:var(--mist);align-self:flex-start;margin-top:4px;font-variant-numeric:tabular-nums}",
      ".kc-emp{text-align:center;padding:36px 20px;color:var(--mist)}.kc-emp .ic{display:none}.kc-emp b{display:block;color:var(--ai);font:700 17px 'Shippori Mincho',serif;margin-bottom:6px}.kc-emp span{font-size:13px;line-height:1.55}",
      ".kc-sk{height:64px;border-bottom:1px solid var(--line);background:linear-gradient(90deg,transparent,rgba(0,0,0,.05),transparent);background-size:200% 100%;animation:kcSh 1.4s infinite}@keyframes kcSh{to{background-position:-200% 0}}",
      ".kc-list{flex:1;min-height:0;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:3px;-webkit-overflow-scrolling:touch}",
      ".kc-day{align-self:stretch;display:flex;align-items:center;gap:12px;font:600 11.5px Inter,sans-serif;color:#6b7589;margin:16px 2px 8px}.kc-day::before,.kc-day::after{content:'';flex:1;height:1px;background:var(--line)}",
      ".kc-m{max-width:82%;display:flex;flex-direction:column;animation:riseIn .25s both;margin-top:6px}.kc-m.me{align-self:flex-end;align-items:flex-end}.kc-m.cont{margin-top:0}",
      ".kc-b{padding:10px 13px 9px;border-radius:14px 14px 14px 4px;background:#fffdf6;border:1px solid #ddd2b3;font-size:15px;line-height:1.45;overflow-wrap:anywhere;white-space:pre-wrap}.kc-m.me .kc-b{background:var(--ai);color:#f3ecd9;border-color:var(--ai);border-radius:14px 14px 4px 14px}",
      ".kc-o{font-size:12.5px;line-height:1.45;margin-top:8px;padding-top:8px;border-top:1px solid rgba(42,37,29,.12);color:#5c6679;white-space:pre-wrap}.kc-m.me .kc-o{border-top-color:rgba(243,236,217,.2);color:rgba(243,236,217,.78)}",
      ".kc-cd{font:700 9.5px Inter,sans-serif;font-style:normal;letter-spacing:.06em;border:1px solid currentColor;border-radius:3px;padding:1px 4px;margin-right:7px;vertical-align:1px;opacity:.7}",
      ".kc-st{font-size:12px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(42,37,29,.12);color:var(--mist);display:flex;align-items:center;gap:6px}.kc-st.bad{color:var(--hanko)}.kc-m.me .kc-st{color:#aab4c8;border-top-color:rgba(243,236,217,.2)}.kc-st button{border:0;background:none;color:inherit;text-decoration:underline;font:inherit;cursor:pointer;padding:4px 2px}",
      ".kc-dots{display:inline-flex;gap:3px}.kc-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;animation:kcB 1s infinite}.kc-dots i:nth-child(2){animation-delay:.15s}.kc-dots i:nth-child(3){animation-delay:.3s}@keyframes kcB{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}",
      ".kc-ts{font-size:10.5px;color:var(--mist);margin:3px 4px 0;font-variant-numeric:tabular-nums}",
      ".kc-typ{align-self:flex-start;background:#fffdf6;border:1px solid #ddd2b3;border-radius:14px;padding:9px 13px;color:var(--mist);margin:4px 0}",
      ".kc-bar{background:var(--hanko);color:#fff;font-size:12.5px;text-align:center;padding:6px;font-weight:600}",
      ".kc-comp{display:flex;gap:10px;align-items:flex-end;padding:10px 12px calc(env(safe-area-inset-bottom,0px) + 12px);background:var(--card);border-top:1px solid var(--line)}.kc-comp textarea{flex:1;font:inherit;font-size:16px;line-height:1.35;padding:11px 14px;border-radius:12px;border:1px solid var(--line);resize:none;max-height:120px;background:#fffdf6;color:var(--sumi);outline:0}.kc-comp textarea:focus{border-color:var(--ai);box-shadow:0 0 0 1px var(--ai)}",
      ".kc-send{width:46px;height:46px;border-radius:12px;border:1px solid var(--hanko);background:var(--hanko);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 46px}.kc-send:active{background:var(--hanko-2)}.kc-send:disabled{background:transparent;border-color:var(--line);color:var(--mist)}.kc-send svg{width:22px;height:22px}",
      ".kc-sheet{position:absolute;inset:0;background:rgba(23,35,61,.5);display:flex;align-items:flex-end;z-index:5;animation:fadeIn .2s both}.kc-sheet>div{width:100%;background:var(--washi);border-radius:16px 16px 0 0;padding:10px 18px calc(env(safe-area-inset-bottom,0px) + 20px);max-height:88%;overflow-y:auto;animation:sheetUp .3s cubic-bezier(.16,1,.3,1) both}.kc-sheet .grab{width:36px;height:4px;border-radius:99px;background:var(--line);margin:6px auto 14px}.kc-sheet h3{font:700 19px 'Shippori Mincho',serif;margin:0 0 12px;color:var(--ai)}",
      ".kc-me{display:flex;align-items:center;gap:12px;margin-bottom:14px}.kc-me .em{font-size:12.5px;color:var(--mist);word-break:break-all}",
      ".kc-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;overflow:hidden}.kc-wp{position:absolute;inset:0;z-index:0}.kc-body .kc-list{position:relative;z-index:1}",
      ".kc-emp{background:rgba(251,247,234,.9);border-radius:12px;padding:22px 18px!important;margin:auto 18px!important}",
      ".kc-wps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.kc-wps button{border:0;background:none;padding:0;font:600 11px Inter,sans-serif;color:var(--sumi);cursor:pointer;text-align:center}.kc-wps i{display:block;aspect-ratio:3/4;border-radius:8px;border:1.5px solid var(--line);margin-bottom:5px;background-color:var(--washi-2);background-size:cover;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:22px;overflow:hidden}.kc-wps button.sel i{border-color:var(--ai);box-shadow:0 0 0 1px var(--ai)}",
      ".kc-sheet.clear{background:transparent}.kc-sheet.clear>div{box-shadow:0 -12px 34px rgba(23,35,61,.3);max-height:66%}.kc-rng{width:100%;accent-color:var(--ai);margin:4px 0 14px}.kc-sep{height:1px;background:var(--line);margin:16px 0}",
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
  var SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5.5 11.5 12 5l6.5 6.5"/></svg>';
  function langPicker(sel) { return '<div class="kc-lang" id="kcLangs">' + LG.map(function (l) { return '<button type="button" data-a="pick" data-l="' + l[0] + '" class="' + (l[0] === sel ? "sel" : "") + '"><b>' + l[1] + "</b>" + l[2] + "</button>"; }).join("") + "</div>"; }

  function go(v) {
    if (view === "chat" && v !== "chat") leaveChat();
    clearInterval(cdT);
    view = v; var t = T(), u = A.user, h = "";
    if (v === "login" || v === "code") {
      var demo = '<div class="kc-demo"><div class="l" style="animation-delay:.2s">こんにちは！調子はどう？<small>JA → ID Halo! Apa kabar?</small></div><div class="r" style="animation-delay:.9s">Baik-baik aja, lagi kerja shift malam 😄<small>ID → JA 元気だよ、夜勤中 😄</small></div></div>';
      h = '<div class="kc-scroll" style="padding:0"><div class="kc-hero"><button class="kc-ib x" data-a="close" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="kc-seal">話</div><h2>' + t.hero + "</h2><p>" + t.heroSub + "</p>" + demo + "</div>";
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
      h = '<div class="kc-head"><span data-a="settings" style="cursor:pointer;display:flex">' + avMe(40) + '</span><div class="ttl">' + esc(u.name) + '<div class="sub">' + fl(u.lang) + " " + ln(u.lang) + '</div></div><button class="kc-ib" data-a="settings" aria-label="' + t.settings + '"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg></button><button class="kc-ib" data-a="close" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
        '<div class="kc-scroll"><div class="kc-inv"><div class="lb">' + t.mine + '</div><div class="cd">' + esc(u.invite) + '</div><div class="row"><button class="kc-btn sm" data-a="share">' + t.share + '</button><button class="kc-btn sm" data-a="copy">' + t.copy + '</button></div></div>' +
        '<div class="kc-add"><input class="kc-in" id="kcAdd" maxlength="8" autocapitalize="characters" autocomplete="off" placeholder="' + t.addph + '"><button class="kc-btn sm navy" data-a="add" style="padding:0 18px">' + t.add + '</button></div><div id="kcErr"></div>' +
        '<div class="kc-h">' + t.friends + '</div><div id="kcPeers"><div class="kc-sk"></div><div class="kc-sk"></div></div></div>';
    } else if (v === "chat") {
      h = '<div class="kc-head"><button class="kc-ib" data-a="tocontacts" aria-label="Back"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg></button>' + avP(peer, 40) + '<div class="ttl"><span>' + esc(peer.name) + '</span><span class="kc-pair">' + fl(u.lang) + " ⇄ " + fl(peer.lang) + '</span><div class="sub" id="kcSt">' + t.offl + '</div></div><button class="kc-ib" data-a="wallpaper" aria-label="Wallpaper"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 9"/></svg></button></div>' +
        '<div class="kc-bar" id="kcBar" style="display:none">' + t.off + '</div><div class="kc-body"><div class="kc-wp" id="kcWp"></div><div class="kc-list" id="kcList"></div></div>' +
        '<form class="kc-comp" id="kcForm"><textarea id="kcTxt" rows="1" maxlength="1000" enterkeyhint="send" placeholder="' + t.typ + '"></textarea><button class="kc-send" id="kcSend" aria-label="send" disabled>' + SEND + "</button></form>";
    }
    $(".kc-view").innerHTML = h; $(".kc-view").style.animation = "none"; void $(".kc-view").offsetWidth; $(".kc-view").style.animation = "";
    if (v === "contacts") loadContacts();
    if (v === "code") { startCd(); var c = $("#kcCode"); if (c) setTimeout(function () { c.focus(); }, 250); }
    if (v === "chat") { applyWp(); drawMsgs(true); closing = false; retry = 0; connect(); }
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
        return '<button class="kc-peer" data-a="open" data-i="' + i + '">' + avP(c, 46) + '<span class="mid"><b>' + esc(c.name) + " " + fl(c.lang) + '</b><div class="pv">' + esc(pv) + "</div></span>" + (c.last ? '<span class="tm">' + hm(c.last.ts) + "</span>" : "") + "</button>";
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
      sock.onopen = function () { if (sock !== ws) return; retry = 0; bar(false); };
      sock.onmessage = function (e) {
        if (sock !== ws || e.data === "pong") return;
        var d; try { d = JSON.parse(e.data); } catch (x) { return; }
        if (d.type === "init") {
          me = d.me; var hist = d.history || [], keep = msgs.filter(function (m) { return m.local; });
          msgs = hist; msgs.forEach(watchTr);
          keep = keep.filter(function (l) { return !hist.some(function (h) { return h.uid === me && h.text === l.text && h.ts >= l.ts - 5000; }); });
          keep.forEach(function (l) { l.uid = me; msgs.push(l); });
          online(d.online); flush(); drawMsgs(true);
        } else if (d.type === "online") online(d.online);
        else if (d.type === "typing") { if (d.uid !== me) { peerTyping = true; clearTimeout(peerTypT); peerTypT = setTimeout(function () { peerTyping = false; online(onl); drawMsgs(); }, 3500); online(onl); } }
        else if (d.type === "msg") {
          peerTyping = false; online(onl);
          if (!msgs.some(function (x) { return x.id === d.msg.id; })) {
            var li = -1; if (d.msg.uid === me) msgs.some(function (x, i) { if (x.local && x.text === d.msg.text) { li = i; return true; } });
            if (li >= 0) msgs[li] = d.msg; else msgs.push(d.msg);
            if (d.msg.uid !== me) watchTr(d.msg);
          }
          drawMsgs(d.msg.uid === me);
        }
        else if (d.type === "tr") { var m = msgs.filter(function (x) { return x.id === d.id; })[0]; if (m) { m.tr = m.tr || {}; if (d.text) { m.tr[d.lang] = d.text; delete m.st; } else m.st = d.quota ? "quota" : "fail"; drawMsgs(); } }
        else if (d.type === "error") { var n = $("#kcTxt"); if (n) toast(T().e[d.code] || T().e.server); }
      };
      sock.onclose = function () { if (sock !== ws) return; clearInterval(pingT); if (closing || view !== "chat") return; bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); };
      sock.onerror = function () { try { sock.close(); } catch (e) {} };
    }).catch(function (e) { if (e && e.code === "notfound") return go("contacts"); if (!closing && view === "chat") { bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); } });
  }
  function watchTr(m) { // pesan masuk beda bahasa: kalau 12 dtk terjemahan belum datang, tandai gagal (ada tombol coba lagi)
    if (m.uid === me || m.lang === A.user.lang || (m.tr && m.tr[A.user.lang])) return;
    m.st = "wait"; setTimeout(function () { if (m.st === "wait" && !(m.tr && m.tr[A.user.lang])) { m.st = "fail"; drawMsgs(); } }, 12000);
  }
  function flush() { // kirim pesan yang tertahan saat offline
    if (!ws || ws.readyState !== 1) return;
    msgs.forEach(function (m) { if (m.local && !m.sent) { try { ws.send(JSON.stringify({ text: m.text })); m.sent = true; } catch (e) {} } });
  }
  function leaveChat() { closing = true; clearTimeout(rt); clearInterval(pingT); try { ws && ws.close(); } catch (e) {} ws = null; peerTyping = false; }
  function bar(on) { var b = $("#kcBar"); if (b) b.style.display = on ? "" : "none"; if (!on) flush(); upSend(); }
  function online(a) { onl = a || []; var s = $("#kcSt"); if (!s) return; var on = onl.indexOf(peer.id) >= 0; s.textContent = peerTyping ? T().typing : on ? "● " + T().on : T().offl; s.className = "sub" + (on ? " on" : ""); }
  function upSend() { var s = $("#kcSend"), x = $("#kcTxt"); if (s && x) s.disabled = !x.value.trim(); }
  function toast(msg) { var n = $("#kcErr") || null; if (n) { n.textContent = msg; n.classList.add("on"); } else { var b = $("#kcBar"); if (b) { b.textContent = msg; b.style.display = ""; setTimeout(function () { b.textContent = T().off; if (ws && ws.readyState === 1) b.style.display = "none"; }, 2500); } } }

  function drawMsgs(force) {
    var box = $("#kcList"); if (!box) return;
    var end = force || box.scrollHeight - box.scrollTop - box.clientHeight < 90, t = T(), L = A.user.lang, prev = null, html = "";
    if (!msgs.length) html = '<div class="kc-emp" style="margin:auto"><div class="ic">👋</div><b>' + esc(peer.name) + " " + fl(peer.lang) + "</b><span>" + t.empty + "</span></div>";
    msgs.forEach(function (m, i) {
      var mine = m.uid === me, tgt = mine ? peer.lang : L, tr = m.tr && m.tr[tgt], main = m.text, sub = "";
      if (!prev || dayKey(prev.ts) !== dayKey(m.ts)) html += '<div class="kc-day">' + dayLabel(m.ts) + "</div>";
      if (m.lang !== tgt) {
        if (tr) { if (mine) sub = '<div class="kc-o"><i class="kc-cd">' + fl(tgt) + "</i>" + esc(tr) + "</div>"; else { main = tr; sub = '<div class="kc-o"><i class="kc-cd">' + fl(m.lang) + "</i>" + esc(m.text) + "</div>"; } }
        else if (m.st === "fail" || m.st === "quota") sub = '<div class="kc-st bad">⚠ ' + t[m.st] + (!mine ? ' · <button data-a="retr" data-id="' + esc(m.id) + '">' + t.retry + "</button>" : "") + "</div>";
        else if (!m.local) sub = '<div class="kc-st"><span class="kc-dots"><i></i><i></i><i></i></span>' + t.wait + "</div>";
      }
      var cont = prev && prev.uid === m.uid && dayKey(prev.ts) === dayKey(m.ts) && m.ts - prev.ts < 120000;
      var nx = msgs[i + 1], last = !(nx && nx.uid === m.uid && dayKey(nx.ts) === dayKey(m.ts) && nx.ts - m.ts < 120000);
      html += '<div class="kc-m' + (mine ? " me" : "") + (cont ? " cont" : "") + '"><div class="kc-b">' + esc(main) + sub + "</div>" + (m.local ? '<div class="kc-ts">⏳</div>' : last ? '<div class="kc-ts">' + hm(m.ts) + "</div>" : "") + "</div>";
      prev = m;
    });
    if (peerTyping) html += '<div class="kc-typ"><span class="kc-dots"><i></i><i></i><i></i></span></div>';
    box.innerHTML = html;
    if (end) box.scrollTop = box.scrollHeight;
  }

  /* ---------- pengaturan ---------- */
  function readFile(f, cb) { var rd = new FileReader(); rd.onerror = function () { cb(null); }; rd.onload = function () { cb(rd.result); }; rd.readAsDataURL(f); }
  function loadImg(src, cb) { var im = new Image(); im.onerror = function () { cb(null); }; im.onload = function () { cb(im); }; im.src = src; }
  function squareAvatar(src, cb) { // potong tengah jadi kotak 160px, JPEG; kualitas diturunkan sampai muat (<= ~20 KB)
    loadImg(src, function (im) {
      if (!im) return cb(null);
      var sd = Math.min(im.width, im.height), c = document.createElement("canvas"); c.width = c.height = 160;
      c.getContext("2d").drawImage(im, (im.width - sd) / 2, (im.height - sd) / 2, sd, sd, 0, 0, 160, 160);
      var q = .85, out; do { out = c.toDataURL("image/jpeg", q); q -= .1; } while (out.length > 20000 && q > .25);
      cb(out.length <= 22000 ? out : null);
    });
  }
  function avBlock() {
    var t = T(), u = A.user, shared = /^data:image\//.test(u.avatar || ""), k = kp();
    return '<div style="display:flex;align-items:center;gap:14px">' + avMe(68) + '<div style="flex:1;min-width:0"><div style="display:flex;flex-wrap:wrap;gap:6px"><button class="kc-btn sm ghost" data-a="avfile">📷 ' + t.avChange + "</button>" +
      (k.photo && !shared ? '<button class="kc-btn sm navy" data-a="avk">' + t.avK + "</button>" : "") + (shared ? '<button class="kc-btn sm ghost" data-a="avdel" style="color:var(--hanko)">' + t.avDel + "</button>" : "") + "</div></div></div>" +
      '<div class="kc-note" id="kcAvNote" style="margin:8px 0 12px">' + (shared ? t.avShared : k.photo ? t.avLocal : t.avNone) + '</div><input type="file" id="kcAvFile" accept="image/*" hidden>';
  }
  function avFail() { var b = $("#kcAvBlock"); if (b) b.innerHTML = avBlock(); err({ code: "avfail" }); }
  function sendAvatar(dataUrl) {
    var n = $("#kcAvNote"); if (n) n.textContent = T().avUp; clearErr();
    api("/api/me", { name: A.user.name, lang: A.user.lang, avatar: dataUrl }).then(function (r) {
      A.user = Object.assign(A.user, r.user || { avatar: dataUrl }); store();
      var b = $("#kcAvBlock"); if (b) b.innerHTML = avBlock();
      var h = root.querySelector(".kc-head [data-a=settings]"); if (h) h.innerHTML = avMe(40);
    }).catch(function (x) { var b = $("#kcAvBlock"); if (b) b.innerHTML = avBlock(); err(x); });
  }
  function openSettings() {
    var u = A.user, t = T(), k = kp(), s = document.createElement("div"); s.className = "kc-sheet"; s.id = "kcSheet"; tmp.lang2 = u.lang;
    s.innerHTML = '<div><div class="grab"></div><h3>' + t.settings + '</h3><div id="kcAvBlock">' + avBlock() + '</div><div style="font-size:12.5px;color:var(--mist);margin:-4px 0 12px;word-break:break-all">' + esc(u.email || "") + "</div>" +
      '<div class="kc-note" style="margin-bottom:6px">' + t.name + '</div><input class="kc-in" id="kcPName" maxlength="24" value="' + esc(u.name) + '" placeholder="' + t.name + '">' +
      (k.name && k.name !== u.name ? '<button class="kc-link" style="padding:0 0 10px" data-a="usek" data-n="' + esc(k.name) + '">↺ ' + t.useK + " (" + esc(k.name) + ")</button>" : "") +
      '<div class="kc-note" style="margin-bottom:6px">' + t.mylang + "</div>" + langPicker(u.lang) +
      '<div id="kcErr"></div><button class="kc-btn" data-a="saveprof" data-t="' + t.save + '">' + t.save + '</button>' +
      '<div class="kc-sep"></div><button class="kc-btn ghost" data-a="wallpaper">🎨 ' + t.wp + '</button>' +
      '<button class="kc-btn ghost" style="margin-top:10px;color:var(--hanko)" data-a="logout">' + t.out + '</button><button class="kc-link" style="width:100%;margin-top:6px" data-a="closesheet">' + t.cancel + "</button></div>";
    $(".kc-app").appendChild(s);
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
  }
  function openWallpaper() {
    var t = T(), old = $("#kcSheet"); if (old) old.remove();
    var s = document.createElement("div"); s.className = "kc-sheet" + (view === "chat" ? " clear" : ""); s.id = "kcSheet";
    var tiles = WPS.map(function (w) { return '<button data-a="wp" data-id="' + w.id + '" class="' + (WP.id === w.id ? "sel" : "") + '"><i style="' + (w.L.length ? wpText(w.L, w.c) : "background:var(--washi)") + '"></i>' + w.n + "</button>"; }).join("") +
      (WP.img ? '<button data-a="wp" data-id="custom" class="' + (WP.id === "custom" ? "sel" : "") + '"><i style="' + wpText(wpSpec("custom", WP.img).L, "#17233d") + '"></i>Foto</button>' : "");
    s.innerHTML = '<div><div class="grab"></div><h3>🎨 ' + t.wp + '</h3><button class="kc-btn" data-a="wpfile" style="margin-bottom:14px">📷 ' + t.wpUpload + '</button><div class="kc-wps">' + tiles + '</div>' +
      '<div class="kc-note" style="margin-bottom:0">' + t.wpDim + '</div><input class="kc-rng" id="kcDim" type="range" min="0" max="60" step="5" value="' + (+WP.dim || 0) + '">' +
      '<div class="kc-note" style="margin-bottom:0">' + t.wpBlur + '</div><input class="kc-rng" id="kcBlur" type="range" min="0" max="12" step="1" value="' + (+WP.blur || 0) + '">' +
      '<input type="file" id="kcWpFile" accept="image/*" hidden><div id="kcErr"></div><button class="kc-btn ghost" data-a="wp" data-id="washi">' + t.wpReset + '</button><button class="kc-link" style="width:100%;margin-top:6px" data-a="closesheet">OK</button></div>';
    $(".kc-app").appendChild(s);
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
  }
  function pickWp(id) { WP.id = id; if (id === "washi") { WP.dim = 0; WP.blur = 0; } saveWp(); applyWp(); openWallpaper(); }
  function loadWpFile(f) {
    if (!f) return; clearErr();
    readFile(f, function (src) {
      if (!src) return err({ code: "wpbig" });
      loadImg(src, function (im) {
        if (!im) return err({ code: "wpbig" });
        var sc = Math.min(1, 1100 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.width * sc)); c.height = Math.max(1, Math.round(im.height * sc));
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        var q = .72, out; do { out = c.toDataURL("image/jpeg", q); q -= .1; } while (out.length > 700000 && q > .3);
        var prev = { id: WP.id, img: WP.img }; WP.img = out; WP.id = "custom";
        if (!saveWp()) { WP.id = prev.id; WP.img = prev.img; err({ code: "wpbig" }); return; }
        applyWp(); openWallpaper();
      });
    });
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
    else if (a === "pick") { tmp.lang = tmp.lang2 = b.dataset.l; Array.prototype.forEach.call(b.parentNode.children, function (x) { x.classList.toggle("sel", x === b); }); }
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
        r.user.email = r.user.email || tmp.email; A.tok = r.token; A.user = r.user; store(); tmp = {}; go("contacts");
      }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "relogin") go("login");
    else if (a === "add") {
      var c2 = $("#kcAdd"), code = (c2.value || "").trim(); if (!code) return; clearErr(); busy(b, true, "…");
      api("/api/contacts/add", { code: code }).then(function () { c2.value = ""; busy(b, false); loadContacts(); }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "open") { peer = contacts[+b.dataset.i]; msgs = []; go("chat"); }
    else if (a === "tocontacts") go("contacts");
    else if (a === "settings") openSettings();
    else if (a === "wallpaper") openWallpaper();
    else if (a === "wp") pickWp(b.dataset.id);
    else if (a === "wpfile") { var wf = $("#kcWpFile"); if (wf) wf.click(); }
    else if (a === "avfile") { var af = $("#kcAvFile"); if (af) af.click(); }
    else if (a === "avk") { var ph = kp().photo; if (ph) { var n0 = $("#kcAvNote"); if (n0) n0.textContent = T().avUp; squareAvatar(ph, function (d) { if (d) sendAvatar(d); else avFail(); }); } }
    else if (a === "avdel") sendAvatar("");
    else if (a === "usek") { var pn = $("#kcPName"); if (pn) pn.value = b.dataset.n; }
    else if (a === "saveprof") {
      var nm = ($("#kcPName").value || "").trim(); clearErr();
      if (!nm) return err({ code: "profile" });
      var lg = tmp.lang2 || A.user.lang, chg = lg !== A.user.lang; busy(b, true, "…");
      api("/api/me", { name: nm, lang: lg }).then(function (r) {
        A.user = Object.assign(A.user, r.user || { name: nm, lang: lg }); store();
        busy(b, false); b.textContent = T().savedP;
        setTimeout(function () { var s2 = $("#kcSheet"); if (s2) s2.remove(); if (view === "contacts") go("contacts"); }, 700);
      }).catch(function (x) { busy(b, false); err(x); });
    }
    else if (a === "closesheet") { var s = $("#kcSheet"); if (s) s.remove(); }
    else if (a === "logout") confirmLogout();
    else if (a === "logout2") doLogout();
    else if (a === "retr") { var m = msgs.filter(function (x) { return x.id === b.dataset.id; })[0]; if (m) { m.st = "wait"; drawMsgs(); retry = 0; try { ws && ws.close(); } catch (e) {} connect(); } }
    else if (a === "share" || a === "copy") {
      var txt = T().shareTxt + A.user.invite, link = "https://kakeibo.iranza.com";
      if (a === "share" && navigator.share) navigator.share({ text: txt, url: link }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(txt + " " + link).then(function () { var o = b.textContent; b.textContent = T().copied; setTimeout(function () { b.textContent = o; }, 1500); });
    }
  }
  function onSubmit(e) {
    if (e.target.id !== "kcForm") return; e.preventDefault();
    var i = $("#kcTxt"), v = i.value.trim();
    if (!v) return;
    var m = { id: "l" + Date.now() + Math.random().toString(36).slice(2, 6), uid: me || A.user.id, lang: A.user.lang, text: v, tr: {}, ts: Date.now(), local: true };
    msgs.push(m); i.value = ""; i.style.height = "auto"; drawMsgs(true); flush(); upSend(); i.focus();
  }
  function onInput(e) {
    if (e.target.id === "kcTxt") {
      var i = e.target; i.style.height = "auto"; i.style.height = Math.min(i.scrollHeight, 120) + "px"; upSend();
    } else if (e.target.id === "kcDim") { WP.dim = +e.target.value; applyWp(); }
    else if (e.target.id === "kcBlur") { WP.blur = +e.target.value; applyWp(); }
    else if (e.target.id === "kcCode") { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6); if (e.target.value.length === 6 && !tmp.need) { var b = $('[data-a="ver"]'); if (b) b.click(); } }
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
        root.addEventListener("change", function (e) { if (e.target.id === "kcWpFile") loadWpFile(e.target.files && e.target.files[0]); else if (e.target.id === "kcDim" || e.target.id === "kcBlur") saveWp();
          else if (e.target.id === "kcAvFile") { var f = e.target.files && e.target.files[0]; if (f) { var n1 = $("#kcAvNote"); if (n1) n1.textContent = T().avUp; readFile(f, function (src) { if (!src) return avFail(); squareAvatar(src, function (d) { if (d) sendAvatar(d); else avFail(); }); }); } } });
        document.addEventListener("visibilitychange", function () { if (!document.hidden) onVis(); }); window.addEventListener("online", onVis);
        document.body.appendChild(root);
      }
      root.classList.add("open"); document.body.style.overflow = "hidden";
      go(A.tok && A.user ? "contacts" : "login");
    }
  };
})();
