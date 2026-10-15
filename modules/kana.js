/* Kakeibo · modul Kana (hiragana dan katakana): pelajaran, latihan, review berjarak (SRS), speedrun, XP dan streak harian.
 * Mandiri dan dimuat saat dibuka: window.KakeiboKana.open({ lang, esc }). Semua progres tersimpan di HP (localStorage), gratis untuk semua pengguna. */
(function () {
  "use strict";
  var KEY = "kakeibo-kana", host, el, view = "home", script = "h", cur = null, tm = null, sayTm = null;
  var S = { k: {}, xp: 0, streak: 0, last: "", day: "", dayOk: 0, best: 0 };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || "{}"); if (raw && typeof raw === "object") S = Object.assign(S, raw); } catch (e) {}
  if (!S.k || typeof S.k !== "object") S.k = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var DAILY_GOAL = 15, SPEED_SECS = 60, INT = [0, 1, 3, 7, 14, 30];

  // ---------- data kana ----------
  // [judul, kana, romaji] (hiragana; katakana dibentuk otomatis dari kode karakter)
  var L = [
    ["あ行", "あ い う え お", "a i u e o"], ["か行", "か き く け こ", "ka ki ku ke ko"], ["さ行", "さ し す せ そ", "sa shi su se so"],
    ["た行", "た ち つ て と", "ta chi tsu te to"], ["な行", "な に ぬ ね の", "na ni nu ne no"], ["は行", "は ひ ふ へ ほ", "ha hi fu he ho"],
    ["ま行", "ま み む め も", "ma mi mu me mo"], ["や行", "や ゆ よ", "ya yu yo"], ["ら行", "ら り る れ ろ", "ra ri ru re ro"],
    ["わ・を・ん", "わ を ん", "wa wo n"],
    ["が行", "が ぎ ぐ げ ご", "ga gi gu ge go"], ["ざ行", "ざ じ ず ぜ ぞ", "za ji zu ze zo"], ["だ行", "だ ぢ づ で ど", "da ji zu de do"],
    ["ば行", "ば び ぶ べ ぼ", "ba bi bu be bo"], ["ぱ行", "ぱ ぴ ぷ ぺ ぽ", "pa pi pu pe po"],
    ["きゃ・ぎゃ", "きゃ きゅ きょ ぎゃ ぎゅ ぎょ", "kya kyu kyo gya gyu gyo"], ["しゃ・じゃ", "しゃ しゅ しょ じゃ じゅ じょ", "sha shu sho ja ju jo"],
    ["ちゃ・にゃ", "ちゃ ちゅ ちょ にゃ にゅ にょ", "cha chu cho nya nyu nyo"], ["ひゃ・びゃ・ぴゃ", "ひゃ ひゅ ひょ びゃ びゅ びょ ぴゃ ぴゅ ぴょ", "hya hyu hyo bya byu byo pya pyu pyo"],
    ["みゃ・りゃ", "みゃ みゅ みょ りゃ りゅ りょ", "mya myu myo rya ryu ryo"]
  ];
  var GROUP = function (n) { return n < 10 ? "b" : n < 15 ? "d" : "y"; };
  function kata(s) { return s.replace(/[\u3041-\u3096]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) + 0x60); }); }
  var ALL = [], QZ = [], LESSONS = { h: [], k: [] };
  ["h", "k"].forEach(function (sc) {
    L.forEach(function (ln, n) {
      var cs = ln[1].split(" "), rs = ln[2].split(" "), ids = [];
      cs.forEach(function (c, i) {
        var ch = sc === "k" ? kata(c) : c, it = { id: sc + ch, s: sc, c: ch, r: rs[i], lesson: n, rare: /[ぢづヂヅ]/.test(ch) };
        ALL.push(it); ids.push(it); if (!it.rare) QZ.push(it);
      });
      LESSONS[sc].push({ n: n, title: sc === "k" ? kata(ln[0]) : ln[0], items: ids, g: GROUP(n) });
    });
  });
  var BYID = {}; ALL.forEach(function (it) { BYID[it.id] = it; });
  var ALT = { shi: ["si"], chi: ["ti"], tsu: ["tu"], fu: ["hu"], ji: ["zi"], wo: ["o"], n: ["nn"], sha: ["sya"], shu: ["syu"], sho: ["syo"], ja: ["jya", "zya"], ju: ["jyu", "zyu"], jo: ["jyo", "zyo"], cha: ["tya"], chu: ["tyu"], cho: ["tyo"] };

  // contoh kata: kana | kata | romaji | arti Indonesia | arti Inggris
  var EXH = "あ|あめ|ame|hujan|rain\nい|いぬ|inu|anjing|dog\nう|うみ|umi|laut|sea\nえ|えき|eki|stasiun|station\nお|おかね|okane|uang|money\nか|かさ|kasa|payung|umbrella\nき|き|ki|pohon|tree\nく|くるま|kuruma|mobil|car\nけ|けいたい|keitai|ponsel|mobile phone\nこ|こども|kodomo|anak|child\n" +
    "さ|さかな|sakana|ikan|fish\nし|しお|shio|garam|salt\nす|すし|sushi|sushi|sushi\nせ|せんせい|sensei|guru|teacher\nそ|そら|sora|langit|sky\nた|たまご|tamago|telur|egg\nち|ちず|chizu|peta|map\nつ|つくえ|tsukue|meja|desk\nて|て|te|tangan|hand\nと|とり|tori|burung|bird\n" +
    "な|なつ|natsu|musim panas|summer\nに|にく|niku|daging|meat\nぬ|ぬの|nuno|kain|cloth\nね|ねこ|neko|kucing|cat\nの|のり|nori|rumput laut|seaweed\nは|はな|hana|bunga|flower\nひ|ひと|hito|orang|person\nふ|ふね|fune|kapal|ship\nへ|へや|heya|kamar|room\nほ|ほん|hon|buku|book\n" +
    "ま|まど|mado|jendela|window\nみ|みず|mizu|air|water\nむ|むし|mushi|serangga|insect\nめ|めがね|megane|kacamata|glasses\nも|もり|mori|hutan|forest\nや|やま|yama|gunung|mountain\nゆ|ゆき|yuki|salju|snow\nよ|よる|yoru|malam|night\nら|らいねん|rainen|tahun depan|next year\nり|りんご|ringo|apel|apple\n" +
    "る|るす|rusu|tidak di rumah|away from home\nれ|れいぞうこ|reizouko|kulkas|refrigerator\nろ|ろうそく|rousoku|lilin|candle\nわ|わたし|watashi|saya|I\nを|ほんをよむ|hon o yomu|membaca buku (を = penanda objek)|read a book (を = object marker)\nん|ほん|hon|buku|book\n" +
    "が|がっこう|gakkou|sekolah|school\nぎ|ぎんこう|ginkou|bank|bank\nぐ|ぐんて|gunte|sarung tangan kerja|work gloves\nげ|げんき|genki|sehat|healthy\nご|ごはん|gohan|nasi, makan|rice, meal\nざ|ざいりょう|zairyou|bahan|material\nじ|じかん|jikan|waktu|time\nず|ずぼん|zubon|celana|trousers\nぜ|ぜんぶ|zenbu|semua|all\nぞ|ぞう|zou|gajah|elephant\n" +
    "だ|だいどころ|daidokoro|dapur|kitchen\nぢ|はなぢ|hanaji|mimisan|nosebleed\nづ|つづく|tsuzuku|berlanjut|continue\nで|でんしゃ|densha|kereta|train\nど|どうぶつ|doubutsu|hewan|animal\nば|ばしょ|basho|tempat|place\nび|びょういん|byouin|rumah sakit|hospital\nぶ|ぶどう|budou|anggur|grape\nべ|べんとう|bentou|bekal|lunch box\nぼ|ぼうし|boushi|topi|hat\n" +
    "ぱ|ぱん|pan|roti|bread\nぴ|えんぴつ|enpitsu|pensil|pencil\nぷ|てんぷら|tenpura|tempura|tempura\nぺ|ぺらぺら|perapera|lancar|fluent\nぽ|さんぽ|sanpo|jalan-jalan|walk\n" +
    "きゃ|きゃく|kyaku|tamu|guest\nきゅ|きゅうり|kyuuri|timun|cucumber\nきょ|きょう|kyou|hari ini|today\nぎゃ|ぎゃく|gyaku|kebalikan|opposite\nぎゅ|ぎゅうにゅう|gyuunyuu|susu|milk\nぎょ|ぎょうれつ|gyouretsu|antrean|queue\n" +
    "しゃ|しゃしん|shashin|foto|photo\nしゅ|しゅくだい|shukudai|PR sekolah|homework\nしょ|しょくじ|shokuji|makan|meal\nじゃ|じゃがいも|jagaimo|kentang|potato\nじゅ|じゅう|juu|sepuluh|ten\nじょ|じょうず|jouzu|pandai|skillful\n" +
    "ちゃ|おちゃ|ocha|teh|tea\nちゅ|ちゅうい|chuui|hati-hati|caution\nちょ|ちょきん|chokin|tabungan|savings\nにゃ|こんにゃく|konnyaku|konnyaku|konjac\nにゅ|にゅういん|nyuuin|rawat inap|hospitalization\n" +
    "ひゃ|ひゃく|hyaku|seratus|hundred\nひょ|ひょう|hyou|tabel|table\nびょ|びょうき|byouki|sakit|illness\nぴゃ|ろっぴゃく|roppyaku|enam ratus|six hundred\nぴょ|ぴょんぴょん|pyonpyon|melompat-lompat|hopping\n" +
    "みょ|みょうじ|myouji|nama keluarga|family name\nりゃ|りゃく|ryaku|singkatan|abbreviation\nりゅ|りゅうがく|ryuugaku|belajar di luar negeri|study abroad\nりょ|りょこう|ryokou|perjalanan|trip";
  var EXK = "ア|アイス|aisu|es krim|ice cream\nイ|インク|inku|tinta|ink\nウ|ウール|uuru|wol|wool\nエ|エアコン|eakon|AC|air conditioner\nオ|オレンジ|orenji|jeruk|orange\nカ|カメラ|kamera|kamera|camera\nキ|キウイ|kiui|kiwi|kiwi\nク|クリーム|kuriimu|krim|cream\nケ|ケーキ|keeki|kue|cake\nコ|コーヒー|koohii|kopi|coffee\n" +
    "サ|サラダ|sarada|salad|salad\nシ|シャツ|shatsu|kemeja|shirt\nス|スープ|suupu|sup|soup\nセ|セーター|seetaa|sweter|sweater\nソ|ソファ|sofa|sofa|sofa\nタ|タクシー|takushii|taksi|taxi\nチ|チーズ|chiizu|keju|cheese\nツ|ツナ|tsuna|tuna|tuna\nテ|テレビ|terebi|televisi|TV\nト|トマト|tomato|tomat|tomato\n" +
    "ナ|ナイフ|naifu|pisau|knife\nニ|ニュース|nyuusu|berita|news\nヌ|ヌードル|nuudoru|mi|noodle\nネ|ネクタイ|nekutai|dasi|necktie\nノ|ノート|nooto|buku catatan|notebook\nハ|ハンカチ|hankachi|saputangan|handkerchief\nヒ|ヒーター|hiitaa|pemanas|heater\nフ|フォーク|fooku|garpu|fork\nヘ|ヘルメット|herumetto|helm|helmet\nホ|ホテル|hoteru|hotel|hotel\n" +
    "マ|マスク|masuku|masker|mask\nミ|ミルク|miruku|susu|milk\nム|ゲーム|geemu|permainan|game\nメ|メール|meeru|surel|e-mail\nモ|モデル|moderu|model|model\nヤ|タイヤ|taiya|ban|tire\nユ|ユニフォーム|yunifoomu|seragam|uniform\nヨ|ヨーグルト|yoogurito|yoghurt|yogurt\nラ|ラジオ|rajio|radio|radio\nリ|リモコン|rimokon|remote|remote control\n" +
    "ル|ルール|ruuru|aturan|rule\nレ|レモン|remon|lemon|lemon\nロ|ロボット|robotto|robot|robot\nワ|ワイシャツ|waishatsu|kemeja formal|dress shirt\nン|ペン|pen|pena|pen\n" +
    "ガ|ガス|gasu|gas|gas\nギ|ギター|gitaa|gitar|guitar\nグ|グラス|gurasu|gelas|glass\nゲ|ゲーム|geemu|permainan|game\nゴ|ゴム|gomu|karet|rubber\nザ|ピザ|piza|pizza|pizza\nジ|ジュース|juusu|jus|juice\nズ|ズボン|zubon|celana|pants\nゼ|ゼロ|zero|nol|zero\nゾ|ゾーン|zoon|zona|zone\n" +
    "ダ|ダンス|dansu|dansa|dance\nデ|デパート|depaato|pusat perbelanjaan|department store\nド|ドア|doa|pintu|door\nバ|バス|basu|bus|bus\nビ|ビル|biru|gedung|building\nブ|ブーツ|buutsu|sepatu bot|boots\nベ|ベッド|beddo|tempat tidur|bed\nボ|ボール|booru|bola|ball\nパ|パソコン|pasokon|komputer|PC\nピ|ピアノ|piano|piano|piano\n" +
    "プ|プール|puuru|kolam renang|pool\nペ|ページ|peeji|halaman|page\nポ|ポスト|posuto|kotak pos|mailbox\nキャ|キャベツ|kyabetsu|kol|cabbage\nシャ|シャワー|shawaa|pancuran|shower\nショ|ショッピング|shoppingu|belanja|shopping\nジャ|ジャケット|jaketto|jaket|jacket\nジュ|ジュース|juusu|jus|juice\nジョ|ジョギング|jogingu|jogging|jogging\n" +
    "チャ|チャンス|chansu|kesempatan|chance\nチョ|チョコレート|chokoreeto|cokelat|chocolate\nニュ|ニュース|nyuusu|berita|news\nミュ|ミュージック|myuujikku|musik|music\nリュ|リュック|ryukku|ransel|backpack";
  var EX = { h: {}, k: {} };
  function parseEx(txt, sc) { txt.split("\n").forEach(function (ln) { var p = ln.split("|"); if (p.length === 5) EX[sc][p[0]] = p; }); }
  parseEx(EXH, "h"); parseEx(EXK, "k");

  // ---------- teks ----------
  var UI = {
    id: { title: "Kana", tabH: "Hiragana ひらがな", tabK: "Katakana カタカナ", streak: "hari beruntun", goal: "target hari ini", review: "Review", reviewSub: "kana yang siap diulang", reviewNone: "Belum ada yang perlu diulang. Selesaikan satu pelajaran dulu.", practice: "Latihan acak", practiceSub: "perkuat kana yang paling lemah", speed: "Speedrun 60 detik", speedSub: "jawab secepat mungkin", best: "Terbaik", chart: "Tabel kana", chartSub: "ketuk untuk mendengar", lessons: "Pelajaran", start: "Mulai latihan", back: "Kembali", next: "Lanjut", check: "Cek", hear: "Dengar", noVoice: "Suara Jepang belum terpasang di HP-mu. Unduh dulu di Pengaturan, bagian Text-to-speech.", qK2r: "Apa bacaannya?", qR2k: "Pilih kana yang benar", qListen: "Dengarkan, lalu pilih kana", qType: "Ketik bacaannya dalam huruf latin", ph: "romaji", right: "Benar!", wrong: "Jawaban yang benar", done: "Selesai", score: "Skor", right2: "benar", again: "Lagi", toHome: "Ke beranda", mast: "hafal", rare: "Jarang dipakai. Dibaca sama seperti", example: "Contoh", xp: "XP", newBest: "Rekor baru!", time: "Waktu habis", seen: "Pelajari minimal 5 kana dulu supaya speedrun bisa dimulai.", due: "siap diulang", lessonOf: "Pelajaran" },
    en: { title: "Kana", tabH: "Hiragana ひらがな", tabK: "Katakana カタカナ", streak: "day streak", goal: "today's goal", review: "Review", reviewSub: "kana ready to repeat", reviewNone: "Nothing to review yet. Finish a lesson first.", practice: "Random practice", practiceSub: "strengthen your weakest kana", speed: "60-second speedrun", speedSub: "answer as fast as you can", best: "Best", chart: "Kana chart", chartSub: "tap to listen", lessons: "Lessons", start: "Start practice", back: "Back", next: "Next", check: "Check", hear: "Listen", noVoice: "No Japanese voice is installed on your phone. Download one in Settings under Text-to-speech.", qK2r: "How do you read this?", qR2k: "Pick the correct kana", qListen: "Listen, then pick the kana", qType: "Type the reading in Latin letters", ph: "romaji", right: "Correct!", wrong: "Correct answer", done: "Done", score: "Score", right2: "correct", again: "Again", toHome: "Home", mast: "learned", rare: "Rarely used. Read the same as", example: "Example", xp: "XP", newBest: "New record!", time: "Time's up", seen: "Learn at least 5 kana first to unlock the speedrun.", due: "ready", lessonOf: "Lesson" },
    my: { title: "ကာနာ", tabH: "ဟီရဂန ひらがな", tabK: "ကတာကန カタカナ", streak: "ရက်ဆက်တိုက်", goal: "ယနေ့ ပန်းတိုင်", review: "ပြန်လည်ကျက်မှတ်", reviewSub: "ပြန်လေ့ကျင့်ရန် အဆင်သင့်", reviewNone: "ပြန်လေ့ကျင့်စရာ မရှိသေးပါ။ သင်ခန်းစာတစ်ခု အရင်ပြီးအောင်လုပ်ပါ။", practice: "ကျပန်းလေ့ကျင့်ခန်း", practiceSub: "အားနည်းသော ကာနာများကို အားဖြည့်ပါ", speed: "၆၀ စက္ကန့် Speedrun", speedSub: "အမြန်ဆုံးဖြေပါ", best: "အကောင်းဆုံး", chart: "ကာနာ ဇယား", chartSub: "နားထောင်ရန် ထိပါ", lessons: "သင်ခန်းစာများ", start: "လေ့ကျင့်မည်", back: "နောက်သို့", next: "ဆက်သွားရန်", check: "စစ်မည်", hear: "နားထောင်", noVoice: "သင့်ဖုန်းတွင် ဂျပန်အသံ မထည့်ရသေးပါ။ Settings > Text-to-speech တွင် ဒေါင်းလုဒ်လုပ်ပါ။", qK2r: "ဘယ်လိုဖတ်သလဲ?", qR2k: "မှန်သော ကာနာကို ရွေးပါ", qListen: "နားထောင်ပြီး ကာနာကို ရွေးပါ", qType: "ဖတ်ပုံကို လက်တင်စာလုံးဖြင့် ရိုက်ပါ", ph: "romaji", right: "မှန်ပါသည်!", wrong: "အဖြေမှန်", done: "ပြီးပါပြီ", score: "ရမှတ်", right2: "မှန်", again: "ထပ်လုပ်ရန်", toHome: "ပင်မ", mast: "ကျွမ်းကျင်", rare: "အသုံးနည်းသည်။ ဖတ်ပုံတူသည်", example: "ဥပမာ", xp: "XP", newBest: "စံချိန်သစ်!", time: "အချိန်ပြည့်ပြီ", seen: "Speedrun စတင်ရန် ကာနာ ၅ လုံးအနည်းဆုံး အရင်လေ့လာပါ။", due: "အဆင်သင့်", lessonOf: "သင်ခန်းစာ" }
  };
  function T() { return UI[host.lang] || UI.en; }
  function esc(s) { return host && host.esc ? host.esc(s) : String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function meaning(p) { return host.lang === "id" ? p[3] : p[4]; }

  // ---------- suara (suara bawaan HP) ----------
  function say(txt) {
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(txt); u.lang = "ja-JP"; u.rate = 0.8;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^ja/i.test(x.lang); })[0];
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function noJa() { try { var vs = speechSynthesis.getVoices(); return vs.length > 0 && !vs.some(function (v) { return /^ja/i.test(v.lang); }); } catch (e) { return false; } }

  // ---------- progres (SRS sederhana: 6 kotak, interval hari) ----------
  function ymd(d) { d = d || new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function rec(id) { return S.k[id] || (S.k[id] = { b: 0, due: 0, ok: 0, ng: 0, seen: 0 }); }
  function isSeen(id) { var r = S.k[id]; return !!(r && r.seen); }
  function isMast(id) { var r = S.k[id]; return !!(r && r.seen && r.b >= 3); }
  function isDue(id) { var r = S.k[id]; return !!(r && r.seen && r.due <= Date.now()); }
  function grade(id, good) {
    var r = rec(id), now = Date.now(), wasDue = !r.seen || r.due <= now; r.seen = 1;
    if (good) { r.ok++; if (wasDue) { r.b = Math.min(5, r.b + 1); r.due = now + INT[r.b] * 864e5; } }
    else { r.ng++; r.b = Math.max(0, r.b - 1); r.due = now; }
    if (S.day !== ymd()) { S.day = ymd(); S.dayOk = 0; }
    if (good) S.dayOk++;
  }
  function streakNow() { if (!S.last) return 0; var t = ymd(), y = ymd(new Date(Date.now() - 864e5)); return S.last === t || S.last === y ? S.streak : 0; }
  function bumpStreak() {
    var t = ymd(), y = ymd(new Date(Date.now() - 864e5));
    if (S.last === t) return;
    S.streak = S.last === y ? S.streak + 1 : 1; S.last = t;
  }
  function stats(sc) {
    var q = QZ.filter(function (x) { return x.s === sc; }), m = q.filter(function (x) { return isMast(x.id); }).length;
    return { total: q.length, mast: m, due: q.filter(function (x) { return isDue(x.id); }).length, seen: q.filter(function (x) { return isSeen(x.id); }).length };
  }
  function lessonMast(ls) { var q = ls.items.filter(function (x) { return !x.rare; }); return { m: q.filter(function (x) { return isMast(x.id); }).length, t: q.length }; }

  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; };

  // ---------- soal ----------
  function options(it, type) {
    var key = type === "k2r" ? "r" : "c", seen = {}, out = [];
    seen[it[key]] = 1;
    var pool = QZ.filter(function (x) { return x.s === it.s && x[key] !== it[key]; });
    var near = shuffle(pool.filter(function (x) { return x.lesson === it.lesson; }));
    near.concat(shuffle(pool)).forEach(function (x) { if (out.length < 3 && !seen[x[key]]) { seen[x[key]] = 1; out.push(x); } });
    return shuffle(out.concat([it]));
  }
  function pickType(id, fast) {
    var b = isSeen(id) ? rec(id).b : 0, ts = ["k2r", "r2k"];
    if (!fast) { if (!noJa()) ts.push("listen"); if (b >= 2) ts.push("type", "type"); }
    return ts[Math.floor(Math.random() * ts.length)];
  }
  function mkQ(it, fast) { var type = pickType(it.id, fast); return { it: it, type: type, opts: type === "type" ? null : options(it, type) }; }
  function addXp(n) { S.xp += n; cur.xp += n; }

  function startSession(mode, items, extra) {
    var qs = [];
    if (mode === "speed") {
      cur = { mode: mode, pool: items, qs: [], i: 0, ok: 0, tot: 0, xp: 0, score: 0, ends: Date.now() + SPEED_SECS * 1000, ans: null, retried: {}, miss: 0 };
      cur.q = mkQ(items[Math.floor(Math.random() * items.length)], true);
    } else {
      items.forEach(function (it) { qs.push(mkQ(it, false)); });
      cur = { mode: mode, qs: qs, i: 0, ok: 0, tot: 0, xp: 0, ans: null, retried: {}, lesson: extra };
      cur.q = qs[0];
    }
    view = "quiz"; render();
    if (mode === "speed") { clearInterval(tm); tm = setInterval(tick, 250); }
  }
  function tick() {
    if (!cur || cur.mode !== "speed" || view !== "quiz") { clearInterval(tm); return; }
    var left = Math.max(0, Math.ceil((cur.ends - Date.now()) / 1000)), t = el && el.querySelector("#knTime");
    if (t) t.textContent = left + "s";
    if (cur.ends <= Date.now()) { clearInterval(tm); finish(); }
  }
  function answer(val) {
    var q = cur.q; if (cur.ans) return;
    var good = q.type === "k2r" ? val === q.it.r : q.type === "type" ? ((ALT[q.it.r] || []).concat([q.it.r]).indexOf(String(val).trim().toLowerCase()) >= 0) : val === q.it.c;
    cur.ans = { val: val, good: good }; cur.tot++;
    var first = !cur.retried[q.it.id + "|" + cur.i] && !q.retry;
    if (first) grade(q.it.id, good);
    if (good) { cur.ok++; addXp(cur.mode === "speed" ? 2 : q.retry ? 5 : 10); if (cur.mode === "speed") cur.score++; }
    else if (cur.mode !== "speed" && !q.retry) { cur.qs.push({ it: q.it, type: q.type === "type" ? "k2r" : q.type, opts: q.type === "type" ? options(q.it, "k2r") : q.opts, retry: true }); }
    save(); render();
    if (q.type !== "listen") setTimeout(function () { say(q.it.c); }, 150);
    if (cur.mode === "speed") setTimeout(nextQ, good ? 350 : 800);
  }
  function nextQ() {
    if (!cur || view !== "quiz") return;
    if (cur.mode === "speed") { if (cur.ends <= Date.now()) return finish(); cur.q = mkQ(cur.pool[Math.floor(Math.random() * cur.pool.length)], true); cur.ans = null; return render(); }
    cur.i++; if (cur.i >= cur.qs.length) return finish();
    cur.q = cur.qs[cur.i]; cur.ans = null; render();
  }
  function finish() {
    clearInterval(tm); if (!cur) return;
    var newBest = false;
    if (cur.mode === "speed" && cur.score > (S.best || 0)) { S.best = cur.score; newBest = true; }
    if (cur.tot > 0) bumpStreak();
    cur.newBest = newBest; save(); view = "result"; render();
  }

  // ---------- tampilan ----------
  function css() {
    if (document.getElementById("kanaCss")) return;
    var s = document.createElement("style"); s.id = "kanaCss";
    s.textContent = ".kn-stat{display:flex;gap:8px;margin-bottom:10px}.kn-stat div{flex:1;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px 6px;text-align:center}.kn-stat b{display:block;font-size:17px}.kn-stat span{font-size:10.5px;color:var(--mist)}" +
      ".kn-tabs{display:flex;gap:6px;margin-bottom:10px}.kn-tab{flex:1;border:1px solid var(--line);background:transparent;color:inherit;border-radius:10px;padding:9px 4px;font:700 13px Inter,sans-serif;cursor:pointer}.kn-tab.on{background:var(--ai);color:#fff;border-color:var(--ai)}" +
      ".kn-card{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:11px 12px;margin-bottom:8px;font:inherit;color:inherit;cursor:pointer}.kn-card:disabled{opacity:.55;cursor:default}" +
      ".kn-ico{flex:0 0 44px;height:44px;border-radius:12px;background:var(--ai);color:#eee6d2;display:grid;place-items:center;font-size:20px}.kn-ico.hot{background:var(--hanko);color:#fff}.kn-grow{flex:1;min-width:0}.kn-grow small{display:block;font-size:12px;color:var(--mist);margin-top:2px}" +
      ".kn-bar{height:5px;border-radius:3px;background:var(--line);margin-top:7px;overflow:hidden}.kn-bar i{display:block;height:100%;background:var(--hanko)}" +
      ".kn-h{font:700 12px Inter,sans-serif;color:var(--mist);text-transform:uppercase;letter-spacing:.04em;margin:14px 2px 6px}.kn-top{display:flex;align-items:center;gap:8px;margin-bottom:10px}.kn-top b{font-size:15px;flex:1}.kn-btn{border:1px solid var(--line);background:var(--washi);color:inherit;border-radius:10px;padding:7px 12px;font:600 13px Inter,sans-serif;cursor:pointer}" +
      ".kn-primary{display:block;width:100%;padding:13px;border:0;border-radius:12px;background:var(--ai);color:#eee6d2;font:600 15px Inter,sans-serif;cursor:pointer;margin-top:8px}.kn-primary.alt{background:transparent;color:inherit;border:1px solid var(--line)}" +
      ".kn-note{font-size:12px;color:var(--mist);line-height:1.5;margin:4px 2px 10px}" +
      ".kn-ch{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px}.kn-big{font-family:'Shippori Mincho',serif;font-size:38px;line-height:1;min-width:58px;text-align:center}.kn-ro{font-size:15px;font-weight:700}.kn-ex{font-size:12.5px;color:var(--mist);margin-top:3px;line-height:1.4}.kn-ch .kn-btn{margin-left:auto}" +
      ".kn-q{text-align:center;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 10px;margin-bottom:10px}.kn-q .kn-big{font-size:72px}.kn-q .kn-rq{font-size:46px;font-weight:800;letter-spacing:.02em}.kn-cap{font-size:12.5px;color:var(--mist);margin-top:8px}" +
      ".kn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.kn-opt{border:1.5px solid var(--line);background:var(--card);color:inherit;border-radius:14px;padding:14px 6px;font:700 22px 'Shippori Mincho',Inter,sans-serif;cursor:pointer}.kn-opt.r{font-family:Inter,sans-serif}.kn-opt.ok{border-color:#2f7d4f;background:rgba(47,125,79,.16)}.kn-opt.no{border-color:var(--hanko);background:rgba(172,53,39,.12)}.kn-opt:disabled{cursor:default}" +
      ".kn-in{width:100%;border:1.5px solid var(--line);background:var(--card);color:inherit;border-radius:12px;padding:13px;font:600 20px Inter,sans-serif;text-align:center}.kn-fb{margin-top:10px;font-weight:700;text-align:center}.kn-fb.ok{color:#2f7d4f}.kn-fb.no{color:var(--hanko)}" +
      ".kn-sum{text-align:center;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:10px}.kn-sum .kn-big{font-size:44px}" +
      ".kn-chips{display:flex;flex-wrap:wrap;gap:6px}.kn-chip{border:1px solid var(--line);background:var(--card);color:inherit;border-radius:10px;padding:6px 4px;min-width:54px;text-align:center;cursor:pointer;font:inherit}.kn-chip b{display:block;font-family:'Shippori Mincho',serif;font-size:21px;line-height:1.2}.kn-chip span{font-size:11px;color:var(--mist)}.kn-chip.m{border-color:#2f7d4f;background:rgba(47,125,79,.12)}.kn-chip.s{border-color:var(--hanko)}" +
      ".kn-time{font:800 18px Inter,sans-serif}";
    document.head.appendChild(s);
  }

  function head(t, back) { return '<div class="kn-top">' + (back ? '<button type="button" class="kn-btn" data-a="back">←</button>' : "") + "<b>" + esc(t) + "</b></div>"; }

  function homeView() {
    var t = T(), st = stats(script), d = S.day === ymd() ? S.dayOk : 0, ls = LESSONS[script];
    var h = '<div class="kn-stat"><div><b>🔥 ' + streakNow() + "</b><span>" + esc(t.streak) + "</span></div><div><b>⭐ " + S.xp + "</b><span>" + esc(t.xp) + "</span></div><div><b>🎯 " + Math.min(d, DAILY_GOAL) + "/" + DAILY_GOAL + "</b><span>" + esc(t.goal) + "</span></div></div>" +
      '<div class="kn-tabs"><button type="button" class="kn-tab' + (script === "h" ? " on" : "") + '" data-a="tab" data-s="h">' + esc(t.tabH) + '</button><button type="button" class="kn-tab' + (script === "k" ? " on" : "") + '" data-a="tab" data-s="k">' + esc(t.tabK) + "</button></div>" +
      '<div class="kn-note" style="margin-top:0">' + st.mast + " / " + st.total + " " + esc(t.mast) + '</div><div class="kn-bar" style="margin:-6px 0 12px"><i style="width:' + Math.round(st.mast / st.total * 100) + '%"></i></div>';
    h += '<button type="button" class="kn-card" data-a="review"' + (st.due ? "" : " disabled") + '><div class="kn-ico hot">🔁</div><div class="kn-grow"><b>' + esc(t.review) + (st.due ? " · " + st.due : "") + "</b><small>" + esc(st.due ? t.reviewSub : t.reviewNone) + "</small></div></button>" +
      '<button type="button" class="kn-card" data-a="practice"' + (st.seen ? "" : " disabled") + '><div class="kn-ico">🎲</div><div class="kn-grow"><b>' + esc(t.practice) + "</b><small>" + esc(t.practiceSub) + "</small></div></button>" +
      '<button type="button" class="kn-card" data-a="speed"' + (st.seen >= 5 ? "" : " disabled") + '><div class="kn-ico">⚡</div><div class="kn-grow"><b>' + esc(t.speed) + "</b><small>" + esc(st.seen >= 5 ? t.speedSub + (S.best ? " · " + t.best + ": " + S.best : "") : t.seen) + "</small></div></button>" +
      '<button type="button" class="kn-card" data-a="chart"><div class="kn-ico">表</div><div class="kn-grow"><b>' + esc(t.chart) + "</b><small>" + esc(t.chartSub) + "</small></div></button>" +
      '<div class="kn-h">' + esc(t.lessons) + "</div>";
    ls.forEach(function (l) {
      var lm = lessonMast(l);
      h += '<button type="button" class="kn-card" data-a="lesson" data-n="' + l.n + '"><div class="kn-ico">' + (l.n + 1) + '</div><div class="kn-grow"><b>' + esc(l.title) + "</b><small>" + esc(l.items.slice(0, 6).map(function (x) { return x.c; }).join(" ")) + " · " + lm.m + "/" + lm.t + '</small><div class="kn-bar"><i style="width:' + Math.round(lm.m / lm.t * 100) + '%"></i></div></div></button>';
    });
    return h;
  }

  function lessonView() {
    var t = T(), l = LESSONS[script][cur.lessonN], h = head(t.lessonOf + " " + (l.n + 1) + " · " + l.title, true) + (noJa() ? '<div class="kn-note">🔈 ' + esc(t.noVoice) + "</div>" : "");
    l.items.forEach(function (it) {
      var ex = EX[it.s][it.c], base = it.rare ? BYID[it.s + (it.s === "k" ? kata(it.c === "ヂ" ? "じ" : "ず") : (it.c === "ぢ" ? "じ" : "ず"))] : null;
      h += '<div class="kn-ch"><div class="kn-big">' + esc(it.c) + '</div><div><div class="kn-ro">' + esc(it.r) + "</div>" +
        (it.rare && base ? '<div class="kn-ex">' + esc(t.rare) + " " + esc(base.c) + " (" + esc(base.r) + ")</div>" : "") +
        (ex ? '<div class="kn-ex">' + esc(t.example) + ": " + esc(ex[1]) + " (" + esc(ex[2]) + ") = " + esc(meaning(ex)) + "</div>" : "") +
        '</div><button type="button" class="kn-btn" data-a="say" data-c="' + esc(it.c) + '" aria-label="' + esc(t.hear) + '">🔊</button></div>';
    });
    return h + '<button type="button" class="kn-primary" data-a="start">' + esc(t.start) + "</button>";
  }

  function chartView() {
    var t = T(), h = head(t.chart, true) + (noJa() ? '<div class="kn-note">🔈 ' + esc(t.noVoice) + "</div>" : "");
    LESSONS[script].forEach(function (l) {
      h += '<div class="kn-h">' + esc(l.title) + '</div><div class="kn-chips">' + l.items.map(function (it) {
        return '<button type="button" class="kn-chip' + (isMast(it.id) ? " m" : isSeen(it.id) ? " s" : "") + '" data-a="say" data-c="' + esc(it.c) + '"><b>' + esc(it.c) + "</b><span>" + esc(it.r) + "</span></button>";
      }).join("") + "</div>";
    });
    return h;
  }

  function quizView() {
    var t = T(), q = cur.q, it = q.it, ans = cur.ans, h;
    var bar = cur.mode === "speed" ? '<span class="kn-time" id="knTime">' + Math.max(0, Math.ceil((cur.ends - Date.now()) / 1000)) + "s</span><b style=\"flex:none\">" + cur.score + " ✓</b>" : "<b>" + Math.min(cur.i + 1, cur.qs.length) + " / " + cur.qs.length + "</b>";
    h = '<div class="kn-top"><button type="button" class="kn-btn" data-a="back">←</button>' + bar + "</div>";
    var cap = q.type === "k2r" ? t.qK2r : q.type === "r2k" ? t.qR2k : q.type === "listen" ? t.qListen : t.qType;
    var face = q.type === "r2k" ? '<div class="kn-rq">' + esc(it.r) + "</div>" : q.type === "listen" ? '<button type="button" class="kn-btn" data-a="hear" style="font-size:34px;padding:12px 26px" aria-label="' + esc(t.hear) + '">🔊</button>' : '<div class="kn-big">' + esc(it.c) + "</div>";
    h += '<div class="kn-q">' + face + '<div class="kn-cap">' + esc(cap) + "</div></div>";
    if (q.type === "type") {
      h += '<input id="knIn" class="kn-in" type="text" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="' + esc(t.ph) + '"' + (ans ? " disabled" : "") + ' value="' + (ans ? esc(ans.val) : "") + '">' +
        (ans ? "" : '<button type="button" class="kn-primary" data-a="check">' + esc(t.check) + "</button>");
    } else {
      h += '<div class="kn-grid">' + q.opts.map(function (o, k) {
        var v = q.type === "k2r" ? o.r : o.c, c = "";
        if (ans) c = o.id === it.id ? " ok" : (v === ans.val ? " no" : "");
        return '<button type="button" class="kn-opt' + (q.type === "k2r" ? " r" : "") + c + '" data-a="opt" data-k="' + k + '"' + (ans ? " disabled" : "") + ">" + esc(v) + "</button>";
      }).join("") + "</div>";
    }
    if (ans) {
      h += '<div class="kn-fb ' + (ans.good ? "ok" : "no") + '">' + esc(ans.good ? t.right : t.wrong + ": " + it.c + " = " + it.r) + "</div>";
      if (cur.mode !== "speed") h += '<button type="button" class="kn-primary" data-a="next">' + esc(t.next) + "</button>";
    }
    return h;
  }

  function resultView() {
    var t = T(), h = head(cur.mode === "speed" ? t.time : t.done, false), tot = cur.tot, pct = tot ? Math.round(cur.ok / tot * 100) : 0;
    h += '<div class="kn-sum"><div class="kn-big">' + (cur.mode === "speed" ? cur.score : pct + "%") + '</div><div class="kn-cap">' + (cur.mode === "speed" ? esc(t.score) : cur.ok + " / " + tot + " " + esc(t.right2)) + "</div>" +
      '<div style="margin-top:10px;font-weight:700">+' + cur.xp + " " + esc(t.xp) + (cur.newBest ? " · 🏆 " + esc(t.newBest) : "") + "</div></div>" +
      '<button type="button" class="kn-primary" data-a="again">' + esc(t.again) + '</button><button type="button" class="kn-primary alt" data-a="home">' + esc(t.toHome) + "</button>";
    return h;
  }

  function render() {
    if (!el) return;
    var html = view === "home" ? homeView() : view === "lesson" ? lessonView() : view === "chart" ? chartView() : view === "quiz" ? quizView() : resultView();
    el.querySelector(".kn-body").innerHTML = html;
    el.querySelector(".sheet-title").textContent = T().title;
    if (view === "quiz" && !cur.ans) {
      var inp = el.querySelector("#knIn"); if (inp) setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
      if (cur.q.type === "listen") { clearTimeout(sayTm); sayTm = setTimeout(function () { say(cur.q.it.c); }, 250); }
    }
  }

  function pool(sc) { return QZ.filter(function (x) { return x.s === sc; }); }
  function onClick(e) {
    if (e.target === el) return close();
    var b = e.target.closest("[data-a]"); if (!b) return;
    var a = b.dataset.a;
    if (a === "tab") { script = b.dataset.s === "k" ? "k" : "h"; render(); }
    else if (a === "lesson") { cur = { lessonN: +b.dataset.n }; view = "lesson"; render(); }
    else if (a === "start") { var l = LESSONS[script][cur.lessonN], items = l.items.filter(function (x) { return !x.rare; }), n = Math.min(14, Math.max(8, items.length * 2)), seq = []; while (seq.length < n) seq = seq.concat(shuffle(items)); startSession("lesson", seq.slice(0, n), l.n); }
    else if (a === "review") { var due = pool(script).filter(function (x) { return isDue(x.id); }).sort(function (x, y) { return rec(x.id).due - rec(y.id).due; }).slice(0, 15); if (due.length) startSession("review", shuffle(due)); }
    else if (a === "practice") { var sn = pool(script).filter(function (x) { return isSeen(x.id); }).sort(function (x, y) { return rec(x.id).b - rec(y.id).b; }).slice(0, 12); if (sn.length) startSession("practice", shuffle(sn)); }
    else if (a === "speed") { var sp = pool(script).filter(function (x) { return isSeen(x.id); }); if (sp.length >= 5) startSession("speed", sp); }
    else if (a === "chart") { view = "chart"; render(); }
    else if (a === "say") say(b.dataset.c);
    else if (a === "hear") say(cur.q.it.c);
    else if (a === "opt") { var o = cur.q.opts[+b.dataset.k]; if (o) answer(cur.q.type === "k2r" ? o.r : o.c); }
    else if (a === "check") { var inp = el.querySelector("#knIn"); if (inp && inp.value.trim()) answer(inp.value); }
    else if (a === "next") nextQ();
    else if (a === "again") { var m = cur.mode, ls = cur.lesson; if (m === "lesson") { var l2 = LESSONS[script][ls], its = l2.items.filter(function (x) { return !x.rare; }), n2 = Math.min(14, Math.max(8, its.length * 2)), sq = []; while (sq.length < n2) sq = sq.concat(shuffle(its)); startSession("lesson", sq.slice(0, n2), ls); } else { goHome(); el.querySelector("[data-a=\"" + (m === "review" ? "review" : m === "speed" ? "speed" : "practice") + "\"]").click(); } }
    else if (a === "home") goHome();
    else if (a === "back") goBack();
  }
  function onKey(e) {
    if (e.key === "Enter" && view === "quiz" && cur && cur.q && cur.q.type === "type") { e.preventDefault(); if (cur.ans) nextQ(); else { var inp = el.querySelector("#knIn"); if (inp && inp.value.trim()) answer(inp.value); } }
    else if (e.key === "Enter" && view === "quiz" && cur && cur.ans && cur.mode !== "speed") { nextQ(); }
  }
  function goHome() { clearInterval(tm); clearTimeout(sayTm); try { speechSynthesis.cancel(); } catch (e) {} view = "home"; cur = null; render(); }
  function goBack() { if (view === "home") return close(); goHome(); }
  function close() { clearInterval(tm); clearTimeout(sayTm); if (!el) return; el.classList.remove("open"); try { speechSynthesis.cancel(); } catch (e) {} }

  window.KakeiboKana = {
    open: function (ctx) {
      host = ctx; css(); view = "home"; cur = null;
      if (!el) {
        el = document.createElement("div"); el.className = "sheet-backdrop"; el.id = "kanaBackdrop";
        el.innerHTML = '<div class="sheet"><div class="sheet-head"><div class="sheet-title"></div><button type="button" class="close-btn" id="kanaClose" aria-label="Close">✕</button></div><div class="kn-body"></div></div>';
        el.addEventListener("click", onClick); el.addEventListener("keydown", onKey); document.body.appendChild(el);
        el.querySelector("#kanaClose").addEventListener("click", close);
      }
      render(); requestAnimationFrame(function () { el.classList.add("open"); });
    },
    isOpen: function () { return !!el && el.classList.contains("open"); },
    back: function () { if (!el || !el.classList.contains("open")) return false; goBack(); return true; }
  };
})();
