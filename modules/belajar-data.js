/* Kakeibo · data modul Belajar Jepang
 * Format frasa: [jepang, romaji, [arti id, en, vi]]. Bahasa lain otomatis fallback ke en.
 * Tambah unit baru = tambah objek di bawah; tidak perlu menyentuh index.html. */
window.BELAJAR_DATA = { units: [
  { k: "intro", ico: "🤝", n: ["Perkenalan di tempat kerja baru", "Introducing yourself at a new job", "Giới thiệu bản thân ở chỗ làm mới"], p: [
    ["はじめまして。", "Hajimemashite.", ["Salam kenal.", "Nice to meet you.", "Rất vui được gặp bạn."]],
    ["〇〇です。〇〇から来ました。", "〇〇 desu. 〇〇 kara kimashita.", ["Saya 〇〇, dari 〇〇 (nama dan negara).", "I'm 〇〇, from 〇〇 (name and country).", "Tôi là 〇〇, đến từ 〇〇."]],
    ["日本語はまだ勉強中です。", "Nihongo wa mada benkyōchū desu.", ["Bahasa Jepang saya masih belajar.", "I'm still learning Japanese.", "Tôi vẫn đang học tiếng Nhật."]],
    ["ゆっくり話してください。", "Yukkuri hanashite kudasai.", ["Tolong bicara pelan-pelan.", "Please speak slowly.", "Xin hãy nói chậm thôi."]],
    ["もう一度お願いします。", "Mō ichido onegaishimasu.", ["Tolong ulangi sekali lagi.", "One more time, please.", "Xin hãy nhắc lại một lần nữa."]],
    ["頑張りますので、よろしくお願いします。", "Ganbarimasu node, yoroshiku onegaishimasu.", ["Saya akan berusaha, mohon bimbingannya.", "I'll do my best, please take care of me.", "Tôi sẽ cố gắng, mong được chỉ bảo."]]
  ] },
  { k: "bye", ico: "👋", n: ["Pamit dan akhir kontrak", "Saying goodbye", "Lời chào tạm biệt"], p: [
    ["今日で最後になります。", "Kyō de saigo ni narimasu.", ["Hari ini hari terakhir saya.", "Today is my last day.", "Hôm nay là ngày cuối của tôi."]],
    ["お世話になりました。", "Osewa ni narimashita.", ["Terima kasih atas semua bantuan Anda.", "Thank you for all your help and support.", "Cảm ơn mọi người đã giúp đỡ tôi."]],
    ["いろいろ教えていただき、ありがとうございました。", "Iroiro oshiete itadaki, arigatō gozaimashita.", ["Terima kasih sudah mengajari banyak hal.", "Thank you for teaching me so much.", "Cảm ơn đã dạy tôi nhiều điều."]],
    ["たくさん勉強になりました。", "Takusan benkyō ni narimashita.", ["Saya belajar banyak sekali.", "I learned a lot.", "Tôi đã học được rất nhiều."]],
    ["お先に失礼します。", "Osaki ni shitsurei shimasu.", ["Permisi, saya pulang duluan.", "Excuse me, I'm heading out first.", "Tôi xin phép về trước."]],
    ["皆さんもお元気で。", "Minasan mo ogenki de.", ["Kalian semua juga jaga kesehatan.", "Take care, everyone.", "Mọi người cũng giữ gìn sức khỏe nhé."]]
  ] },
  { k: "super", ico: "🛒", n: ["Belanja di supermarket", "At the supermarket", "Ở siêu thị"], p: [
    ["これはいくらですか。", "Kore wa ikura desu ka.", ["Ini berapa harganya?", "How much is this?", "Cái này giá bao nhiêu?"]],
    ["これは何が入っていますか。", "Kore wa nani ga haitte imasu ka.", ["Ini bahannya apa saja? (cek halal)", "What's in this? (halal check)", "Cái này có thành phần gì? (kiểm tra halal)"]],
    ["袋をください。", "Fukuro o kudasai.", ["Minta kantong belanja.", "A bag, please.", "Cho tôi một cái túi."]],
    ["袋はいりません。", "Fukuro wa irimasen.", ["Tidak usah pakai kantong.", "No bag needed.", "Tôi không cần túi."]],
    ["カードで払えますか。", "Kādo de haraemasu ka.", ["Bisa bayar pakai kartu?", "Can I pay by card?", "Tôi có thể trả bằng thẻ không?"]],
    ["レシートをお願いします。", "Reshīto o onegaishimasu.", ["Tolong struknya.", "Receipt, please.", "Cho tôi hóa đơn."]]
  ] },
  { k: "kon", ico: "🏪", n: ["Di konbini", "At the convenience store", "Ở cửa hàng tiện lợi"], p: [
    ["温めてください。", "Atatamete kudasai.", ["Tolong dihangatkan.", "Please heat it up.", "Làm ơn hâm nóng giúp."]],
    ["温めますか。", "Atatamemasu ka.", ["Mau dihangatkan? (kata kasir; jawab: お願いします / 大丈夫です)", "Want it heated? (clerk says; answer: お願いします / 大丈夫です)", "Có muốn hâm nóng không? (nhân viên hỏi)"]],
    ["箸をください。", "Hashi o kudasai.", ["Minta sumpit.", "Chopsticks, please.", "Cho tôi đũa."]],
    ["ポイントカードはお持ちですか。", "Pointo kādo wa omochi desu ka.", ["Punya kartu poin? (kata kasir; jawab: 持っていません)", "Do you have a point card? (clerk says; reply: 持っていません = I don't)", "Bạn có thẻ tích điểm không? (nhân viên hỏi)"]],
    ["公共料金を払いたいです。", "Kōkyō ryōkin o haraitai desu.", ["Saya mau bayar tagihan (listrik, air, dll).", "I'd like to pay a utility bill.", "Tôi muốn thanh toán hóa đơn điện nước."]],
    ["ATMはどこですか。", "ATM wa doko desu ka.", ["ATM di mana?", "Where is the ATM?", "Máy ATM ở đâu?"]]
  ] }
] };
