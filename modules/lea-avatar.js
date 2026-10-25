/* Karakter animasi LEA Sensei (SVG, tanpa aset eksternal).
   - Bernapas, berkedip, bergoyang halus, dan punya ekspresi: neutral, happy, think, sorry, listen.
   - Lip-sync: bahasa Jepang berirama per mora, jadi bentuk mulut (a, i, u, e, o) diambil dari bacaan hiragana dan
     diikuti dengan posisi audio yang sedang diputar. Tidak perlu analisis audio, jadi sama baiknya untuk suara AI maupun suara bawaan HP.
   API: KakeiboLeaAvatar.create(container) -> { setExpression, speak, stopSpeak, nod, pose, destroy }
        KakeiboLeaAvatar.moras(reading) -> [{ t, v, w }] */
(function () {
  "use strict";
  var SKIN = "#f9e0cc", SKIN_SH = "#e8bfa3", HAIR = "#1d2033", NAVY = "#1d2b4a", RED = "#c9432f", LIP = "#c9726b";

  /* ---------- mora Jepang -> bentuk mulut ---------- */
  var VOW = { a: "あかがさざただなはばぱまやらわゃぁゎ", i: "いきぎしじちぢにひびぴみりぃ", u: "うくぐすずつづぬふぶぷむゆるゅぅゔ", e: "えけげせぜてでねへべぺめれぇ", o: "おこごそぞとどのほぼぽもよろをょぉ" };
  var VMAP = {}; Object.keys(VOW).forEach(function (v) { for (var i = 0; i < VOW[v].length; i++) VMAP[VOW[v][i]] = v; });
  var SMALL_Y = "ゃゅょ", SMALL_V = "ぁぃぅぇぉ";
  function toHira(s) { return String(s || "").replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }); }
  function moras(reading) {
    var s = toHira(reading).replace(/\s+/g, ""), out = [], last = "x";
    for (var i = 0; i < s.length; i++) {
      var c = s[i], n = s[i + 1];
      if (/[、。,.!?！？…・]/.test(c)) { out.push({ t: c, v: "x", w: 1.6 }); last = "x"; continue; }
      if (c === "ー") { out.push({ t: c, v: last, w: 1 }); continue; }
      if (c === "っ" || c === "ん") { out.push({ t: c, v: "x", w: 0.9 }); last = "x"; continue; }
      if (n && (SMALL_Y.indexOf(n) >= 0 || SMALL_V.indexOf(n) >= 0) && VMAP[c]) { var v2 = VMAP[n]; out.push({ t: c + n, v: v2, w: 1 }); last = v2; i++; continue; }
      var v = VMAP[c];
      if (v) { out.push({ t: c, v: v, w: 1 }); last = v; }
      else { out.push({ t: c, v: last === "a" ? "o" : "a", w: 1.3 }); last = out[out.length - 1].v; } // huruf non-kana (kanji, alfabet): gerak mulut umum
    }
    return out;
  }
  var VIS = { x: [14, 1], a: [22, 19], i: [24, 7], u: [11, 10], e: [20, 12], o: [13, 16] }; // [lebar, tinggi]

  /* ---------- ekspresi ---------- */
  var EXPR = {
    neutral: { smile: 3, browY: 0, browR: 0, blush: 0.3, gx: 0, gy: 0, tilt: 0 },
    happy: { smile: 11, browY: -3, browR: 0, blush: 0.65, gx: 0, gy: 0, tilt: 1.2 },
    think: { smile: 0, browY: -6, browR: 5, blush: 0.2, gx: -5, gy: -5, tilt: 3.5 },
    sorry: { smile: -5, browY: -2, browR: 11, blush: 0.15, gx: 0, gy: 2, tilt: -1.5 },
    listen: { smile: 5, browY: -2, browR: 0, blush: 0.35, gx: 0, gy: 0, tilt: 1.5 }
  };

  function markup(u) {
    var f = function (s) { return s.replace(/@/g, u); };
    return f('<svg xmlns="http://www.w3.org/2000/svg" viewBox="14 52 372 428" width="100%" height="100%" role="img" aria-label="LEA Sensei" preserveAspectRatio="xMidYMax slice">' +
      '<defs><linearGradient id="@bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6eed8"/><stop offset="1" stop-color="#e2d0a8"/></linearGradient>' +
      '<linearGradient id="@bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d4466"/><stop offset="1" stop-color="#22354f"/></linearGradient>' +
      '<clipPath id="@mc"><path id="@mcp" d=""/></clipPath></defs>' +
      '<rect x="-40" y="0" width="480" height="520" fill="url(#@bg)"/>' +
      '<rect x="40" y="58" width="320" height="156" rx="10" fill="url(#@bd)" stroke="#a98a58" stroke-width="9"/>' +
      '<text x="200" y="140" text-anchor="middle" font-size="64" fill="#f4efe0" opacity=".9" font-family="Shippori Mincho,Hiragino Mincho ProN,Yu Mincho,Noto Serif CJK JP,Noto Serif JP,serif" font-weight="700">日本語</text>' +
      '<text x="200" y="190" text-anchor="middle" font-size="19" fill="#f4efe0" opacity=".5" font-family="Shippori Mincho,Hiragino Mincho ProN,Yu Mincho,Noto Serif CJK JP,Noto Serif JP,serif" letter-spacing="8">あいうえお</text>' +
      '<rect x="40" y="217" width="320" height="8" fill="#a98a58" opacity=".85"/>' +
      '<g id="@hb"><path d="M100 262 C84 146 142 104 200 104 C258 104 316 146 300 262 C306 340 294 396 276 420 L124 420 C106 396 94 340 100 262 Z" fill="' + HAIR + '"/></g>' +
      '<g id="@body">' +
        '<path d="M164 338 L236 338 L240 480 L160 480 Z" fill="#fbf7ea"/>' +
        '<path d="M26 480 C34 410 94 374 166 340 L202 424 L176 480 Z" fill="' + NAVY + '"/>' +
        '<path d="M374 480 C366 410 306 374 234 340 L198 424 L224 480 Z" fill="' + NAVY + '"/>' +
        '<path d="M166 340 L202 424 L186 372 Z" fill="#2c3f69"/><path d="M234 340 L198 424 L214 372 Z" fill="#2c3f69"/>' +
        '<path d="M176 346 L200 378 L224 346 L214 340 L200 358 L186 340 Z" fill="#fbf7ea"/>' +
      '</g>' +
      '<g id="@head">' +
        '<path d="M176 296 L224 296 L230 352 Q200 374 170 352 Z" fill="' + SKIN_SH + '"/>' +
        '<path d="M200 376 L170 362 L170 392 Z" fill="' + RED + '"/><path d="M200 376 L230 362 L230 392 Z" fill="' + RED + '"/><circle cx="200" cy="377" r="7.5" fill="#a8342a"/>' +
        '<ellipse cx="104" cy="250" rx="9" ry="16" fill="' + SKIN + '"/><ellipse cx="296" cy="250" rx="9" ry="16" fill="' + SKIN + '"/>' +
        '<path d="M104 232 C104 148 150 128 200 128 C250 128 296 148 296 232 C296 306 256 350 200 350 C144 350 104 306 104 232 Z" fill="' + SKIN + '"/>' +
        '<ellipse id="@bl1" cx="138" cy="290" rx="19" ry="10" fill="#f29a9a" opacity=".3"/><ellipse id="@bl2" cx="262" cy="290" rx="19" ry="10" fill="#f29a9a" opacity=".3"/>' +
        '<path d="M199 266 q-4 11 4 13" fill="none" stroke="#d3a083" stroke-width="2.6" stroke-linecap="round"/>' +
        '<g id="@eL" transform="translate(158 250)"><ellipse rx="17" ry="15" fill="#fff"/><g id="@iL"><circle r="11.5" fill="#4a2f2a"/><circle r="6" fill="#1d1414"/><circle cx="4" cy="-4.4" r="3.4" fill="#fff"/></g><path d="M-19 -3 Q0 -22 19 -3" fill="none" stroke="' + HAIR + '" stroke-width="3.8" stroke-linecap="round"/></g>' +
        '<g id="@eR" transform="translate(242 250)"><ellipse rx="17" ry="15" fill="#fff"/><g id="@iR"><circle r="11.5" fill="#4a2f2a"/><circle r="6" fill="#1d1414"/><circle cx="4" cy="-4.4" r="3.4" fill="#fff"/></g><path d="M-19 -3 Q0 -22 19 -3" fill="none" stroke="' + HAIR + '" stroke-width="3.8" stroke-linecap="round"/></g>' +
        '<g fill="none" stroke="#3a4a6b" stroke-width="2.8"><rect x="128" y="224" width="60" height="50" rx="17"/><rect x="212" y="224" width="60" height="50" rx="17"/><path d="M188 246 Q200 240 212 246"/><path d="M128 240 L110 236"/><path d="M272 240 L290 236"/></g>' +
        '<g id="@bL" transform="translate(158 214)"><path d="M-24 4 Q0 -9 24 2" fill="none" stroke="' + HAIR + '" stroke-width="4.8" stroke-linecap="round"/></g>' +
        '<g id="@bR" transform="translate(242 214)"><path d="M-24 2 Q0 -9 24 4" fill="none" stroke="' + HAIR + '" stroke-width="4.8" stroke-linecap="round"/></g>' +
        '<g transform="translate(200 312)"><path id="@mo" d="" fill="#7a2b2f" stroke="#b34a4a" stroke-width="2.8" stroke-linejoin="round"/><g clip-path="url(#@mc)"><rect id="@mt" x="-24" y="-6" width="48" height="5.5" rx="2" fill="#fff" opacity="0"/><ellipse id="@mg" cx="0" cy="9" rx="10" ry="5.5" fill="#e07a7a" opacity="0"/></g></g>' +
        '<path d="M102 250 C94 160 140 118 204 118 C268 118 308 160 298 250 C294 206 276 172 248 158 C232 172 214 178 196 178 C170 182 146 196 126 224 C118 236 110 248 102 250 Z" fill="' + HAIR + '"/>' +
        '<path d="M104 238 C98 300 108 352 124 388 L138 382 C128 344 120 300 122 250 Z" fill="' + HAIR + '"/><path d="M296 238 C302 300 292 352 276 388 L262 382 C272 344 280 300 278 250 Z" fill="' + HAIR + '"/>' +
        '<ellipse cx="264" cy="148" rx="16" ry="9.5" fill="' + RED + '" transform="rotate(-24 264 148)"/><circle cx="264" cy="148" r="4.4" fill="#e8c36a"/>' +
      '</g></svg>');
  }

  function mouthD(w, h, s) { // pusat (0,0); s>0 senyum, s<0 cemberut
    return "M" + (-w) + "," + (-s) + " Q0," + (-h * 0.45 + s * 0.2).toFixed(2) + " " + w + "," + (-s) + " Q0," + (h * 1.15 + s * 0.4).toFixed(2) + " " + (-w) + "," + (-s) + " Z";
  }

  function create(container) {
    var u = "lv" + Math.floor(Math.random() * 1e6) + "_";
    container.innerHTML = markup(u);
    var $ = function (id) { return container.querySelector("#" + u + id); };
    var E = { bl1: $("bl1"), bl2: $("bl2"), eL: $("eL"), eR: $("eR"), iL: $("iL"), iR: $("iR"), bL: $("bL"), bR: $("bR"), mo: $("mo"), mcp: $("mcp"), mt: $("mt"), mg: $("mg"), body: $("body"), head: $("head"), hb: $("hb") };
    var P = { smile: 3, browY: 0, browR: 0, blush: 0.3, gx: 0, gy: 0, tilt: 0, mw: 13, mh: 1, bodyY: 0, headY: 0, rot: 0, nod: 0 };
    var T = Object.assign({}, EXPR.neutral);
    var blink = 1, blinkAt = 1.8, blinkPhase = -1, t0 = performance.now(), last = t0, raf = 0, alive = true;
    var sp = null; // pembicaraan: { moras, total, cum, get, onMora, onEnd, idx }

    function apply() {
      var mouthW = P.mw, mouthH = P.mh;
      E.mo.setAttribute("d", mouthD(mouthW, mouthH, P.smile));
      E.mcp.setAttribute("d", mouthD(mouthW, mouthH, P.smile));
      E.mo.setAttribute("fill", mouthH < 3.2 ? LIP : "#7a2b2f");
      E.mt.setAttribute("opacity", mouthH > 6 ? "0.95" : "0"); E.mt.setAttribute("y", (-mouthH * 0.42).toFixed(1));
      E.mg.setAttribute("opacity", mouthH > 9 ? String(Math.min(0.9, (mouthH - 9) / 8)) : "0"); E.mg.setAttribute("cy", (mouthH * 0.5).toFixed(1));
      E.bl1.setAttribute("opacity", P.blush.toFixed(2)); E.bl2.setAttribute("opacity", P.blush.toFixed(2));
      E.eL.setAttribute("transform", "translate(158 250) scale(1 " + Math.max(0.08, blink).toFixed(2) + ")");
      E.eR.setAttribute("transform", "translate(242 250) scale(1 " + Math.max(0.08, blink).toFixed(2) + ")");
      var g = "translate(" + P.gx.toFixed(1) + " " + P.gy.toFixed(1) + ")"; E.iL.setAttribute("transform", g); E.iR.setAttribute("transform", g);
      E.bL.setAttribute("transform", "translate(158 " + (214 + P.browY).toFixed(1) + ") rotate(" + (-P.browR).toFixed(1) + ")");
      E.bR.setAttribute("transform", "translate(242 " + (214 + P.browY).toFixed(1) + ") rotate(" + P.browR.toFixed(1) + ")");
      E.body.setAttribute("transform", "translate(0 " + P.bodyY.toFixed(2) + ")");
      var ht = "translate(0 " + (P.headY + P.nod * 7).toFixed(2) + ") rotate(" + (P.rot + P.tilt * 0.4).toFixed(2) + " 200 350)"; E.head.setAttribute("transform", ht); E.hb.setAttribute("transform", ht);
    }

    function frame(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000), t = (now - t0) / 1000; last = now;
      var k = function (r) { return 1 - Math.exp(-dt * r); };
      // ekspresi
      ["smile", "browY", "browR", "blush", "gx", "gy", "tilt"].forEach(function (key) { P[key] += (T[key] - P[key]) * k(7); });
      // napas dan goyang halus
      P.bodyY = Math.sin(t * 1.5) * 2.2; P.headY = Math.sin(t * 1.5 + 0.5) * 1.3;
      P.rot = Math.sin(t * 0.7) * 0.9 + (sp ? Math.sin(t * 3.3) * 0.8 : 0);
      P.nod += (-P.nod) * k(6);
      // kedip
      if (blinkPhase < 0 && t > blinkAt) blinkPhase = 0;
      if (blinkPhase >= 0) { blinkPhase += dt / 0.14; blink = 1 - Math.sin(Math.min(1, blinkPhase) * Math.PI); if (blinkPhase >= 1) { blinkPhase = -1; blink = 1; blinkAt = t + 2.2 + Math.random() * 3.4; } }
      // mulut
      var tw = VIS.x[0], th = VIS.x[1];
      if (sp) {
        var p = sp.get(); if (p < 0 || p >= 1.0) { finish(); }
        else {
          var pos = p * sp.total, i = 0; while (i < sp.cum.length - 1 && sp.cum[i + 1] <= pos) i++;
          var m = sp.moras[i], ph = (pos - sp.cum[i]) / (m.w || 1), v = VIS[m.v] || VIS.x, amp = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, ph))), 0.6);
          tw = VIS.x[0] + (v[0] - VIS.x[0]) * (0.45 + 0.55 * amp); th = VIS.x[1] + (v[1] - VIS.x[1]) * (m.v === "x" ? 0.2 : (0.3 + 0.7 * amp));
          if (i !== sp.idx) { sp.idx = i; if (sp.onMora) sp.onMora(i); }
        }
      }
      P.mw += (tw - P.mw) * k(sp ? 26 : 14); P.mh += (th - P.mh) * k(sp ? 26 : 14);
      apply();
      raf = requestAnimationFrame(frame);
    }
    function finish() { var s = sp; sp = null; if (s && s.onEnd) s.onEnd(); }

    var api = {
      setExpression: function (name) { Object.assign(T, EXPR[name] || EXPR.neutral); },
      nod: function () { P.nod = 1; },
      // reading = bacaan hiragana; get() = posisi audio 0..1 (kembalikan -1 untuk menghentikan); onMora(i) = indeks mora yang sedang diucapkan
      speak: function (reading, get, onMora, onEnd) {
        var ms = moras(reading); if (!ms.length) ms = [{ t: "あ", v: "a", w: 1 }];
        var cum = [0], tot = 0; ms.forEach(function (m) { tot += m.w; cum.push(tot); });
        if (sp) finish();
        sp = { moras: ms, total: tot, cum: cum, get: get, onMora: onMora, onEnd: onEnd, idx: -1 };
      },
      stopSpeak: function () { if (sp) finish(); },
      isSpeaking: function () { return !!sp; },
      // untuk pengujian/pratinjau: set pose langsung tanpa animasi
      pose: function (expr, vis) { Object.assign(T, EXPR[expr] || EXPR.neutral); Object.assign(P, T); var v = VIS[vis || "x"]; P.mw = v[0]; P.mh = v[1]; blink = 1; P.bodyY = 0; P.headY = 0; P.rot = 0; P.nod = 0; apply(); return container.innerHTML; },
      destroy: function () { alive = false; cancelAnimationFrame(raf); sp = null; container.innerHTML = ""; }
    };
    apply(); raf = requestAnimationFrame(frame);
    return api;
  }
  window.KakeiboLeaAvatar = { create: create, moras: moras, visemes: VIS, expressions: Object.keys(EXPR) };
})();
