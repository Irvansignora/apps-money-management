/* Kakeibo · akun, login wajib (Google + kode email) dan paket Gratis / Premium / Premium+.
 * Dimuat langsung dari <head>. Sesi disimpan di key yang sama dengan modul Chat, jadi satu kali login
 * berlaku untuk seluruh app. Data keuangan tetap di HP; akun dipakai untuk chat, paket, dan fitur AI.
 * Dipanggil host: KakeiboAuth.init({ getLang, onChange }) lalu KakeiboAuth.gate(). */
(function () {
  "use strict";
  var API = window.KAKEIBO_CHAT_API || "https://chat.iranza.com", KEY = "kakeibo-chat-auth";
  var cfg = { getLang: function () { return "en"; }, onChange: function () {} };
  var gate = null, gToken = null, gStep = "main", mail = "", clientId = null, gisP = null, ptimer = null;
  var LANGS = [["id", "Bahasa Indonesia"], ["ja", "日本語"], ["en", "English"], ["my", "မြန်မာ"], ["bn", "বাংলা"], ["vi", "Tiếng Việt"], ["th", "ไทย"], ["zh", "中文"], ["ko", "한국어"]];

  var UI = {
    id: { reqBtn: "Saya sudah bayar, ajukan {p}", reqPend: "Permintaan {p} menunggu persetujuan admin.", gT: "Masuk ke Kakeibo", gSub: "Datamu tetap tersimpan di HP. Akun dipakai untuk chat, paket premium, dan fitur AI.", or: "atau pakai email", email: "Alamat email", sendc: "Kirim kode masuk", code: "Kode 6 digit dari email", login: "Masuk", name: "Namamu", lang: "Bahasa utamamu", finish: "Mulai pakai Kakeibo", resend: "Kirim ulang kode", back: "Ganti email", offline: "Butuh internet untuk masuk pertama kali.", sending: "Mengirim…", mailed: "Kode dikirim ke",
      welcome: "Akun baru. Isi nama dan bahasamu dulu.", e: { net: "Tidak bisa terhubung ke server.", email: "Alamat email tidak valid.", code: "Kode salah.", expired: "Kode kedaluwarsa, minta kode baru.", limit: "Terlalu banyak percobaan. Coba lagi nanti.", wait: "Tunggu 30 detik sebelum minta kode baru.", google: "Login Google gagal. Coba lagi atau pakai email.", server: "Terjadi kesalahan. Coba lagi.", auth: "Sesi habis, silakan masuk lagi.", profile: "Isi nama dan bahasa." },
      acct: "Akun dan paket", manage: "Kelola paket", out: "Keluar", outAsk: "Keluar dari akun ini?", outNote: "Data keuangan di HP tidak dihapus.", outYes: "Ya, keluar", cancel: "Batal",
      pFree: "Gratis", pPrem: "Premium", pPlus: "Premium+", cur: "Paket kamu", until: "Aktif sampai", usage: "Pemakaian", uTr: "Terjemahan chat bulan ini", uScan: "Scan AI hari ini", uAi: "Pesan LEA Sensei hari ini",
      fFree: ["Catat keuangan, slip gaji, estimasi pajak", "Scan struk dan slip gaji di HP", "Belajar frasa Jepang dan kuis", "Chat lintas bahasa dasar"],
      fPrem: ["Semua fitur Gratis", "Chat: 5.000 terjemahan per bulan", "Video call, foto dan voice note lebih banyak", "Grup sampai 30 anggota"],
      fPlus: ["Semua fitur Premium", "Scan struk, slip gaji, dan label halal pakai AI, hasil lebih akurat", "LEA Sensei: kaiwa dengan AI dan pelajaran terstruktur", "Koreksi kalimat dan skor tiap pelajaran"],
      upgrade: "Upgrade paket", renew: "Perpanjang paket", noUp: "Pembayaran otomatis belum tersedia. Hubungi admin untuk upgrade, paket dibuka manual setelah pembayaran.", lockT: "Fitur Premium+", lockSub: "Scan dengan AI dan belajar bareng LEA Sensei hanya terbuka untuk pengguna Premium+.", see: "Lihat Premium+", later: "Nanti", close: "Tutup", acctNone: "Belum masuk" },
    en: { reqBtn: "I have paid, request {p}", reqPend: "Your {p} request is waiting for admin approval.", gT: "Sign in to Kakeibo", gSub: "Your money data stays on your phone. An account is used for chat, premium plans and AI features.", or: "or use email", email: "Email address", sendc: "Send sign-in code", code: "6-digit code from email", login: "Sign in", name: "Your name", lang: "Your main language", finish: "Start using Kakeibo", resend: "Resend code", back: "Change email", offline: "You need internet to sign in the first time.", sending: "Sending…", mailed: "Code sent to",
      welcome: "New account. Add your name and language first.", e: { net: "Cannot reach the server.", email: "Invalid email address.", code: "Wrong code.", expired: "Code expired, request a new one.", limit: "Too many attempts. Try again later.", wait: "Wait 30 seconds before requesting a new code.", google: "Google sign-in failed. Try again or use email.", server: "Something went wrong. Try again.", auth: "Session expired, please sign in again.", profile: "Enter a name and language." },
      acct: "Account and plan", manage: "Manage plan", out: "Sign out", outAsk: "Sign out of this account?", outNote: "Money data on this phone is not deleted.", outYes: "Yes, sign out", cancel: "Cancel",
      pFree: "Free", pPrem: "Premium", pPlus: "Premium+", cur: "Your plan", until: "Active until", usage: "Usage", uTr: "Chat translations this month", uScan: "AI scans today", uAi: "LEA Sensei messages today",
      fFree: ["Track money, payslips, tax estimates", "Scan receipts and payslips on your phone", "Japanese phrases and quizzes", "Basic cross-language chat"],
      fPrem: ["Everything in Free", "Chat: 5,000 translations per month", "Video calls, more photos and voice notes", "Groups of up to 30 people"],
      fPlus: ["Everything in Premium", "AI scanning for receipts, payslips and halal labels, more accurate", "LEA Sensei: conversation practice with AI and structured lessons", "Sentence corrections and a score for each lesson"],
      upgrade: "Upgrade plan", renew: "Renew plan", noUp: "Automatic payment is not available yet. Contact the admin to upgrade; your plan is unlocked manually after payment.", lockT: "Premium+ feature", lockSub: "AI scanning and learning with LEA Sensei are only available on Premium+.", see: "See Premium+", later: "Not now", close: "Close", acctNone: "Not signed in" },
    my: { reqBtn: "ငွေပေးချေပြီးပါပြီ၊ {p} တောင်းဆိုမည်", reqPend: "{p} တောင်းဆိုမှုကို admin အတည်ပြုရန် စောင့်နေသည်။", gT: "Kakeibo သို့ ဝင်ရောက်ရန်", gSub: "သင့်ငွေကြေးဒေတာသည် ဖုန်းထဲတွင်ပင် ရှိနေမည်။ အကောင့်ကို ချက်တ်၊ premium အစီအစဉ်နှင့် AI လုပ်ဆောင်ချက်များအတွက် သုံးသည်။", or: "သို့မဟုတ် အီးမေးလ်သုံးပါ", email: "အီးမေးလ်လိပ်စာ", sendc: "ဝင်ရောက်ရန်ကုဒ် ပို့ရန်", code: "အီးမေးလ်မှ ဂဏန်း ၆ လုံးကုဒ်", login: "ဝင်ရောက်ရန်", name: "သင့်အမည်", lang: "သင့်အဓိကဘာသာစကား", finish: "Kakeibo စတင်သုံးရန်", resend: "ကုဒ်ပြန်ပို့ရန်", back: "အီးမေးလ်ပြောင်းရန်", offline: "ပထမဆုံးအကြိမ် ဝင်ရောက်ရန် အင်တာနက်လိုအပ်သည်။", sending: "ပို့နေသည်…", mailed: "ကုဒ်ပို့ပြီး —",
      welcome: "အကောင့်အသစ်။ အမည်နှင့် ဘာသာစကား အရင်ထည့်ပါ။", e: { net: "ဆာဗာသို့ ချိတ်ဆက်၍မရပါ။", email: "အီးမေးလ် မမှန်ပါ။", code: "ကုဒ် မမှန်ပါ။", expired: "ကုဒ် သက်တမ်းကုန်သွားပြီ။ အသစ်တောင်းပါ။", limit: "ကြိုးစားမှု များလွန်းသည်။ နောက်မှ ထပ်ကြိုးစားပါ။", wait: "ကုဒ်အသစ်မတောင်းမီ စက္ကန့် ၃၀ စောင့်ပါ။", google: "Google ဖြင့် ဝင်၍မရပါ။ ထပ်ကြိုးစားပါ သို့မဟုတ် အီးမေးလ်သုံးပါ။", server: "တစ်ခုခုမှားသွားသည်။ ထပ်ကြိုးစားပါ။", auth: "အချိန်ကုန်သွားပြီ၊ ပြန်ဝင်ပါ။", profile: "အမည်နှင့် ဘာသာစကား ထည့်ပါ။" },
      acct: "အကောင့်နှင့် အစီအစဉ်", manage: "အစီအစဉ် စီမံရန်", out: "ထွက်ရန်", outAsk: "ဤအကောင့်မှ ထွက်မလား?", outNote: "ဖုန်းထဲရှိ ငွေကြေးဒေတာ မဖျက်ပါ။", outYes: "ဟုတ်ကဲ့၊ ထွက်မည်", cancel: "မလုပ်တော့ပါ",
      pFree: "အခမဲ့", pPrem: "Premium", pPlus: "Premium+", cur: "သင့်အစီအစဉ်", until: "သက်တမ်းကုန်ရက်", usage: "အသုံးပြုမှု", uTr: "ဤလ ချက်တ်ဘာသာပြန်ချက်", uScan: "ယနေ့ AI စကန်", uAi: "ယနေ့ LEA Sensei မက်ဆေ့ချ်",
      fFree: ["ငွေစာရင်း၊ လစာစလစ်၊ အခွန်ခန့်မှန်းချက်", "ဖုန်းပေါ်တွင် ဘောက်ချာနှင့် လစာစလစ် စကန်", "ဂျပန်စကားစု သင်ယူမှုနှင့် ပဟေဠိ", "ဘာသာစုံ ချက်တ် အခြေခံ"],
      fPrem: ["အခမဲ့ရှိသမျှ", "ချက်တ်: တစ်လလျှင် ဘာသာပြန်ချက် ၅,၀၀၀", "ဗီဒီယိုခေါ်ဆိုမှု၊ ဓာတ်ပုံနှင့် အသံမက်ဆေ့ချ် ပိုများ", "အုပ်စုတစ်ခု ၃၀ ယောက်အထိ"],
      fPlus: ["Premium ရှိသမျှ", "ဘောက်ချာ၊ လစာစလစ်၊ ဟလာလ်တံဆိပ်ကို AI ဖြင့် စကန် (ပိုတိကျ)", "LEA Sensei: AI နှင့် စကားပြောလေ့ကျင့်ခြင်းနှင့် အဆင့်လိုက်သင်ခန်းစာ", "ဝါကျပြင်ပေးမှုနှင့် သင်ခန်းစာတိုင်း အမှတ်"],
      upgrade: "အစီအစဉ်မြှင့်ရန်", renew: "အစီအစဉ် သက်တမ်းတိုးရန်", noUp: "အလိုအလျောက်ငွေပေးချေမှု မရသေးပါ။ အက်ဒမင်ကို ဆက်သွယ်ပါ၊ ငွေပေးချေပြီးနောက် ကိုယ်တိုင်ဖွင့်ပေးမည်။", lockT: "Premium+ လုပ်ဆောင်ချက်", lockSub: "AI စကန်နှင့် LEA Sensei ဖြင့် သင်ယူခြင်းသည် Premium+ အတွက်သာ ဖြစ်သည်။", see: "Premium+ ကြည့်ရန်", later: "နောက်မှ", close: "ပိတ်ရန်", acctNone: "မဝင်ရသေးပါ" }
  };
  var L = function () { return cfg.getLang() || "en"; };
  var T = function () { var b = UI.en, o = UI[L()]; return o ? Object.assign({}, b, o, { e: Object.assign({}, b.e, o.e) }) : b; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- sesi ---------- */
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify({ tok: s.tok || null, user: s.user || null })); } catch (e) {} }
  var user = function () { return read().user || null; };
  var plan = function () { var u = user(), p = u && u.plan; if (u && u.until && u.until < Date.now()) return "free"; return p === "plus" || p === "premium" ? p : "free"; };
  var isPlus = function () { return plan() === "plus"; };
  var planName = function (p) { var t = T(); return p === "plus" ? t.pPlus : p === "premium" ? t.pPrem : t.pFree; };

  function api(path, body) {
    var s = read();
    return fetch(API + path, { method: body !== undefined ? "POST" : "GET", headers: Object.assign({ "content-type": "application/json" }, s.tok ? { authorization: "Bearer " + s.tok } : {}), body: body !== undefined ? JSON.stringify(body) : undefined })
      .catch(function () { throw { code: "net" }; })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.status === 401 && s.tok) { dropSession(); }
          if (!r.ok) throw { code: j.error || "server", what: j.what, max: j.max, status: r.status };
          return j;
        });
      });
  }
  function blob(path, body) { // untuk respons biner (suara LEA); gagal = lempar error supaya pemanggil bisa fallback
    var s = read();
    return fetch(API + path, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + (s.tok || "") }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw { code: "tts", status: r.status }; return r.blob(); });
  }
  function dropSession() { write({}); closeSheets(); try { if (window.KakeiboChat && window.KakeiboChat.isOpen()) window.KakeiboChat.close(); } catch (e) {} showGate(); cfg.onChange(); }
  function refresh() { // segarkan paket dari server; gagal jaringan = diam saja (app tetap bisa dipakai offline)
    if (!read().tok) return Promise.resolve(null);
    return api("/api/me").then(function (r) { var s = read(); if (r.user) { s.user = Object.assign({}, s.user, r.user); write(s); cfg.onChange(); } return s.user; }).catch(function () { return null; });
  }

  /* ---------- gaya ---------- */
  function css() {
    if ($("#kkAuthCss")) return;
    var s = document.createElement("style"); s.id = "kkAuthCss";
    s.textContent = [
      ".kk-gate{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;background:radial-gradient(95% 58% at 6% 20%,var(--s1,transparent) 0%,transparent 74%),radial-gradient(90% 62% at 100% 52%,var(--s2,transparent) 0%,transparent 74%),var(--washi,#ece3ce);font-family:Inter,sans-serif;color:var(--sumi,#2a251d)}",
      ".kk-card{width:100%;max-width:400px;background:var(--card,#fbf7ea);border:1px solid var(--line,rgba(122,110,80,.24));border-radius:26px;padding:28px 22px 22px;box-shadow:0 24px 50px -24px rgba(23,35,61,.45);text-align:center}",
      ".kk-seal{width:60px;height:60px;border-radius:16px;margin:0 auto 14px;display:grid;place-items:center;background:linear-gradient(150deg,var(--hanko-2,#c9432f),var(--hanko,#ac3527));color:#fff5e8;font:800 28px 'Shippori Mincho',serif;box-shadow:0 12px 22px -10px rgba(172,53,39,.6)}",
      ".kk-card h1{font:800 24px/1.2 'Shippori Mincho',serif;margin:0 0 8px;color:var(--ai,#17233d)}.kk-card p{font-size:13.5px;line-height:1.55;color:var(--mist,#6d6759);margin:0 0 18px}",
      ".kk-in{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:13px 14px;border-radius:14px;border:1px solid var(--line,rgba(122,110,80,.3));background:#fff;color:inherit;margin-bottom:10px;outline:0}.kk-in:focus{border-color:var(--ai-2,#223a5c);box-shadow:0 0 0 1px var(--ai-2,#223a5c)}",
      ".kk-btn{display:block;width:100%;box-sizing:border-box;border:0;border-radius:14px;padding:14px;font:600 15px Inter,sans-serif;color:#f6efdc;cursor:pointer;background:linear-gradient(135deg,var(--ai-2,#223a5c),var(--ai,#17233d) 58%,rgba(172,53,39,.92) 180%);box-shadow:0 12px 24px -12px rgba(172,53,39,.7);text-align:center;text-decoration:none}.kk-btn:disabled{opacity:.55}.kk-btn.ghost{background:#e8dfc8;color:var(--ai-2,#223a5c);box-shadow:none}.kk-btn.danger{background:#b3261e;box-shadow:none}.kk-btn+.kk-btn{margin-top:8px}",
      ".kk-or{display:flex;align-items:center;gap:10px;color:var(--mist,#6d6759);font-size:12px;margin:14px 0}.kk-or::before,.kk-or::after{content:'';flex:1;height:1px;background:var(--line,rgba(122,110,80,.3))}",
      ".kk-gbtn{display:flex;justify-content:center;min-height:44px}.kk-err{min-height:18px;margin-top:10px;font-size:13px;color:#b3261e}.kk-link{background:none;border:0;color:var(--hanko,#ac3527);font:600 13px Inter,sans-serif;cursor:pointer;padding:10px 6px}.kk-note{font-size:12px;color:var(--mist,#6d6759);margin-top:10px}",
      ".kk-sheet{position:fixed;inset:0;z-index:85;background:rgba(23,35,61,.5);display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .2s both;font-family:Inter,sans-serif}.kk-sheet>div{width:100%;max-width:480px;max-height:92dvh;overflow-y:auto;background:var(--card,#fbf7ea);color:var(--sumi,#2a251d);border-radius:26px 26px 0 0;padding:10px 18px calc(22px + env(safe-area-inset-bottom,0px));animation:sheetUp .3s cubic-bezier(.16,1,.3,1) both}",
      ".kk-sheet .grab{width:42px;height:4px;border-radius:2px;background:rgba(122,110,80,.4);margin:6px auto 14px}.kk-sheet h3{font:800 20px 'Shippori Mincho',serif;margin:0 0 6px;color:var(--ai,#17233d)}.kk-sheet .sub{font-size:13px;color:var(--mist,#6d6759);margin:0 0 14px;line-height:1.5}",
      ".kk-plan{border:1px solid var(--line,rgba(122,110,80,.3));border-radius:18px;padding:14px;margin-bottom:10px;background:#fff}.kk-plan.cur{border:2px solid var(--hanko,#ac3527)}.kk-plan.plus{background:linear-gradient(135deg,var(--ai-2,#223a5c),var(--ai,#17233d) 62%,rgba(172,53,39,.9) 190%);color:#f6efdc;border-color:transparent}",
      ".kk-plan .hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.kk-plan .nm{font:800 17px 'Shippori Mincho',serif}.kk-tag{font:700 10.5px Inter,sans-serif;background:var(--hanko,#ac3527);color:#fff;border-radius:99px;padding:3px 9px}",
      ".kk-plan .pr{margin:-2px 0 10px;display:flex;align-items:baseline;gap:3px}.kk-plan .pr b{font:800 24px Inter,sans-serif;letter-spacing:-.02em}.kk-plan .pr span{font-size:12.5px;opacity:.75}.kk-plan.plus .pr b{color:#f0b36a}",
      ".ab-plans .sub{font-size:13px;color:var(--mist,#6d6759);margin:0 0 14px;line-height:1.5}",
      ".kk-plan ul{list-style:none;margin:0;padding:0}.kk-plan li{font-size:13px;line-height:1.45;padding:3px 0 3px 18px;position:relative}.kk-plan li::before{content:'';position:absolute;left:2px;top:9px;width:7px;height:7px;border-radius:50%;background:var(--hanko,#ac3527)}.kk-plan.plus li::before{background:#f0b36a}",
      ".kk-um{margin:8px 0}.kk-um .r{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px}.kk-um .b{height:6px;border-radius:3px;background:rgba(122,110,80,.2);overflow:hidden}.kk-um .b i{display:block;height:100%;background:var(--hanko,#ac3527)}",
      ".kk-chip{display:inline-block;font:700 11px Inter,sans-serif;border-radius:99px;padding:3px 10px;background:#e8dfc8;color:var(--ai-2,#223a5c);margin-left:8px}.kk-chip.premium{background:#f0b36a;color:#5a2d0c}.kk-chip.plus{background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff}",
      ".kk-acct{display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:12px;font-size:14px;word-break:break-all}.kk-row{display:flex;gap:8px}.kk-row .kk-btn{margin:0;padding:11px;font-size:13.5px}",
      "@media (min-width:600px){.kk-sheet{align-items:center}.kk-sheet>div{border-radius:26px}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---------- layar login wajib ---------- */
  function setErr(code) { var n = $("#kkErr"); if (n) n.textContent = code ? (T().e[code] || T().e.server) : ""; }
  function busy(b, on, txt) { if (!b) return; if (on) { b.dataset.t = b.textContent; b.textContent = txt || "…"; b.disabled = true; } else { b.disabled = false; if (b.dataset.t) b.textContent = b.dataset.t; } }
  function lockApp(on) { var a = document.getElementById("app"); if (a) { if (on) a.setAttribute("inert", ""); else a.removeAttribute("inert"); } }
  function loadGis() {
    if (gisP) return gisP;
    gisP = new Promise(function (res, rej) {
      if (window.google && window.google.accounts && window.google.accounts.id) return res();
      var sc = document.createElement("script"); sc.src = "https://accounts.google.com/gsi/client"; sc.async = true; sc.onload = function () { res(); }; sc.onerror = function () { gisP = null; rej(); };
      document.head.appendChild(sc);
    });
    return gisP;
  }
  function mountGoogle() {
    var box = $("#kkGBtn"); if (!box || !clientId) return;
    loadGis().then(function () {
      var g = window.google.accounts.id;
      g.initialize({ client_id: clientId, callback: function (resp) { gToken = resp.credential; submitGoogle(); }, auto_select: false, cancel_on_tap_outside: true });
      box.innerHTML = ""; g.renderButton(box, { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: Math.min(300, box.clientWidth || 300), locale: L() });
    }).catch(function () { box.innerHTML = ""; });
  }
  function langOptions() { var cur = L(); if (!LANGS.some(function (x) { return x[0] === cur; })) cur = "en"; return LANGS.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === cur ? " selected" : "") + ">" + esc(x[1]) + "</option>"; }).join(""); }
  function drawGate(prefName) {
    if (!gate) return; var t = T(), h = '<div class="kk-card"><div class="kk-seal">帳</div><h1>' + esc(t.gT) + "</h1>";
    if (gStep === "main") h += "<p>" + esc(t.gSub) + '</p><div class="kk-gbtn" id="kkGBtn"></div>' + (clientId ? '<div class="kk-or">' + esc(t.or) + "</div>" : "") + '<input class="kk-in" id="kkEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off" placeholder="' + esc(t.email) + '" value="' + esc(mail) + '"><button class="kk-btn" data-kk="req">' + esc(t.sendc) + "</button>" + (navigator.onLine === false ? '<div class="kk-note">' + esc(t.offline) + "</div>" : "");
    else if (gStep === "code") h += "<p>" + esc(t.mailed) + " <b>" + esc(mail) + '</b></p><input class="kk-in" id="kkCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="' + esc(t.code) + '" style="text-align:center;letter-spacing:.3em"><button class="kk-btn" data-kk="ver">' + esc(t.login) + '</button><button class="kk-link" data-kk="req2">' + esc(t.resend) + '</button><button class="kk-link" data-kk="back">' + esc(t.back) + "</button>";
    else h += "<p>" + esc(t.welcome) + '</p><input class="kk-in" id="kkName" maxlength="24" placeholder="' + esc(t.name) + '" value="' + esc(prefName || "") + '"><select class="kk-in" id="kkLang" aria-label="' + esc(t.lang) + '">' + langOptions() + '</select><button class="kk-btn" data-kk="finish">' + esc(t.finish) + "</button>";
    gate.innerHTML = h + '<div class="kk-err" id="kkErr" role="alert"></div></div>';
    if (gStep === "main") mountGoogle();
    var f = $("#kkEmail") || $("#kkCode") || $("#kkName"); if (f && gStep !== "main") setTimeout(function () { f.focus(); }, 120);
  }
  function showGate() {
    css(); if (gate) return;
    gate = document.createElement("div"); gate.id = "kkGate"; gate.className = "kk-gate"; gate.setAttribute("role", "dialog"); gate.setAttribute("aria-modal", "true");
    document.body.appendChild(gate); lockApp(true); gStep = "main"; gToken = null; drawGate();
    if (clientId === null) fetch(API + "/api/config").then(function (r) { return r.json(); }).then(function (c) { clientId = c.google_client_id || ""; if (gate && gStep === "main") drawGate(); }).catch(function () { clientId = ""; if (gate && gStep === "main") drawGate(); });
  }
  function hideGate() { if (gate) { gate.remove(); gate = null; } lockApp(false); }
  function success(r) { write({ tok: r.token, user: r.user }); hideGate(); cfg.onChange(); try { window.dispatchEvent(new CustomEvent("kakeibo-auth", { detail: { user: r.user } })); } catch (e) {} }
  function submitGoogle(extra) {
    var b = $('[data-kk="finish"]');
    api("/api/auth/google", Object.assign({ credential: gToken }, extra || {})).then(function (r) {
      if (r.need_profile) { gStep = "profile"; drawGate(r.name); return; }
      success(r);
    }).catch(function (e) { busy(b, false); setErr(e.code === "google" || e.code === "net" ? e.code : "google"); });
  }
  function reqCode(b) {
    var em = ($("#kkEmail") ? $("#kkEmail").value : mail).trim().toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(em)) return setErr("email");
    mail = em; setErr(""); busy(b, true, T().sending);
    api("/api/auth/request", { email: em }).then(function () { gStep = "code"; drawGate(); }).catch(function (e) { busy(b, false); setErr(e.code); });
  }
  function onGateClick(b) {
    var a = b.dataset.kk;
    if (a === "req") reqCode(b);
    else if (a === "req2") { b.disabled = true; api("/api/auth/request", { email: mail }).then(function () { b.disabled = false; setErr(""); }).catch(function (e) { b.disabled = false; setErr(e.code); }); }
    else if (a === "back") { gStep = "main"; drawGate(); }
    else if (a === "ver") {
      var code = ($("#kkCode").value || "").trim(); if (!code) return; setErr(""); busy(b, true);
      api("/api/auth/verify", { email: mail, code: code }).then(function (r) { if (r.need_profile) { gStep = "profile"; gToken = null; drawGate(""); return; } success(r); }).catch(function (e) { busy(b, false); setErr(e.code); });
    } else if (a === "finish") {
      var name = ($("#kkName").value || "").trim(), lang = $("#kkLang").value; if (!name) return setErr("profile"); setErr(""); busy(b, true);
      if (gToken) return submitGoogle({ name: name, lang: lang });
      api("/api/auth/verify", { email: mail, code: tmpCode, name: name, lang: lang }).then(success).catch(function (e) { busy(b, false); setErr(e.code); });
    }
  }
  var tmpCode = "";

  /* ---------- popup: paket, konfirmasi keluar, kunci Premium+ ---------- */
  function closeSheets() { var s = document.querySelectorAll(".kk-sheet"); for (var i = 0; i < s.length; i++) s[i].remove(); }
  function sheet(inner) {
    css(); closeSheets();
    var s = document.createElement("div"); s.className = "kk-sheet"; s.innerHTML = '<div role="dialog" aria-modal="true"><div class="grab"></div>' + inner + "</div>";
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
    document.body.appendChild(s); return s;
  }
  var PRICE = { premium: 1000, plus: 1500 }; // yen per bulan
  var PER = { id: "/bulan", en: "/month", my: "/လ", bn: "/মাস", vi: "/tháng", th: "/เดือน" };
  function priceRow(id) { if (!PRICE[id]) return ""; return '<div class="pr"><b>¥' + PRICE[id].toLocaleString("en-US") + "</b><span>" + esc(PER[L()] || PER.en) + "</span></div>"; }
  function planCard(id, cur, nm, list) { return '<div class="kk-plan ' + id + (cur === id ? " cur" : "") + '"><div class="hd"><span class="nm">' + esc(nm) + "</span>" + (cur === id ? '<span class="kk-tag">' + esc(T().cur) + "</span>" : "") + "</div>" + priceRow(id) + "<ul>" + list.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"; }
  function bar(lb, used, max) { var p = Math.min(100, Math.round(used / Math.max(1, max) * 100)); return '<div class="kk-um"><div class="r"><span>' + esc(lb) + "</span><b>" + used + " / " + max + '</b></div><div class="b"><i style="width:' + p + '%"></i></div></div>'; }
  function plansHtml() { // dipakai popup paket dan halaman Upgrade
    css(); var t = T(), cur = plan();
    return '<div id="kkUse"></div>' + planCard("free", cur, t.pFree, t.fFree) + planCard("premium", cur, t.pPrem, t.fPrem) + planCard("plus", cur, t.pPlus, t.fPlus) + '<div id="kkUp"></div>';
  }
  function hydratePlans(root) { // isi pemakaian, penanda paket aktif, dan tombol upgrade dari server
    var t = T();
    api("/api/usage").then(function (u) {
      if (!document.body.contains(root)) return;
      var p = u.plan; var st = read(); if (st.user && (st.user.plan !== p || st.user.until !== u.until)) { st.user.plan = p; st.user.until = u.until; write(st); cfg.onChange(); }
      var h = "";
      if (u.until && p !== "free") h += '<div class="sub">' + esc(t.until) + " " + esc(new Date(u.until).toLocaleDateString(L())) + "</div>";
      h += "<b style='font-size:13px'>" + esc(t.usage) + "</b>" + bar(t.uTr, u.used.tr, u.limits.tr) + (p === "plus" ? bar(t.uScan, u.used.aiScanDay || 0, u.limits.aiScanDay) + bar(t.uAi, u.used.aiChatDay || 0, u.limits.aiChatDay) : "");
      var use = $("#kkUse", root); if (use) use.innerHTML = h + "<div style='height:8px'></div>";
      root.querySelectorAll(".kk-plan").forEach(function (c) { c.classList.toggle("cur", c.classList.contains(p)); var tg = c.querySelector(".kk-tag"); if (tg) tg.remove(); if (c.classList.contains(p)) c.querySelector(".hd").insertAdjacentHTML("beforeend", '<span class="kk-tag">' + esc(t.cur) + "</span>"); });
      var up = $("#kkUp", root);
      if (up) {
        var rq = "";
        if (u.pending) rq = '<div class="sub" style="margin-top:8px"><b>' + esc(t.reqPend.replace("{p}", u.pending === "plus" ? t.pPlus : t.pPrem)) + "</b></div>";
        else if (p !== "plus") rq = (p === "free" ? '<button class="kk-btn ghost" data-rq="premium" style="margin-top:8px">' + esc(t.reqBtn.replace("{p}", t.pPrem)) + "</button>" : "") + '<button class="kk-btn ghost" data-rq="plus" style="margin-top:8px">' + esc(t.reqBtn.replace("{p}", t.pPlus)) + "</button>";
        up.innerHTML = (u.upgrade_url ? '<a class="kk-btn" href="' + esc(u.upgrade_url) + '" target="_blank" rel="noopener noreferrer">' + esc(p === "plus" ? t.renew : t.upgrade) + "</a>" : (p === "plus" ? "" : '<div class="sub" style="margin-top:4px">' + esc(t.noUp) + "</div>")) + rq;
        up.querySelectorAll("[data-rq]").forEach(function (b) {
          b.onclick = function () { b.disabled = true; api("/api/plan/request", { plan: b.getAttribute("data-rq") }).then(function () { hydratePlans(root); }).catch(function () { b.disabled = false; }); };
        });
      }
    }).catch(function () {});
  }
  function openPlan() {
    var t = T(), s = sheet("<h3>" + esc(t.acct) + '</h3><div class="sub" id="kkPSub">' + esc((user() && user().email) || "") + "</div>" + plansHtml() + '<button class="kk-btn ghost" data-kk="close" style="margin-top:6px">' + esc(t.close) + "</button>");
    hydratePlans(s);
  }
  function confirmOut() { var t = T(); sheet("<h3>" + esc(t.outAsk) + '</h3><div class="sub">' + esc(t.outNote) + '</div><button class="kk-btn danger" data-kk="out2">' + esc(t.outYes) + '</button><button class="kk-btn ghost" data-kk="close">' + esc(t.cancel) + "</button>"); }
  function logout() { var s = read(); if (s.tok) fetch(API + "/api/auth/logout", { method: "POST", headers: { authorization: "Bearer " + s.tok, "content-type": "application/json" }, body: "{}" }).catch(function () {}); dropSession(); }
  function lock() { var t = T(); sheet("<h3>" + esc(t.lockT) + '</h3><div class="sub">' + esc(t.lockSub) + '</div><button class="kk-btn" data-kk="plan">' + esc(t.see) + '</button><button class="kk-btn ghost" data-kk="close">' + esc(t.later) + "</button>"); }

  /* ---------- API untuk host ---------- */
  function accountCard() { // HTML kartu "Akun dan paket" untuk halaman profil
    var u = user(); if (!u) return ""; var t = T(), p = plan();
    return '<section class="pcard"><div class="pcard-title display">' + esc(t.acct) + '</div><div class="kk-acct"><b>' + esc(u.email || u.name || "") + '</b><span class="kk-chip ' + p + '">' + esc(planName(p)) + '</span></div><div class="kk-row"><button type="button" class="kk-btn" data-kk="plan">' + esc(t.manage) + '</button><button type="button" class="kk-btn ghost" data-kk="logout">' + esc(t.out) + "</button></div></section>";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-kk]"); if (!b) return; var a = b.dataset.kk;
    if (gate && gate.contains(b)) return onGateClick(b);
    if (a === "plan") openPlan(); else if (a === "logout") confirmOut(); else if (a === "out2") logout(); else if (a === "close") closeSheets();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || !gate) return; var id = e.target && e.target.id;
    if (id === "kkEmail") { e.preventDefault(); var b = $('[data-kk="req"]'); if (b) b.click(); } else if (id === "kkCode") { e.preventDefault(); var v = $('[data-kk="ver"]'); if (v) v.click(); } else if (id === "kkName") { e.preventDefault(); var f = $('[data-kk="finish"]'); if (f) f.click(); }
  });
  // kode dari langkah "code" dipakai lagi saat akun baru perlu mengisi profil
  document.addEventListener("input", function (e) { if (e.target && e.target.id === "kkCode") tmpCode = e.target.value.trim(); });

  window.KakeiboAuth = {
    init: function (o) { cfg = Object.assign(cfg, o || {}); },
    gate: function () { // dipanggil sekali saat app siap: tanpa sesi = layar login; dengan sesi = lanjut (offline tetap bisa) + segarkan paket
      if (!read().tok || !user()) showGate(); else { refresh(); }
    },
    user: user, plan: plan, isPlus: isPlus, isPaid: function () { return plan() !== "free"; }, planName: planName,
    api: api, blob: blob, refresh: refresh, openPlan: openPlan, plansHtml: plansHtml, hydratePlans: hydratePlans, logout: logout, accountCard: accountCard,
    require: function (cb) { if (isPlus()) return cb && cb(); lock(); }, // gerbang fitur Premium+
    back: function () { if (gate) return true; var s = document.querySelector(".kk-sheet"); if (s) { s.remove(); return true; } return false; },
    onLogout: function () { if (!read().tok) { closeSheets(); showGate(); cfg.onChange(); } } // dipanggil modul Chat saat sesi berakhir
  };
})();
