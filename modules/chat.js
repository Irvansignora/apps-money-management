/* Kakeibo · modul Chat Lintas Bahasa v3 (chat 1:1, grup, navbar) (lazy-load, mandiri).
 * Host: window.KakeiboChat.open({ lang, esc }). Backend: Worker chat.iranza.com (override: window.KAKEIBO_CHAT_API). */
(function () {
  "use strict";
  var API = window.KAKEIBO_CHAT_API || "https://chat.iranza.com", KEY = "kakeibo-chat-auth";
  var LG = [["id", "ID", "Indonesia"], ["ja", "JA", "日本語"], ["en", "EN", "English"], ["my", "MY", "မြန်မာ"], ["bn", "BN", "বাংলা"], ["vi", "VI", "Tiếng Việt"], ["th", "TH", "ไทย"], ["zh", "ZH", "中文"], ["ko", "KO", "한국어"]];
  var UI = {
    id: { pushOff: "Aktifkan notifikasi pesan dan panggilan", pushOn: "Notifikasi aktif. Ketuk untuk mematikan.", pushDenied: "Notifikasi diblokir. Izinkan di pengaturan browser.", pushNo: "Browser ini tidak mendukung notifikasi.", pushIos: "Di iPhone: tambahkan Kakeibo ke Layar Utama dulu untuk notifikasi.", pushFail: "Gagal mengaktifkan notifikasi.", rec: "Merekam", micFail: "Mikrofon tidak bisa dipakai. Cek izin browser.", vnTx: "Mentranskrip...", vnQuota: "Kuota transkrip bulan ini habis. Premium punya lebih banyak.", callAudio: "Telepon", callVideo: "Video call", calling: "Memanggil...", incoming: "Panggilan masuk", incomingV: "Video call masuk", accept: "Terima", decline: "Tolak", mute: "Bisukan", unmute: "Bunyikan", camOff: "Matikan kamera", camOn: "Nyalakan kamera", endCall: "Akhiri", connecting: "Menyambungkan...", rejected: "Panggilan ditolak.", busy: "Sedang dalam panggilan lain.", unavailable: "Teman sedang offline. Panggilan hanya bisa saat dua-duanya membuka chat.", permCall: "Izin mikrofon atau kamera ditolak.", callEnded: "Panggilan berakhir.", callMax: "Batas waktu panggilan paket gratis tercapai.", denyVideo: "Video call khusus Premium.", denyCalls: "Batas panggilan harian tercapai.", failedCall: "Panggilan gagal tersambung.", noAnswer: "Tidak dijawab.", limPhoto: "Batas foto harian paket gratis tercapai.", limVoice: "Batas voice note harian paket gratis tercapai.", limVoiceLen: "Voice note paket gratis maksimal {n} detik.", seePremium: "Lihat Premium", shut: "Tutup", acc: "Akun dan Premium", accPlan: "Paket", planFree: "Gratis", planPrem: "Premium", until: "Aktif sampai", usage: "Pemakaian", uTr: "Terjemahan bulan ini", uPhoto: "Foto hari ini", uVoice: "Voice note hari ini", uVn: "Transkrip voice note bulan ini", compare: "Gratis dan Premium", cTr: "Terjemahan per bulan", cPhoto: "Foto per hari", cVoice: "Voice note per hari", cVoiceLen: "Durasi voice note", cVn: "Transkrip voice note per bulan", cCall: "Durasi telepon", cVideo: "Video call", yes: "Ada", no: "Tidak", min: "mnt", sec: "dtk", upgrade: "Upgrade ke Premium", renew: "Perpanjang Premium", upgradeNote: "Pembayaran otomatis belum tersedia. Premium diaktifkan manual oleh admin setelah pembayaran.", upgradeNone: "Hubungi admin untuk upgrade.", lim: "Batas paket tercapai.", photo: "Foto", caption: "Tambah keterangan (opsional)", sendPhoto: "Kirim", mediaT: "Media dan tautan", tabMedia: "Media", tabLinks: "Tautan", noMedia: "Belum ada foto di percakapan ini.", noLinks: "Belum ada tautan.", upFail: "Foto gagal dikirim. Coba lagi.", t: "Chat Lintas Bahasa", hero: "Ngobrol tanpa batas bahasa", heroSub: "Tulis dalam bahasamu. Temanmu membacanya dalam bahasa mereka, otomatis.", email: "Email kamu", sendc: "Kirim kode masuk", sending: "Mengirim…", code: "Kode 6 digit", login: "Masuk", name: "Namamu", mylang: "Bahasamu", mail: "Kode dikirim ke", resend: "Kirim ulang", resendIn: "Kirim ulang dalam", prof: "Akun baru! Isi nama dan bahasamu dulu.", mine: "Kode undanganmu", share: "Bagikan", copy: "Salin", copied: "Tersalin ✓", addph: "Masukkan kode teman", add: "Tambah", none: "Belum ada teman", noneSub: "Bagikan kode undanganmu atau masukkan kode temanmu di atas.", friends: "Teman", typ: "Tulis pesan…", off: "Terputus. Menyambung ulang…", wait: "menerjemahkan", fail: "terjemahan gagal", quota: "kuota terjemahan bulan ini habis", retry: "Coba lagi", on: "online", offl: "offline", typing: "sedang mengetik…", today: "Hari ini", yday: "Kemarin", you: "Kamu", avChange: "Ganti foto", avK: "Pakai foto profil Kakeibo", avDel: "Hapus foto", avUp: "Mengunggah…", avShared: "Foto ini terlihat oleh teman chat-mu.", avLocal: "Foto Kakeibo-mu belum dibagikan ke teman. Ketuk “Pakai foto profil Kakeibo”.", avNone: "Belum ada foto. Temanmu melihat inisial namamu.", wpUpload: "Upload foto sendiri", wpBlur: "Blur latar", settings: "Pengaturan", profT: "Profil", useK: "Pakai nama dari profil Kakeibo", wp: "Wallpaper chat", wpGal: "Foto dari galeri", wpDim: "Redupkan latar", wpReset: "Kembali ke default", wpBig: "Foto terlalu besar/gagal dibaca", savedP: "Profil tersimpan ✓", langNote: "Bahasa baru dipakai untuk pesan berikutnya.", save: "Simpan", saved: "Tersimpan ✓", out: "Keluar", outAsk: "Keluar dari akun ini?", outYes: "Ya, keluar", cancel: "Batal", shareTxt: "Chat denganku di Kakeibo, pesannya otomatis diterjemahkan! Kode undangan: ", empty: "Belum ada pesan. Sapa duluan 👋", seesAs: "Dibaca sebagai",
      e: { limit: "Batas paket tercapai.", email: "Email tidak valid.", wait: "Tunggu 30 detik sebelum minta kode lagi.", limit: "Terlalu banyak percobaan. Coba lagi nanti.", code: "Kode salah.", expired: "Kode kedaluwarsa. Minta kode baru.", notfound: "Kode undangan tidak ditemukan.", self: "Itu kodemu sendiri 😄", profile: "Isi nama dan bahasa.", net: "Tidak bisa terhubung ke server.", server: "Terjadi kesalahan. Coba lagi.", rate: "Pelan-pelan, kebanyakan pesan dalam 1 menit.", auth: "Sesi habis, silakan masuk lagi.", wpbig: "Foto terlalu besar atau gagal dibaca.", avatar: "Foto ditolak server. Coba foto lain.", avfail: "Foto gagal diproses. Coba foto lain." } },
    en: { pushOff: "Turn on message and call notifications", pushOn: "Notifications on. Tap to turn off.", pushDenied: "Notifications are blocked. Allow them in browser settings.", pushNo: "This browser does not support notifications.", pushIos: "On iPhone: add Kakeibo to the Home Screen first to get notifications.", pushFail: "Could not turn on notifications.", rec: "Recording", micFail: "Cannot use the microphone. Check browser permissions.", vnTx: "Transcribing...", vnQuota: "Transcription quota used up this month. Premium has more.", callAudio: "Call", callVideo: "Video call", calling: "Calling...", incoming: "Incoming call", incomingV: "Incoming video call", accept: "Accept", decline: "Decline", mute: "Mute", unmute: "Unmute", camOff: "Camera off", camOn: "Camera on", endCall: "End", connecting: "Connecting...", rejected: "Call declined.", busy: "Already in another call.", unavailable: "Your friend is offline. Calls only work when both of you have the chat open.", permCall: "Microphone or camera permission denied.", callEnded: "Call ended.", callMax: "Free plan call time limit reached.", denyVideo: "Video calls are Premium only.", denyCalls: "Daily call limit reached.", failedCall: "The call could not connect.", noAnswer: "No answer.", limPhoto: "Free plan daily photo limit reached.", limVoice: "Free plan daily voice note limit reached.", limVoiceLen: "Free plan voice notes are limited to {n} seconds.", seePremium: "See Premium", shut: "Close", acc: "Account and Premium", accPlan: "Plan", planFree: "Free", planPrem: "Premium", until: "Active until", usage: "Usage", uTr: "Translations this month", uPhoto: "Photos today", uVoice: "Voice notes today", uVn: "Voice transcripts this month", compare: "Free and Premium", cTr: "Translations per month", cPhoto: "Photos per day", cVoice: "Voice notes per day", cVoiceLen: "Voice note length", cVn: "Voice transcripts per month", cCall: "Call length", cVideo: "Video calls", yes: "Yes", no: "No", min: "min", sec: "sec", upgrade: "Upgrade to Premium", renew: "Renew Premium", upgradeNote: "Automatic payment is not available yet. Premium is activated manually by an admin after payment.", upgradeNone: "Contact the admin to upgrade.", lim: "Plan limit reached.", photo: "Photo", caption: "Add a caption (optional)", sendPhoto: "Send", mediaT: "Media and links", tabMedia: "Media", tabLinks: "Links", noMedia: "No photos in this chat yet.", noLinks: "No links yet.", upFail: "Photo failed to send. Try again.", t: "Cross-Language Chat", hero: "Chat without language barriers", heroSub: "Write in your language. Your friend reads it in theirs, automatically.", email: "Your email", sendc: "Send sign-in code", sending: "Sending…", code: "6-digit code", login: "Sign in", name: "Your name", mylang: "Your language", mail: "Code sent to", resend: "Resend", resendIn: "Resend in", prof: "New account! Enter your name and language first.", mine: "Your invite code", share: "Share", copy: "Copy", copied: "Copied ✓", addph: "Enter friend's code", add: "Add", none: "No friends yet", noneSub: "Share your invite code or enter a friend's code above.", friends: "Friends", typ: "Type a message…", off: "Disconnected. Reconnecting…", wait: "translating", fail: "translation failed", quota: "translation quota used up this month", retry: "Retry", on: "online", offl: "offline", typing: "typing…", today: "Today", yday: "Yesterday", you: "You", avChange: "Change photo", avK: "Use Kakeibo profile photo", avDel: "Remove photo", avUp: "Uploading…", avShared: "Your chat friends can see this photo.", avLocal: "Your Kakeibo photo is not shared yet. Tap “Use Kakeibo profile photo”.", avNone: "No photo yet. Friends see your initial.", wpUpload: "Upload your own photo", wpBlur: "Blur background", settings: "Settings", profT: "Profile", useK: "Use name from Kakeibo profile", wp: "Chat wallpaper", wpGal: "Photo from gallery", wpDim: "Dim background", wpReset: "Back to default", wpBig: "Photo too large / unreadable", savedP: "Profile saved ✓", langNote: "The new language applies to your next messages.", save: "Save", saved: "Saved ✓", out: "Sign out", outAsk: "Sign out of this account?", outYes: "Yes, sign out", cancel: "Cancel", shareTxt: "Chat with me on Kakeibo, messages are translated automatically! Invite code: ", empty: "No messages yet. Say hi 👋", seesAs: "Read as",
      e: { limit: "Plan limit reached.", email: "Invalid email.", wait: "Wait 30 seconds before requesting another code.", limit: "Too many attempts. Try again later.", code: "Wrong code.", expired: "Code expired. Request a new one.", notfound: "Invite code not found.", self: "That's your own code 😄", profile: "Enter a name and language.", net: "Cannot reach the server.", server: "Something went wrong. Try again.", rate: "Slow down, too many messages in a minute.", auth: "Session expired, please sign in again.", wpbig: "Photo too large or unreadable.", avatar: "Photo rejected by the server. Try another.", avfail: "Could not process the photo. Try another." } }
  };
  var UIX = {
    id: { tabChat: "Chat", tabGroups: "Grup", tabMe: "Akun", tabHome: "Kembali ke Kakeibo", newT: "Mulai", chatsSub: "Pesanmu diterjemahkan otomatis.", groupsSub: "Ngobrol bareng, tiap orang membaca dalam bahasanya.", search: "Cari nama",
      emptyChats: "Belum ada teman", emptyChatsSub: "Tambahkan temanmu pakai kode undangan, lalu mulai ngobrol.", addFriend: "Tambah teman",
      emptyGroups: "Belum ada grup", emptyGroupsSub: "Buat grup baru, atau gabung pakai kode dari temanmu.", mkGroup: "Buat grup", joinGroup: "Gabung pakai kode",
      actFriend: "Tambah teman", actFriendSub: "Pakai kode undangan", actGroup: "Buat grup", actGroupSub: "Pilih dari daftar temanmu", actJoin: "Gabung grup", actJoinSub: "Punya kode grup?",
      groupNew: "Grup baru", gName: "Nama grup", gNamePh: "Contoh: Tim Osaka", gPick: "Pilih anggota", gPicked: "dipilih", gMax: "Maksimal {n} anggota termasuk kamu.", gNoFriends: "Belum ada teman untuk dipilih. Kamu tetap bisa membuat grup lalu membagikan kodenya.", gCreate: "Buat grup", gCreating: "Membuat…",
      gLimGroups: "Batas {n} grup buatanmu sudah tercapai. Premium punya batas lebih besar.", gJoinT: "Gabung grup", gCodePh: "Kode grup", gJoin: "Gabung", gMembers: "anggota", gInfo: "Info grup", gInvite: "Kode grup", gAddM: "Tambah anggota", gAddDo: "Tambahkan", gNoAdd: "Semua temanmu sudah ada di grup ini.",
      gOwner: "Pemilik", gYou: "Kamu", gRemove: "Keluarkan", gRemoveAsk: "Keluarkan {n} dari grup?", gRename: "Ganti nama grup", gLeave: "Keluar dari grup", gLeaveAsk: "Keluar dari grup ini? Kamu tidak akan menerima pesannya lagi.", gLeaveYes: "Ya, keluar", gGone: "Kamu tidak lagi ada di grup ini.",
      gShareTxt: "Gabung grup chatku di Kakeibo, pesannya diterjemahkan otomatis! Kode grup: ", fontT: "Ukuran teks", fontS: "Kecil", fontM: "Sedang", fontL: "Besar", seasonFx: "Animasi musim", seasonFxSub: "Kelopak dan daun jatuh sesuai musim.", newMsgs: "Pesan belum dibaca", unread: "belum dibaca", kImg: "Foto", kAud: "Pesan suara", friendAdded: "Teman ditambahkan.",
      setGen: "Pengaturan", setPlan: "Paket dan undangan", notif: "Notifikasi pesan dan panggilan", pushOnS: "Aktif", pushOffS: "Mati", profRow: "Nama dan bahasa", planT: "Paket dan pemakaian",
      sys: { create: "{n} membuat grup", join: "{n} bergabung", leave: "{n} keluar", kick: "{n} dikeluarkan", rename: "{n} mengganti nama grup menjadi {g}" },
      e: { gname: "Isi nama grup.", gfull: "Grup sudah penuh.", forbidden: "Hanya pemilik grup yang bisa melakukan ini." } },
    en: { tabChat: "Chats", tabGroups: "Groups", tabMe: "Account", tabHome: "Back to Kakeibo", newT: "Start", chatsSub: "Your messages are translated automatically.", groupsSub: "Chat together, everyone reads in their own language.", search: "Search name",
      emptyChats: "No friends yet", emptyChatsSub: "Add a friend with their invite code, then start chatting.", addFriend: "Add friend",
      emptyGroups: "No groups yet", emptyGroupsSub: "Create a group, or join with a code from a friend.", mkGroup: "Create group", joinGroup: "Join with a code",
      actFriend: "Add friend", actFriendSub: "Use an invite code", actGroup: "Create group", actGroupSub: "Pick from your friends", actJoin: "Join group", actJoinSub: "Got a group code?",
      groupNew: "New group", gName: "Group name", gNamePh: "e.g. Osaka crew", gPick: "Pick members", gPicked: "selected", gMax: "Up to {n} members including you.", gNoFriends: "No friends to pick yet. You can still create the group and share its code.", gCreate: "Create group", gCreating: "Creating…",
      gLimGroups: "You reached the limit of {n} groups. Premium has a higher limit.", gJoinT: "Join group", gCodePh: "Group code", gJoin: "Join", gMembers: "members", gInfo: "Group info", gInvite: "Group code", gAddM: "Add members", gAddDo: "Add", gNoAdd: "All your friends are already in this group.",
      gOwner: "Owner", gYou: "You", gRemove: "Remove", gRemoveAsk: "Remove {n} from the group?", gRename: "Rename group", gLeave: "Leave group", gLeaveAsk: "Leave this group? You will stop receiving its messages.", gLeaveYes: "Yes, leave", gGone: "You are no longer in this group.",
      gShareTxt: "Join my group chat on Kakeibo, messages are translated automatically! Group code: ", fontT: "Text size", fontS: "Small", fontM: "Medium", fontL: "Large", seasonFx: "Seasonal animation", seasonFxSub: "Petals and leaves that follow the season.", newMsgs: "Unread messages", unread: "unread", kImg: "Photo", kAud: "Voice note", friendAdded: "Friend added.",
      setGen: "Settings", setPlan: "Plan and invites", notif: "Message and call notifications", pushOnS: "On", pushOffS: "Off", profRow: "Name and language", planT: "Plan and usage",
      sys: { create: "{n} created the group", join: "{n} joined", leave: "{n} left", kick: "{n} was removed", rename: "{n} renamed the group to {g}" },
      e: { gname: "Enter a group name.", gfull: "This group is full.", forbidden: "Only the group owner can do this." } },
    my: { pushOff: "မက်ဆေ့ချ်နှင့် ဖုန်းခေါ်ဆိုမှု သတိပေးချက်များ ဖွင့်ရန်", pushOn: "သတိပေးချက် ဖွင့်ထားသည်။ ပိတ်ရန် နှိပ်ပါ။", pushDenied: "သတိပေးချက်များကို ပိတ်ထားသည်။ ဘရောက်ဇာ ဆက်တင်တွင် ခွင့်ပြုပါ။", pushNo: "ဤဘရောက်ဇာသည် သတိပေးချက်များကို မပံ့ပိုးပါ။", pushIos: "iPhone တွင် သတိပေးချက်ရရန် Kakeibo ကို Home Screen သို့ အရင်ထည့်ပါ။", pushFail: "သတိပေးချက် ဖွင့်၍မရပါ။",
      rec: "အသံသွင်းနေသည်", micFail: "မိုက်ခရိုဖုန်း အသုံးပြု၍မရပါ။ ဘရောက်ဇာ ခွင့်ပြုချက်ကို စစ်ဆေးပါ။", vnTx: "စာသားပြောင်းနေသည်...", vnQuota: "ဤလအတွက် စာသားပြောင်းခွင့် ကုန်သွားပြီ။ Premium တွင် ပိုများသည်။",
      callAudio: "ဖုန်းခေါ်", callVideo: "ဗီဒီယိုခေါ်ဆို", calling: "ခေါ်နေသည်...", incoming: "ဝင်လာသော ခေါ်ဆိုမှု", incomingV: "ဝင်လာသော ဗီဒီယိုခေါ်ဆိုမှု", accept: "ကိုင်မည်", decline: "ပယ်ချမည်", mute: "အသံပိတ်", unmute: "အသံဖွင့်", camOff: "ကင်မရာပိတ်", camOn: "ကင်မရာဖွင့်", endCall: "ချမည်", connecting: "ချိတ်ဆက်နေသည်...", rejected: "ခေါ်ဆိုမှုကို ပယ်ချလိုက်သည်။", busy: "အခြားခေါ်ဆိုမှုတစ်ခုတွင် ရှိနေပြီ။",
      unavailable: "သူငယ်ချင်း အော့ဖ်လိုင်းဖြစ်နေသည်။ နှစ်ဦးစလုံး ချက်တ်ဖွင့်ထားမှသာ ခေါ်လို့ရသည်။", permCall: "မိုက်ခရိုဖုန်း သို့မဟုတ် ကင်မရာ ခွင့်ပြုချက် ငြင်းပယ်ခံရသည်။", callEnded: "ခေါ်ဆိုမှု ပြီးဆုံးပြီ။", callMax: "အခမဲ့အစီအစဉ်၏ ခေါ်ဆိုချိန် ကန့်သတ်ချက် ပြည့်သွားပြီ။", denyVideo: "ဗီဒီယိုခေါ်ဆိုမှုသည် Premium အတွက်သာ ဖြစ်သည်။", denyCalls: "ယနေ့ခေါ်ဆိုမှု ကန့်သတ်ချက် ပြည့်သွားပြီ။", failedCall: "ခေါ်ဆိုမှု ချိတ်ဆက်၍ မရပါ။", noAnswer: "ဖုန်းမကိုင်ပါ။",
      limPhoto: "အခမဲ့အစီအစဉ်၏ တစ်ရက်ဓာတ်ပုံ ကန့်သတ်ချက် ပြည့်သွားပြီ။", limVoice: "အခမဲ့အစီအစဉ်၏ တစ်ရက်အသံမက်ဆေ့ချ် ကန့်သတ်ချက် ပြည့်သွားပြီ။", limVoiceLen: "အခမဲ့အစီအစဉ်တွင် အသံမက်ဆေ့ချ်ကို {n} စက္ကန့်အထိသာ ပို့နိုင်သည်။", seePremium: "Premium ကြည့်ရန်", shut: "ပိတ်ရန်",
      acc: "အကောင့်နှင့် Premium", accPlan: "အစီအစဉ်", planFree: "အခမဲ့", planPrem: "Premium", until: "သက်တမ်းကုန်ရက်", usage: "အသုံးပြုမှု", uTr: "ဤလ ဘာသာပြန်ချက်များ", uPhoto: "ယနေ့ ဓာတ်ပုံများ", uVoice: "ယနေ့ အသံမက်ဆေ့ချ်များ", uVn: "ဤလ အသံမှစာသား",
      compare: "အခမဲ့နှင့် Premium", cTr: "တစ်လလျှင် ဘာသာပြန်ချက်", cPhoto: "တစ်ရက်လျှင် ဓာတ်ပုံ", cVoice: "တစ်ရက်လျှင် အသံမက်ဆေ့ချ်", cVoiceLen: "အသံမက်ဆေ့ချ် အရှည်", cVn: "တစ်လလျှင် အသံမှစာသား", cCall: "ခေါ်ဆိုချိန်", cVideo: "ဗီဒီယိုခေါ်ဆိုမှု", yes: "ရသည်", no: "မရပါ", min: "မိနစ်", sec: "စက္ကန့်",
      upgrade: "Premium သို့ တိုးမြှင့်ရန်", renew: "Premium သက်တမ်းတိုးရန်", upgradeNote: "အလိုအလျောက် ငွေပေးချေမှု မရသေးပါ။ ငွေပေးချေပြီးနောက် အက်ဒမင်က Premium ကို ကိုယ်တိုင်ဖွင့်ပေးမည်။", upgradeNone: "တိုးမြှင့်ရန် အက်ဒမင်ကို ဆက်သွယ်ပါ။", lim: "အစီအစဉ် ကန့်သတ်ချက် ပြည့်သွားပြီ။",
      photo: "ဓာတ်ပုံ", caption: "ဖော်ပြချက်ထည့်ပါ (မထည့်လည်းရ)", sendPhoto: "ပို့မည်", mediaT: "မီဒီယာနှင့် လင့်ခ်များ", tabMedia: "မီဒီယာ", tabLinks: "လင့်ခ်", noMedia: "ဤချက်တ်တွင် ဓာတ်ပုံ မရှိသေးပါ။", noLinks: "လင့်ခ် မရှိသေးပါ။", upFail: "ဓာတ်ပုံပို့၍ မရပါ။ ထပ်ကြိုးစားပါ။",
      t: "ဘာသာစကားစုံ ချက်တ်", hero: "ဘာသာစကား အတားအဆီးမရှိ စကားပြောပါ", heroSub: "သင့်ဘာသာစကားဖြင့် ရေးပါ။ သူငယ်ချင်းက သူ့ဘာသာစကားဖြင့် အလိုအလျောက် ဖတ်ရမည်။", email: "သင့်အီးမေးလ်", sendc: "ဝင်ရောက်ရန်ကုဒ် ပို့ရန်", sending: "ပို့နေသည်…", code: "ဂဏန်း ၆ လုံးကုဒ်", login: "ဝင်ရောက်ရန်", name: "သင့်အမည်", mylang: "သင့်ဘာသာစကား", mail: "ကုဒ်ပို့ပြီး —", resend: "ပြန်ပို့ရန်", resendIn: "ပြန်ပို့နိုင်ချိန်", prof: "အကောင့်အသစ်! အမည်နှင့် ဘာသာစကားကို အရင်ထည့်ပါ။",
      mine: "သင့်ဖိတ်ကြားကုဒ်", share: "မျှဝေရန်", copy: "ကူးယူရန်", copied: "ကူးပြီး ✓", addph: "သူငယ်ချင်း၏ ကုဒ်ထည့်ပါ", add: "ထည့်ရန်", none: "သူငယ်ချင်း မရှိသေးပါ", noneSub: "သင့်ဖိတ်ကြားကုဒ်ကို မျှဝေပါ သို့မဟုတ် သူငယ်ချင်း၏ကုဒ်ကို ထည့်ပါ။", friends: "သူငယ်ချင်းများ",
      typ: "မက်ဆေ့ချ်ရိုက်ပါ…", off: "ချိတ်ဆက်မှု ပြတ်သွားသည်။ ပြန်ချိတ်နေသည်…", wait: "ဘာသာပြန်နေသည်", fail: "ဘာသာပြန်၍ မရပါ", quota: "ဤလ ဘာသာပြန်ခွင့် ကုန်သွားပြီ", retry: "ထပ်ကြိုးစားရန်", on: "အွန်လိုင်း", offl: "အော့ဖ်လိုင်း", typing: "ရိုက်နေသည်…", today: "ယနေ့", yday: "မနေ့က", you: "သင်",
      avChange: "ဓာတ်ပုံပြောင်းရန်", avK: "Kakeibo ပရိုဖိုင်ဓာတ်ပုံ သုံးရန်", avDel: "ဓာတ်ပုံဖယ်ရန်", avUp: "တင်နေသည်…", avShared: "သင့်ချက်တ်သူငယ်ချင်းများ ဤဓာတ်ပုံကို မြင်နိုင်သည်။", avLocal: "သင့် Kakeibo ဓာတ်ပုံကို မျှဝေရသေးပါ။ “Kakeibo ပရိုဖိုင်ဓာတ်ပုံ သုံးရန်” ကို နှိပ်ပါ။", avNone: "ဓာတ်ပုံ မရှိသေးပါ။ သူငယ်ချင်းများ သင့်အမည်၏ ပထမစာလုံးကို မြင်ရမည်။",
      wpUpload: "ကိုယ်ပိုင်ဓာတ်ပုံ တင်ရန်", wpBlur: "နောက်ခံ ဝါးရန်", settings: "ဆက်တင်", profT: "ပရိုဖိုင်", useK: "Kakeibo ပရိုဖိုင်မှ အမည်သုံးရန်", wp: "ချက်တ်နောက်ခံ", wpGal: "ဂယ်လရီမှ ဓာတ်ပုံ", wpDim: "နောက်ခံ မှောင်ရန်", wpReset: "မူလအတိုင်း ပြန်ထားရန်", wpBig: "ဓာတ်ပုံ ကြီးလွန်းသည် / ဖတ်၍မရပါ",
      savedP: "ပရိုဖိုင် သိမ်းပြီး ✓", langNote: "ဘာသာစကားအသစ်သည် နောက်ပို့မည့် မက်ဆေ့ချ်များတွင် သက်ရောက်သည်။", save: "သိမ်းရန်", saved: "သိမ်းပြီး ✓", out: "ထွက်ရန်", outAsk: "ဤအကောင့်မှ ထွက်မလား?", outYes: "ဟုတ်ကဲ့၊ ထွက်မည်", cancel: "မလုပ်တော့ပါ",
      shareTxt: "Kakeibo တွင် ကျွန်တော်/ကျွန်မနှင့် စကားပြောပါ၊ မက်ဆေ့ချ်များ အလိုအလျောက် ဘာသာပြန်ပေးသည်! ဖိတ်ကြားကုဒ်: ", empty: "မက်ဆေ့ချ် မရှိသေးပါ။ မင်္ဂလာပါ ပြောလိုက်ပါ 👋", seesAs: "ဖတ်ရသည့်ဘာသာ",
      tabChat: "ချက်တ်", tabGroups: "အုပ်စု", tabMe: "အကောင့်", tabHome: "Kakeibo သို့ ပြန်သွားရန်", newT: "စတင်ရန်", chatsSub: "သင့်မက်ဆေ့ချ်များကို အလိုအလျောက် ဘာသာပြန်ပေးသည်။", groupsSub: "အတူစကားပြောပါ၊ တစ်ဦးချင်းစီ ကိုယ့်ဘာသာစကားဖြင့် ဖတ်ရသည်။", search: "အမည်ရှာရန်",
      emptyChats: "သူငယ်ချင်း မရှိသေးပါ", emptyChatsSub: "ဖိတ်ကြားကုဒ်ဖြင့် သူငယ်ချင်းကို ထည့်ပြီး စကားစပြောပါ။", addFriend: "သူငယ်ချင်းထည့်ရန်", emptyGroups: "အုပ်စု မရှိသေးပါ", emptyGroupsSub: "အုပ်စုအသစ်ဖွင့်ပါ၊ သို့မဟုတ် သူငယ်ချင်းပေးသည့်ကုဒ်ဖြင့် ဝင်ပါ။", mkGroup: "အုပ်စုဖွင့်ရန်", joinGroup: "ကုဒ်ဖြင့် ဝင်ရန်",
      actFriend: "သူငယ်ချင်းထည့်ရန်", actFriendSub: "ဖိတ်ကြားကုဒ် သုံးရန်", actGroup: "အုပ်စုဖွင့်ရန်", actGroupSub: "သူငယ်ချင်းစာရင်းမှ ရွေးပါ", actJoin: "အုပ်စုဝင်ရန်", actJoinSub: "အုပ်စုကုဒ် ရှိလား?",
      groupNew: "အုပ်စုအသစ်", gName: "အုပ်စုအမည်", gNamePh: "ဥပမာ - Osaka အဖွဲ့", gPick: "အဖွဲ့ဝင်များ ရွေးပါ", gPicked: "ရွေးထားသည်", gMax: "သင်အပါအဝင် အများဆုံး {n} ယောက်။", gNoFriends: "ရွေးရန် သူငယ်ချင်း မရှိသေးပါ။ အုပ်စုဖွင့်ပြီး ကုဒ်ကို မျှဝေနိုင်သည်။", gCreate: "အုပ်စုဖွင့်ရန်", gCreating: "ဖွင့်နေသည်…",
      gLimGroups: "သင်ဖွင့်နိုင်သော အုပ်စု {n} ခု ပြည့်သွားပြီ။ Premium တွင် ပိုများသည်။", gJoinT: "အုပ်စုဝင်ရန်", gCodePh: "အုပ်စုကုဒ်", gJoin: "ဝင်ရန်", gMembers: "ဦး", gInfo: "အုပ်စုအချက်အလက်", gInvite: "အုပ်စုကုဒ်", gAddM: "အဖွဲ့ဝင်ထည့်ရန်", gAddDo: "ထည့်ရန်", gNoAdd: "သင့်သူငယ်ချင်းအားလုံး ဤအုပ်စုတွင် ရှိပြီးသားဖြစ်သည်။",
      gOwner: "ပိုင်ရှင်", gYou: "သင်", gRemove: "ဖယ်ထုတ်ရန်", gRemoveAsk: "{n} ကို အုပ်စုမှ ဖယ်ထုတ်မလား?", gRename: "အုပ်စုအမည်ပြောင်းရန်", gLeave: "အုပ်စုမှ ထွက်ရန်", gLeaveAsk: "ဤအုပ်စုမှ ထွက်မလား? မက်ဆေ့ချ်များ ဆက်လက်မရတော့ပါ။", gLeaveYes: "ဟုတ်ကဲ့၊ ထွက်မည်", gGone: "သင်သည် ဤအုပ်စုတွင် မရှိတော့ပါ။",
      gShareTxt: "Kakeibo တွင် ကျွန်တော်/ကျွန်မ၏ အုပ်စုချက်တ်သို့ ဝင်ပါ၊ မက်ဆေ့ချ်များ အလိုအလျောက် ဘာသာပြန်ပေးသည်! အုပ်စုကုဒ်: ", kImg: "ဓာတ်ပုံ", kAud: "အသံမက်ဆေ့ချ်", friendAdded: "သူငယ်ချင်း ထည့်ပြီးပါပြီ။",
      setGen: "ဆက်တင်", setPlan: "အစီအစဉ်နှင့် ဖိတ်ကြားမှု", notif: "မက်ဆေ့ချ်နှင့် ဖုန်းခေါ်ဆိုမှု သတိပေးချက်", pushOnS: "ဖွင့်", pushOffS: "ပိတ်", profRow: "အမည်နှင့် ဘာသာစကား", planT: "အစီအစဉ်နှင့် အသုံးပြုမှု",
      fontT: "စာလုံးအရွယ်အစား", fontS: "သေး", fontM: "အလယ်", fontL: "ကြီး", seasonFx: "ရာသီ animation", seasonFxSub: "ရာသီနှင့်ညီသော ပန်းပွင့်/အရွက်များ ကျလာမည်။", newMsgs: "မဖတ်ရသေးသော မက်ဆေ့ချ်များ", unread: "မဖတ်ရသေး",
      sys: { create: "{n} က အုပ်စုဖွင့်လိုက်သည်", join: "{n} ဝင်လာသည်", leave: "{n} ထွက်သွားသည်", kick: "{n} ကို ဖယ်ထုတ်လိုက်သည်", rename: "{n} က အုပ်စုအမည်ကို {g} သို့ ပြောင်းလိုက်သည်" },
      e: { limit: "ကြိုးစားမှု များလွန်းသည်။ နောက်မှ ထပ်ကြိုးစားပါ။", email: "အီးမေးလ် မမှန်ပါ။", wait: "ကုဒ်အသစ် မတောင်းမီ စက္ကန့် ၃၀ စောင့်ပါ။", code: "ကုဒ် မမှန်ပါ။", expired: "ကုဒ် သက်တမ်းကုန်သွားပြီ။ အသစ်တောင်းပါ။", notfound: "ဖိတ်ကြားကုဒ် မတွေ့ပါ။", self: "ဒါ သင့်ကိုယ်ပိုင်ကုဒ်ပါ 😄", profile: "အမည်နှင့် ဘာသာစကား ထည့်ပါ။", net: "ဆာဗာသို့ ချိတ်ဆက်၍ မရပါ။", server: "တစ်ခုခု မှားသွားသည်။ ထပ်ကြိုးစားပါ။", rate: "နှေးနှေးလုပ်ပါ၊ တစ်မိနစ်အတွင်း မက်ဆေ့ချ် များလွန်းသည်။", auth: "အချိန်ကုန်သွားပြီ၊ ပြန်ဝင်ပါ။", wpbig: "ဓာတ်ပုံ ကြီးလွန်းသည် သို့မဟုတ် ဖတ်၍မရပါ။", avatar: "ဆာဗာက ဓာတ်ပုံကို ပယ်ချလိုက်သည်။ တစ်ခြားတစ်ပုံ စမ်းပါ။", avfail: "ဓာတ်ပုံ ပြုပြင်၍မရပါ။ တစ်ခြားတစ်ပုံ စမ်းပါ။", gname: "အုပ်စုအမည် ထည့်ပါ။", gfull: "ဤအုပ်စု ပြည့်နေပါပြီ။", forbidden: "အုပ်စုပိုင်ရှင်သာ ဤအလုပ်ကို လုပ်နိုင်သည်။" } }
  };
  ["id", "en", "my"].forEach(function (k) { var x = UIX[k]; UI[k] = UI[k] || { e: {} }; Object.assign(UI[k].e, x.e); delete x.e; Object.assign(UI[k], x); });
  var COL = ["#ac3527", "#223a5c", "#d9822f", "#4a7c59", "#7a5c9e", "#2f7f8a"];
  var A = { tok: null, user: null }, host, root, view, tmp = {}, ws, peer, msgs = [], me, onl = [], retry = 0, closing = true, rt, pingT, typT, peerTyping = false, peerTypT, contacts = [], groups = [], tab = "chats", GI = null, GM = {}, newCnt = 0, newFrom = null, newDone = false, pollT = null, cdT, lastTypeSent = 0;
  try { A = Object.assign(A, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  var store = function () { try { localStorage.setItem(KEY, JSON.stringify({ tok: A.tok, user: A.user })); } catch (e) {} };
  var TC = {}, T = function () { var l = host.lang; if (!TC[l]) { var b = UI.en, o = UI[l]; TC[l] = o && o !== b ? Object.assign({}, b, o, { e: Object.assign({}, b.e, o.e), sys: Object.assign({}, b.sys, o.sys) }) : b; } return TC[l]; };
  // ukuran teks chat: kecil / sedang (bawaan) / besar; disimpan per perangkat
  function planLbl(p) { return p === "plus" ? "Premium+" : p === "premium" ? T().planPrem : T().planFree; }
  var FSKEY = "kakeibo-chat-fs", FSK = "m", FSV = { s: .82, m: .9, l: 1 };
  try { var fq = localStorage.getItem(FSKEY); if (FSV[fq]) FSK = fq; } catch (e) {}
  function applyFs() { if (root) root.style.setProperty("--kfs", FSV[FSK]); }
  var esc = function (s) { return host && host.esc ? host.esc(s) : String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var fl = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? '<i class="kc-fg kc-fg-' + c + '" role="img" aria-label="' + x[2] + '"></i>' : ""; };
  var ln = function (c) { var x = LG.filter(function (l) { return l[0] === c; })[0]; return x ? x[2] : c; };
  var $ = function (s) { return root.querySelector(s); };
  var avCol = function (n) { var h = 0, s = String(n || "?"); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return COL[h % COL.length]; };
  var av = function (n, sz) { return '<span class="kc-av" style="--c:' + avCol(n) + ";width:" + (sz || 42) + "px;height:" + (sz || 42) + "px;font-size:" + Math.round((sz || 42) * .42) + 'px">' + esc(Array.from(String(n || "?"))[0] || "?").toUpperCase() + "</span>"; };
  var kp = function () { try { var p = JSON.parse(localStorage.getItem("jp-finance-profile") || "{}"); return { name: String(p.name || "").trim(), photo: /^data:image\//.test(p.photo || "") ? p.photo : "" }; } catch (e) { return { name: "", photo: "" }; } };
  var avImg = function (src, sz) { return '<span class="kc-av" style="width:' + sz + "px;height:" + sz + 'px;background:#fff"><img src="' + esc(src) + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block" onerror="this.style.display=\'none\'"></span>'; };
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
          if (!r.ok) throw { code: j.error || "server", what: j.what, plan: j.plan, max: j.max };
          return j;
        });
      });
  }
  function wipe() { A.tok = null; A.user = null; store(); try { if (window.KakeiboAuth) window.KakeiboAuth.onLogout(); } catch (e) {} }
  function err(e) { var n = $("#kcSheet #kcErr") || $("#kcErr"); if (!n) return; var t = T(); n.textContent = e && e.code === "glimit" ? (e.what === "groups" ? t.gLimGroups : t.gMax).replace("{n}", e.max) : t.e[e && e.code] || t.e.server; n.classList.add("on"); }
  function clearErr() { var n = $("#kcSheet #kcErr") || $("#kcErr"); if (n) { n.textContent = ""; n.classList.remove("on"); } }
  function busy(b, on, txt) { if (!b) return; b.disabled = !!on; if (txt != null) b.dataset.t = b.dataset.t || b.textContent; b.textContent = on ? (txt || "…") : (b.dataset.t || b.textContent); }

  function css() {
    if (document.getElementById("chatCss")) return;
    var s = document.createElement("style"); s.id = "chatCss";
    s.textContent = [
      ".kc-av{flex:0 0 auto;border-radius:50%;background:var(--c);color:#fff;font-family:'Shippori Mincho',serif;font-weight:800;display:inline-flex;align-items:center;justify-content:center}",
      ".kc-scroll{flex:1;min-height:0;overflow-y:auto;padding:16px 16px calc(env(safe-area-inset-bottom,0px) + 20px);-webkit-overflow-scrolling:touch}",
      ".kc-scroll:has(.kc-hero){background:var(--kbg) url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2748%27%20height=%2724%27%3E%3Cg%20fill=%27none%27%20stroke=%27%23d9cfb2%27%20stroke-width=%271.4%27%3E%3Ccircle%20cx=%270%27%20cy=%2724%27%20r=%2724%27/%3E%3Ccircle%20cx=%270%27%20cy=%2724%27%20r=%2717%27/%3E%3Ccircle%20cx=%270%27%20cy=%2724%27%20r=%2710%27/%3E%3Ccircle%20cx=%2748%27%20cy=%2724%27%20r=%2724%27/%3E%3Ccircle%20cx=%2748%27%20cy=%2724%27%20r=%2717%27/%3E%3Ccircle%20cx=%2748%27%20cy=%2724%27%20r=%2710%27/%3E%3Ccircle%20cx=%2724%27%20cy=%2712%27%20r=%2724%27/%3E%3Ccircle%20cx=%2724%27%20cy=%2712%27%20r=%2717%27/%3E%3Ccircle%20cx=%2724%27%20cy=%2712%27%20r=%2710%27/%3E%3C/g%3E%3C/svg%3E) bottom/48px 24px repeat-x;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 40px)}",
      ".kc-hero{padding:calc(env(safe-area-inset-top,0px) + 16px) 24px 4px;position:relative}.kc-hero .x{position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);right:8px}",
      ".kc-seal{width:56px;height:56px;border-radius:16px;background:var(--kv);color:#fff;display:grid;place-items:center;font:800 calc(29px*var(--kfs)) 'Shippori Mincho',serif;margin-top:10px}",
      ".kc-hero h2{font:800 calc(30px*var(--kfs))/1.15 'Shippori Mincho',serif;margin:24px 0 10px;color:var(--kink)}.kc-hero p{margin:0;font-size:calc(14px*var(--kfs));line-height:1.55;color:var(--kmu);max-width:34ch}",
      ".kc-demo{margin-top:22px;display:flex;flex-direction:column;gap:8px}.kc-demo div{max-width:88%;padding:9px 13px;border-radius:16px;font-size:calc(13.5px*var(--kfs));line-height:1.4;opacity:0;animation:riseIn .5s forwards}.kc-demo .l{background:#fff;box-shadow:0 1px 2px rgba(23,35,61,.07);border-bottom-left-radius:5px}.kc-demo .r{align-self:flex-end;background:var(--kv);color:#fff;border-bottom-right-radius:5px}.kc-demo small{display:block;opacity:.65;font-size:calc(11.5px*var(--kfs));margin-top:4px}",
      ".kc-form{padding:22px 24px calc(env(safe-area-inset-bottom,0px) + 24px)}",
      ".kc-in{width:100%;font:inherit;font-size:calc(16px*var(--kfs));padding:14px 16px;border-radius:14px;border:1px solid var(--kline);background:#fff;color:var(--kink);margin-bottom:10px;outline:0}.kc-in:focus{border-color:var(--kv);box-shadow:0 0 0 1px var(--kv)}",
      ".kc-otp{text-align:center;font:700 calc(28px*var(--kfs)) 'JetBrains Mono',monospace;letter-spacing:.45em;padding-left:.45em}",
      ".kc-btn{width:100%;padding:14px;border:0;border-radius:14px;background:var(--kv);color:#fff;font:600 calc(15px*var(--kfs)) Inter,sans-serif;cursor:pointer;min-height:50px}.kc-btn:active{background:var(--kv-d)}.kc-btn:disabled{opacity:.55}.kc-btn.sm{width:auto;padding:11px 18px;font-size:calc(13.5px*var(--kfs));min-height:46px}.kc-btn.ghost{background:var(--kv-t);color:var(--kv)}.kc-btn.navy{background:var(--kv)}",
      ".kc-note{font-size:calc(13px*var(--kfs));color:var(--kmu);line-height:1.55;margin:2px 2px 12px}.kc-note b{color:var(--kink)}.kc-link{background:none;border:0;color:var(--kv);font:600 calc(13.5px*var(--kfs)) Inter,sans-serif;cursor:pointer;padding:12px 6px}.kc-link:disabled{color:var(--kmu)}",
      "#kcErr{font-size:calc(13px*var(--kfs));color:#c93a52;background:#fdecef;border-radius:10px;padding:0 12px;max-height:0;overflow:hidden;opacity:0;transition:all .2s;margin-bottom:0}#kcErr.on{max-height:60px;opacity:1;padding:9px 12px;margin-bottom:10px}",
      ".kc-lang{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.kc-lang button{border:1px solid var(--kline);background:#fff;border-radius:12px;padding:11px 4px;font:500 calc(12px*var(--kfs)) Inter,sans-serif;color:var(--kmu);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:58px}.kc-lang button b{font:700 calc(15px*var(--kfs)) Inter,sans-serif;letter-spacing:.05em;color:var(--kink)}.kc-lang button.sel{border:1.5px solid var(--kv);background:var(--kv-t);color:var(--kv)}.kc-lang button.sel b{color:var(--kv)}",
      ".kc-add{display:flex;gap:8px;margin-bottom:6px}.kc-add .kc-in{margin:0;flex:1;text-transform:uppercase;letter-spacing:.12em;font-weight:600}",
      ".kc-h{font:600 calc(12.5px*var(--kfs)) Inter,sans-serif;color:var(--kmu);margin:18px 4px 6px}",
      ".kc-sk{height:68px;border-radius:16px;margin-bottom:8px;background:linear-gradient(90deg,#fff,#f6f0df,#fff);background-size:200% 100%;animation:kcSh 1.4s infinite}@keyframes kcSh{to{background-position:-200% 0}}",
      ".kc-row{display:flex;align-items:flex-end;gap:8px;margin-top:6px;animation:riseIn .25s both}.kc-row.me{justify-content:flex-end}.kc-row.cont{margin-top:0}.kc-ra{flex:0 0 28px;width:28px;height:28px;display:block}",
      ".kc-m{max-width:78%;display:flex;flex-direction:column}.kc-m.me{align-items:flex-end}",
      ".kc-tm{display:block;text-align:right;font-size:calc(10.5px*var(--kfs));margin-top:3px;color:var(--kmu);font-variant-numeric:tabular-nums;white-space:normal}.kc-m.me .kc-tm{color:rgba(255,255,255,.75)}.kc-ck{font-style:normal;margin-left:5px}.kc-ck.pend::before{content:'';display:inline-block;width:8px;height:8px;border:1.5px solid currentColor;border-radius:50%;vertical-align:-1px}",
      ".kc-o{font-size:calc(12.5px*var(--kfs));line-height:1.45;margin-top:8px;padding-top:8px;border-top:1px solid #e8dfc8;color:var(--kmu);white-space:pre-wrap}.kc-m.me .kc-o{border-top-color:rgba(255,255,255,.25);color:rgba(255,255,255,.82)}",
      ".kc-cd{font:700 calc(9.5px*var(--kfs)) Inter,sans-serif;font-style:normal;letter-spacing:.06em;border:1px solid currentColor;border-radius:4px;padding:1px 4px;margin-right:7px;vertical-align:1px;opacity:.7}",
      ".kc-st{font-size:calc(12px*var(--kfs));margin-top:8px;padding-top:8px;border-top:1px solid #e8dfc8;color:var(--kmu);display:flex;align-items:center;gap:6px}.kc-st.bad{color:#c93a52}.kc-m.me .kc-st{color:rgba(255,255,255,.8);border-top-color:rgba(255,255,255,.25)}.kc-st button{border:0;background:none;color:inherit;text-decoration:underline;font:inherit;cursor:pointer;padding:4px 2px}",
      ".kc-dots{display:inline-flex;gap:3px}.kc-dots i{width:4px;height:4px;border-radius:50%;background:currentColor;animation:kcB 1s infinite}.kc-dots i:nth-child(2){animation-delay:.15s}.kc-dots i:nth-child(3){animation-delay:.3s}@keyframes kcB{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}",
      ".kc-sheet{position:absolute;inset:0;background:rgba(23,35,61,.5);display:flex;align-items:flex-end;z-index:5;animation:fadeIn .2s both}.kc-sheet>div{width:100%;background:#fff;border-radius:24px 24px 0 0;padding:10px 20px calc(env(safe-area-inset-bottom,0px) + 20px);max-height:88%;overflow-y:auto;animation:sheetUp .3s cubic-bezier(.16,1,.3,1) both}.kc-sheet .grab{width:36px;height:4px;border-radius:99px;background:var(--kline);margin:6px auto 14px}.kc-sheet h3{font:700 calc(19px*var(--kfs)) 'Shippori Mincho',serif;margin:0 0 12px}",
      ".kc-wps{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.kc-wps button{border:0;background:none;padding:0;font:600 calc(11px*var(--kfs)) Inter,sans-serif;color:var(--kink);cursor:pointer;text-align:center}.kc-wps i{display:block;aspect-ratio:3/4;border-radius:12px;border:1.5px solid var(--kline);margin-bottom:5px;background-color:var(--kbg);background-size:cover;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:calc(22px*var(--kfs));overflow:hidden}.kc-wps button.sel i{border-color:var(--kv);box-shadow:0 0 0 1px var(--kv)}",
      ".kc-sheet.clear{background:transparent}.kc-sheet.clear>div{box-shadow:0 -12px 34px rgba(23,35,61,.25);max-height:66%}.kc-rng{width:100%;accent-color:var(--kv);margin:4px 0 14px}.kc-sep{height:1px;background:var(--kline);margin:16px 0}",
      "@media (prefers-reduced-motion:reduce){.kc-view,.kc-row,.kc-demo div{animation:none!important;opacity:1!important}}",
      ".kc-b.has-img{padding:4px 4px 7px;overflow:hidden}.kc-b.has-img .kc-cp{padding:7px 9px 0;white-space:pre-wrap}.kc-b.has-img .kc-o,.kc-b.has-img .kc-st{margin-left:9px;margin-right:9px}.kc-b.has-img .kc-tm{padding:0 9px}",
      ".kc-im{display:block;width:min(260px,64vw);border-radius:12px;overflow:hidden;background:#e8dfc8;position:relative;cursor:pointer}.kc-im img{display:block;width:100%;height:100%;object-fit:cover}",
      ".kc-up{position:absolute;inset:0;background:rgba(23,35,61,.35)}.kc-up::after{content:'';position:absolute;left:50%;top:50%;width:22px;height:22px;margin:-11px;border:2.5px solid #fff;border-top-color:transparent;border-radius:50%;animation:kcSpin .8s linear infinite}@keyframes kcSpin{to{transform:rotate(360deg)}}",
      ".kc-prev{display:block;width:100%;max-height:46vh;object-fit:contain;border-radius:12px;background:var(--kbg);margin-bottom:12px}",
      ".kc-view-img{position:absolute;inset:0;z-index:8;background:rgba(12,18,32,.94);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s both}.kc-view-img img{max-width:100%;max-height:100%;object-fit:contain}.kc-view-img .kc-ib{position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);right:8px;color:#fff}",
      ".kc-tabs{display:flex;gap:6px;background:var(--kbg);border-radius:12px;padding:4px;margin-bottom:14px}.kc-tabs button{flex:1;border:0;background:transparent;border-radius:9px;padding:9px;font:600 calc(13px*var(--kfs)) Inter,sans-serif;color:var(--kmu);cursor:pointer}.kc-tabs button.on{background:#fff;color:var(--kv);box-shadow:0 1px 2px rgba(23,35,61,.08)}",
      ".kc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.kc-gi{aspect-ratio:1;border:0;padding:0;background:#e8dfc8;border-radius:8px;overflow:hidden;cursor:pointer}.kc-gi img{width:100%;height:100%;object-fit:cover;display:block}.kc-sheet.tall>div{min-height:58%}",
      ".kc-lk{display:block;padding:12px 2px;border-bottom:1px solid var(--kline);text-decoration:none;color:var(--kink);word-break:break-all}.kc-lk b{display:block;font-size:calc(14px*var(--kfs));color:var(--kv)}.kc-lk span{font-size:calc(12px*var(--kfs));color:var(--kmu)}",
      ".kc-comp.rec>*:not(.kc-recbar){display:none!important}.kc-recbar{display:none;align-items:center;gap:12px;flex:1}.kc-comp.rec .kc-recbar{display:flex}.kc-rdot{width:10px;height:10px;border-radius:50%;background:#d6455d;animation:kcBl 1.2s ease-in-out infinite}@keyframes kcBl{50%{opacity:.25}}.kc-recbar b{font:600 calc(15px*var(--kfs)) Inter,sans-serif;font-variant-numeric:tabular-nums}.kc-rh{flex:1;font-size:calc(13px*var(--kfs));color:var(--kmu)}",
      ".kc-au{display:flex;align-items:center;gap:10px;min-width:200px;padding:4px 4px 2px}.kc-pl{width:38px;height:38px;border-radius:50%;border:0;background:var(--kv);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 38px}.kc-m.me .kc-pl{background:#fff;color:var(--kv)}",
      ".kc-wv{flex:1;height:4px;border-radius:99px;background:rgba(34,58,92,.18);overflow:hidden}.kc-wv i{display:block;height:100%;background:var(--kv)}.kc-m.me .kc-wv{background:rgba(255,255,255,.3)}.kc-m.me .kc-wv i{background:#fff}.kc-du{font:600 calc(12px*var(--kfs)) Inter,sans-serif;font-variant-numeric:tabular-nums;min-width:34px;text-align:right}",
      ".kc-sp2{width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:kcSpin .8s linear infinite;opacity:.6}.kc-b.has-aud .kc-cp{padding-top:6px}",
      ".kc-call{position:absolute;inset:0;z-index:9;background:#17233d;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;animation:fadeIn .2s both;padding:calc(env(safe-area-inset-top,0px) + 40px) 20px calc(env(safe-area-inset-bottom,0px) + 36px)}",
      ".kc-rv{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#17233d;opacity:0;pointer-events:none}.kc-call.video.live .kc-rv{opacity:1}.kc-lv{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);right:12px;width:96px;height:132px;object-fit:cover;border-radius:12px;background:#2c4568;display:none;z-index:2}.kc-call.video .kc-lv{display:block}",
      ".kc-cmid{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:6vh}.kc-cn{font:700 calc(24px*var(--kfs)) 'Shippori Mincho',serif}.kc-cs{font-size:calc(14px*var(--kfs));color:rgba(255,255,255,.72);font-variant-numeric:tabular-nums}.kc-call.video.live .kc-cmid{margin-top:0;align-self:flex-start}.kc-call.video.live .kc-cmid .kc-av{display:none}",
      ".kc-cbar{position:relative;z-index:1;display:flex;gap:22px;justify-content:center;align-items:flex-start}.kc-cb{width:68px;border:0;background:none;color:#fff;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;font:500 calc(12px*var(--kfs)) Inter,sans-serif}.kc-cb svg{width:64px;height:64px;padding:19px;border-radius:50%;background:rgba(255,255,255,.14);box-sizing:border-box}.kc-cb.red svg{background:#d6455d}.kc-cb.red svg{transform:rotate(135deg)}.kc-cb.grn svg{background:#1fa971}.kc-cb.on svg{background:#fff;color:#17233d}",
      ".kc-plan{background:var(--kv);color:#fff;border-radius:18px;padding:18px;margin-bottom:6px}.kc-plan .lb{font-size:calc(12.5px*var(--kfs));color:rgba(255,255,255,.78);margin-top:2px}.kc-plan .pn{font:800 calc(28px*var(--kfs)) 'Shippori Mincho',serif;margin:4px 0}.kc-plan.prem{background:var(--kink)}",
      ".kc-um{margin:12px 2px}.kc-um .r{display:flex;justify-content:space-between;font-size:calc(13px*var(--kfs));margin-bottom:6px}.kc-um .r b{font-variant-numeric:tabular-nums}.kc-bar2{height:6px;border-radius:99px;background:var(--kline);overflow:hidden}.kc-bar2 i{display:block;height:100%;background:var(--kv)}",
      ".kc-cmp{width:100%;border-collapse:collapse;font-size:calc(13px*var(--kfs));background:#fff;border-radius:12px;overflow:hidden}.kc-cmp th,.kc-cmp td{padding:10px 8px;text-align:center;border-bottom:1px solid var(--kline)}.kc-cmp td:first-child,.kc-cmp th:first-child{text-align:left;color:var(--kmu)}.kc-cmp .pr{color:var(--kv);font-weight:700}.kc-cmp tr:last-child td{border-bottom:0}",
      ".kc-fg{display:inline-block;width:1.2em;height:1.2em;border-radius:50%;background-size:cover;background-position:center;vertical-align:-.22em;flex:0 0 auto}",
      ".kc-fg-id{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Im0wIDI1NiAyNDkuNi00MS4zTDUxMiAyNTZ2MjU2SDB6Ii8+PHBhdGggZmlsbD0iI2Q4MDAyNyIgZD0iTTAgMGg1MTJ2MjU2SDB6Ii8+PC9nPjwvc3ZnPg==)}",
      ".kc-fg-ja{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Ik0wIDBoNTEydjUxMkgweiIvPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTExLjMiIGZpbGw9IiNkODAwMjciLz48L2c+PC9zdmc+)}",
      ".kc-fg-en{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Im0wIDAgOCAyMi04IDIzdjIzbDMyIDU0LTMyIDU0djMybDMyIDQ4LTMyIDQ4djMybDMyIDU0LTMyIDU0djY4bDIyLTggMjMgOGgyM2w1NC0zMiA1NCAzMmgzMmw0OC0zMiA0OCAzMmgzMmw1NC0zMiA1NCAzMmg2OGwtOC0yMiA4LTIzdi0yM2wtMzItNTQgMzItNTR2LTMybC0zMi00OCAzMi00OHYtMzJsLTMyLTU0IDMyLTU0VjBsLTIyIDgtMjMtOGgtMjNsLTU0IDMyLTU0LTMyaC0zMmwtNDggMzItNDgtMzJoLTMybC01NCAzMkw2OCAwSDB6Ii8+PHBhdGggZmlsbD0iIzAwNTJiNCIgZD0iTTMzNiAwdjEwOEw0NDQgMFptMTc2IDY4TDQwNCAxNzZoMTA4ek0wIDE3NmgxMDhMMCA2OFpNNjggMGwxMDggMTA4VjBabTEwOCA1MTJWNDA0TDY4IDUxMlpNMCA0NDRsMTA4LTEwOEgwWm01MTItMTA4SDQwNGwxMDggMTA4Wm0tNjggMTc2TDMzNiA0MDR2MTA4eiIvPjxwYXRoIGZpbGw9IiNkODAwMjciIGQ9Ik0wIDB2NDVsMTMxIDEzMWg0NUwwIDB6bTIwOCAwdjIwOEgwdjk2aDIwOHYyMDhoOTZWMzA0aDIwOHYtOTZIMzA0VjBoLTk2em0yNTkgMEwzMzYgMTMxdjQ1TDUxMiAwaC00NXpNMTc2IDMzNiAwIDUxMmg0NWwxMzEtMTMxdi00NXptMTYwIDAgMTc2IDE3NnYtNDVMMzgxIDMzNmgtNDV6Ii8+PC9nPjwvc3ZnPg==)}",
      ".kc-fg-my{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiM2ZGE1NDQiIGQ9Im0wIDE2NyAyNTMuOC0xOS4zTDUxMiAxNjd2MTc4bC0yNTQuOSAzMi4zTDAgMzQ1eiIvPjxwYXRoIGZpbGw9IiNmZmRhNDQiIGQ9Ik0wIDBoNTEydjE2N0gweiIvPjxwYXRoIGZpbGw9IiNkODAwMjciIGQ9Ik0wIDM0NWg1MTJ2MTY3SDB6Ii8+PHBhdGggZmlsbD0iI2VlZSIgZD0iTTQzMS41IDIxNi41aC0xMzRMMjU2IDg5bC00MS40IDEyNy42aC0xMzRsMTA4LjMgNzguOEwxNDcuNSA0MjMgMjU2IDM0NWwxMDguNSA3OC00MS40LTEyNy42eiIvPjwvZz48L3N2Zz4=)}",
      ".kc-fg-bn{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiM0OTZlMmQiIGQ9Ik0wIDBoNTEydjUxMkgweiIvPjxjaXJjbGUgY3g9IjIwMC4zIiBjeT0iMjU2IiByPSIxMTEuMyIgZmlsbD0iI2Q4MDAyNyIvPjwvZz48L3N2Zz4=)}",
      ".kc-fg-vi{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNkODAwMjciIGQ9Ik0wIDBoNTEydjUxMkgwWiIvPjxwYXRoIGZpbGw9IiNmZmRhNDQiIGQ9Im0xNzYgMzc4IDIwOC0xNTBIMTI4bDIwOCAxNTAtODAtMjQ0WiIvPjwvZz48L3N2Zz4=)}",
      ".kc-fg-th{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNkODAwMjciIGQ9Ik0wIDBoNTEydjg5bC03OS4yIDE2My43TDUxMiA0MjN2ODlIMHYtODlsODIuNy0xNjkuNkwwIDg5eiIvPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Ik0wIDg5aDUxMnY3OGwtNDIuNiA5MS4yTDUxMiAzNDV2NzhIMHYtNzhsNDAtOTIuNUwwIDE2N3oiLz48cGF0aCBmaWxsPSIjMDA1MmI0IiBkPSJNMCAxNjdoNTEydjE3OEgweiIvPjwvZz48L3N2Zz4=)}",
      ".kc-fg-zh{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNkODAwMjciIGQ9Ik0wIDBoNTEydjUxMkgweiIvPjxwYXRoIGZpbGw9IiNmZmRhNDQiIGQ9Im0xNDAuMSAxNTUuOCAyMi4xIDY4aDcxLjVsLTU3LjggNDIuMSAyMi4xIDY4LTU3LjktNDItNTcuOSA0MiAyMi4yLTY4LTU3LjktNDIuMUgxMTh6bTE2My40IDI0MC43LTE2LjktMjAuOC0yNSA5LjcgMTQuNS0yMi41LTE2LjktMjAuOSAyNS45IDYuOSAxNC42LTIyLjUgMS40IDI2LjggMjYgNi45LTI1LjEgOS42em0zMy42LTYxIDgtMjUuNi0yMS45LTE1LjUgMjYuOC0uNCA3LjktMjUuNiA4LjcgMjUuNCAyNi44LS4zLTIxLjUgMTYgOC42IDI1LjQtMjEuOS0xNS41em00NS4zLTE0Ny42TDM3MC42IDIxMmwxOS4yIDE4LjctMjYuNS0zLjgtMTEuOCAyNC00LjYtMjYuNC0yNi42LTMuOCAyMy44LTEyLjUtNC42LTI2LjUgMTkuMiAxOC43em0tNzguMi03My0yIDI2LjcgMjQuOSAxMC4xLTI2LjEgNi40LTEuOSAyNi44LTE0LjEtMjIuOC0yNi4xIDYuNCAxNy4zLTIwLjUtMTQuMi0yMi43IDI0LjkgMTAuMXoiLz48L2c+PC9zdmc+)}",
      ".kc-fg-ko{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PG1hc2sgaWQ9ImEiPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMjU2IiBmaWxsPSIjZmZmIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjYSkiPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Ik0wIDBoNTEydjUxMkgwWiIvPjxwYXRoIGZpbGw9IiMzMzMiIGQ9Im0zNTAgMzM1IDI0LTI0IDE2IDE2LTI0IDIzem0tMzkgMzkgMjQtMjQgMTUgMTYtMjMgMjR6bTg3IDggMjMtMjQgMTYgMTYtMjQgMjR6bS00MCAzOSAyNC0yMyAxNiAxNS0yNCAyNFptMTYtNjMgMjQtMjMgMTUgMTUtMjMgMjR6bS0zOSA0MCAyMy0yNCAxNiAxNi0yNCAyM3ptNjMtMjIxLTYzLTYzIDE1LTE1IDY0IDYzem0tNjMtMTUtMjQtMjQgMTYtMTYgMjMgMjR6bTM5IDM5LTI0LTI0IDE2LTE1IDI0IDIzem04LTg3LTI0LTIzIDE2LTE2IDI0IDI0Wm0zOSA0MC0yMy0yNCAxNS0xNiAyNCAyNFpNOTEgMzU4bDYzIDYzLTE2IDE2LTYzLTYzem02MyAxNiAyMyAyNC0xNSAxNS0yNC0yM3ptLTQwLTM5IDI0IDIzLTE2IDE2LTIzLTI0em0yNC0yNCA2MyA2My0xNiAxNi02My02M3ptMTYtMjIwLTYzIDYzLTE2LTE2IDYzLTYzem0yMyAyMy02MyA2My0xNS0xNiA2My02M3ptMjQgMjQtNjMgNjMtMTYtMTYgNjMtNjN6Ii8+PHBhdGggZmlsbD0iI2Q4MDAyNyIgZD0iTTMxOSAzMTkgMTkzIDE5M2E4OSA4OSAwIDEgMSAxMjYgMTI2eiIvPjxwYXRoIGZpbGw9IiMwMDUyYjQiIGQ9Ik0zMTkgMzE5YTg5IDg5IDAgMSAxLTEyNi0xMjZ6Ii8+PGNpcmNsZSBjeD0iMjI0LjUiIGN5PSIyMjQuNSIgcj0iNDQuNSIgZmlsbD0iI2Q4MDAyNyIvPjxjaXJjbGUgY3g9IjI4Ny41IiBjeT0iMjg3LjUiIHI9IjQ0LjUiIGZpbGw9IiMwMDUyYjQiLz48L2c+PC9zdmc+)}",
      ".kc-fg-x{display:none}",
      ":root{--kgrad:linear-gradient(135deg,#17233d 0%,#2c4568 100%);--kgh:linear-gradient(135deg,#cf4a34 0%,#ac3527 100%);--kh:#ac3527;--ko:#d9822f}",
      ".kc-cd{border:0;padding:0;margin-right:7px;opacity:1;vertical-align:-2px;display:inline-block}.kc-cd .kc-fg{width:14px;height:14px;vertical-align:-2px}",
      ".kc-lang button b{display:flex;align-items:center;justify-content:center}.kc-lang button b .kc-fg{width:30px;height:30px}.kc-lang button.sel{border-color:#223a5c;background:#fff}",
      ".kc-plan{background:var(--kgrad)}.kc-plan.prem{background:linear-gradient(135deg,#d9822f 0%,#ac3527 100%)}",
      ".kc-bar2 i{background:linear-gradient(90deg,#d9822f,#ac3527)}.kc-wv i{background:linear-gradient(90deg,#d9822f,#ac3527)}",
      "#kcRoot{--kv:var(--ai-2,#223a5c);--kv-d:var(--ai,#17233d);--kv-t:#e8dfc8;--kbg:var(--washi,#ece3ce);--kcard:var(--card,#fbf7ea);--kink:var(--sumi,#2a251d);--kmu:#6d6759;--kline:rgba(122,110,80,.24);--kon:#1fa971;--kh:var(--hanko,#ac3527);--kh2:var(--hanko-2,#c9432f);--kacc:var(--acc-rgb,217,130,47);--kacc2:var(--acc2-rgb,172,53,39);--kfs:.9;--kpaper:radial-gradient(95% 58% at 6% 20%,var(--s1,transparent) 0%,transparent 74%),radial-gradient(90% 62% at 100% 52%,var(--s2,transparent) 0%,transparent 74%),radial-gradient(100% 62% at 30% 100%,var(--s3,transparent) 0%,transparent 74%),linear-gradient(180deg,rgba(250,243,226,.6),rgba(232,220,192,.6))}",
      "html.kc-open #seasonFx{z-index:71!important}html.kc-conv #seasonFx{opacity:.5}",
      "#kcRoot{position:fixed;inset:0;z-index:70;display:none;justify-content:center;background:rgba(23,35,61,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}#kcRoot.open{display:flex;animation:fadeIn .2s both}",
      ".kc-app{width:100%;max-width:480px;height:100%;height:100dvh;background:var(--kpaper),var(--kbg);color:var(--kink);display:flex;flex-direction:column;position:relative;overflow:hidden;animation:sheetUp .35s cubic-bezier(.16,1,.3,1) both;font-family:Inter,sans-serif}",
      ".kc-view{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;animation:riseIn .3s both}",
      ".kc-head{display:flex;align-items:center;gap:8px;padding:calc(env(safe-area-inset-top,0px) + 8px) 8px 8px 4px;background:rgba(251,247,234,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--kline);position:relative;z-index:2}",
      ".kc-head .ttl{flex:1;min-width:0;font:600 calc(16px*var(--kfs))/1.25 Inter,sans-serif;display:flex;align-items:center;flex-wrap:wrap;gap:0 8px}.kc-head .ttl>span:first-child{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".kc-head .pg{flex:1;font:800 calc(19px*var(--kfs)) 'Shippori Mincho',serif;padding-left:4px}",
      ".kc-head .sub{flex:0 0 100%;font:500 calc(12px*var(--kfs)) Inter,sans-serif;color:var(--kmu);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kc-head .sub.on{color:#168a5b}.kc-head .sub.on::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--kon);margin-right:6px;vertical-align:1px}.kc-head .sub .kc-fg{width:13px;height:13px}",
      ".kc-ib{width:44px;height:44px;border-radius:50%;border:0;background:transparent;color:var(--kink);cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 44px}.kc-ib:active{background:rgba(23,35,61,.08)}.kc-ib.sm{width:36px;height:36px;flex-basis:36px}",
      ".kc-hero .kc-ib{color:var(--kink)}",
      ".kc-av{box-shadow:0 0 0 1.5px rgba(255,255,255,.75),0 1px 3px rgba(42,37,29,.2)}",
      ".kc-gav{flex:0 0 auto;border-radius:16px;background:var(--c);color:#fff;display:inline-grid;place-items:center;font-family:'Shippori Mincho',serif;font-weight:800;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}",
      ".kc-pair{display:inline-flex;align-items:center;gap:5px;font:600 calc(10px*var(--kfs)) Inter,sans-serif;background:rgba(23,35,61,.07);color:var(--kv);border-radius:99px;padding:3px 8px;white-space:nowrap}.kc-pair .kc-fg{width:14px;height:14px;vertical-align:0}",
      ".kc-fl{display:inline-flex;align-items:center}.kc-fl .kc-fg{width:15px;height:15px;margin-left:-4px;box-shadow:0 0 0 1.5px var(--kcard)}.kc-fl .kc-fg:first-child{margin-left:0}.kc-fl.big .kc-fg{width:22px;height:22px;margin-left:-6px}",
      ".kc-seal{background:linear-gradient(150deg,var(--kh2),var(--kh));color:#fff5e8;box-shadow:0 10px 22px -8px rgba(var(--kacc2),.6)}",
      ".kc-btn{background:linear-gradient(135deg,var(--kv) 0%,var(--kv-d) 58%,rgba(var(--kacc2),.92) 180%);box-shadow:0 12px 24px -12px rgba(var(--kacc2),.7)}.kc-btn:active{filter:brightness(.92)}.kc-btn:disabled{opacity:.5}.kc-btn.ghost{background:var(--kv-t);color:var(--kv);box-shadow:none}.kc-btn.danger{background:#b3261e;box-shadow:none}",
      ".kc-pl{background:var(--kgrad)}.kc-att{background:var(--kv-t);color:var(--kv)}.kc-link{color:var(--kh)}",
      ".kc-page{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(env(safe-area-inset-top,0px) + 18px) 18px calc(env(safe-area-inset-bottom,0px) + 118px)}",
      ".kc-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}.kc-top h1{font:800 calc(26px*var(--kfs))/1.1 'Shippori Mincho',serif;margin:0;color:var(--kv-d)}.kc-top p{margin:6px 0 0;font-size:calc(13px*var(--kfs));line-height:1.45;color:var(--kmu);max-width:30ch}",
      ".kc-mebtn{border:0;background:none;padding:0;cursor:pointer;border-radius:50%;flex:0 0 auto}",
      ".kc-search{display:flex;align-items:center;gap:8px;background:var(--kcard);border:1px solid var(--kline);border-radius:14px;padding:0 13px;margin-bottom:14px;color:var(--kmu)}.kc-search input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:calc(15px*var(--kfs));padding:12px 0;outline:0;color:var(--kink)}",
      ".kc-li{display:flex;align-items:center;gap:13px;width:100%;text-align:left;background:rgba(251,247,234,.88);border:1px solid var(--kline);border-radius:18px;padding:11px 13px;margin-bottom:9px;font:inherit;color:inherit;cursor:pointer;min-height:72px;box-shadow:0 1px 2px rgba(42,37,29,.05);transition:transform .18s var(--ease,ease),background-color .18s}.kc-li:active{transform:scale(.985);background:#fff}",
      ".kc-li .mid,.kc-mb .mid,.kc-pk .mid{flex:1;min-width:0}.kc-li b,.kc-mb b,.kc-pk b{font:600 calc(15.5px*var(--kfs)) Inter,sans-serif;display:flex;align-items:center;gap:7px}.kc-li b .kc-fg,.kc-mb .pv .kc-fg,.kc-pk .pv .kc-fg{width:14px;height:14px}",
      ".kc-li .pv,.kc-mb .pv,.kc-pk .pv{display:block;font-size:calc(13px*var(--kfs));color:var(--kmu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}.kc-li .tm{font-size:calc(11.5px*var(--kfs));color:var(--kmu);align-self:flex-start;margin-top:4px;font-variant-numeric:tabular-nums}",
      ".kc-emp{text-align:center;padding:44px 24px;color:var(--kmu)}.kc-emp b{display:block;color:var(--kink);font:800 calc(18px*var(--kfs)) 'Shippori Mincho',serif;margin:14px 0 6px}.kc-emp span{display:block;font-size:calc(13px*var(--kfs));line-height:1.55;max-width:32ch;margin:0 auto}",
      ".kc-stamp{width:64px;height:64px;margin:0 auto;border-radius:50%;border:2px dashed var(--kmu);display:flex;align-items:center;justify-content:center;font:800 calc(26px*var(--kfs)) 'Shippori Mincho',serif;color:var(--kmu)}",
      ".kc-nav{position:absolute;left:0;right:0;bottom:0;z-index:4;display:flex;justify-content:center;pointer-events:none}.kc-nav-in{pointer-events:auto;width:100%;position:relative;display:flex;align-items:center;justify-content:space-around;padding:14px 8px calc(14px + env(safe-area-inset-bottom,0px))}",
      ".kc-nav-bg{position:absolute;inset:0;z-index:0;border-radius:26px 26px 0 0;background:linear-gradient(180deg,rgba(255,255,255,.88) 0%,rgba(250,244,228,.84) 62%,rgba(var(--kacc),.16) 100%);border-top:1px solid rgba(255,255,255,.62);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 -6px 24px -8px rgba(23,35,61,.22);-webkit-mask-image:radial-gradient(circle 33px at 50% 14.5px,transparent 90%,#000 100%);mask-image:radial-gradient(circle 33px at 50% 14.5px,transparent 90%,#000 100%)}",
      ".kc-nb{position:relative;z-index:1;background:none;border:0;color:#9298a6;padding:8px 12px;border-radius:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;min-width:46px;min-height:44px;transition:color .18s var(--ease,ease)}.kc-nb.on{color:var(--kh)}.kc-nb:active{transform:scale(.9)}",
      ".kc-nc{position:relative;z-index:1;width:56px;height:30px;flex:0 0 auto;margin:0 4px}.kc-nc button{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);width:56px;height:56px;border-radius:50%;border:0;background:linear-gradient(145deg,rgb(var(--kacc)) 0%,var(--kh) 100%);color:#fff5e8;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 12px 24px -8px rgba(var(--kacc2),.75),inset 0 1px 0 rgba(255,255,255,.35)}.kc-nc button:active{transform:translateX(-50%) scale(.92)}",
      ".kc-pc{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--kv) 0%,var(--kv-d) 62%,rgba(var(--kacc2),.9) 190%);color:#f6efdc;border-radius:22px;padding:18px;margin-bottom:18px;box-shadow:0 14px 28px -14px rgba(23,35,61,.55)}.kc-pc .mid{flex:1;min-width:0}.kc-pc .nm{font:800 calc(20px*var(--kfs)) 'Shippori Mincho',serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kc-pc .em{font-size:calc(12.5px*var(--kfs));opacity:.75;word-break:break-all;margin-top:2px}.kc-pc .pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.kc-pcav{border:0;background:none;padding:0;cursor:pointer;border-radius:50%;flex:0 0 auto}",
      ".kc-pill{display:inline-flex;align-items:center;gap:6px;border-radius:99px;padding:5px 11px;font:600 calc(11.5px*var(--kfs)) Inter,sans-serif;background:rgba(255,255,255,.14);color:inherit;border:0}button.kc-pill{cursor:pointer}.kc-pill.prem{background:linear-gradient(135deg,#d9822f,#ac3527);color:#fff}.kc-pill .kc-fg{width:14px;height:14px}",
      ".kc-set{background:var(--kcard);border:1px solid var(--kline);border-radius:20px;overflow:hidden;margin-bottom:16px}",
      ".kc-sr,.kc-act{display:flex;align-items:center;gap:13px;width:100%;padding:13px 15px;background:none;border:0;border-bottom:1px solid var(--kline);font:inherit;color:inherit;text-align:left;cursor:pointer;min-height:62px}.kc-sr:last-child{border-bottom:0}.kc-sr:active,.kc-act:active{background:rgba(23,35,61,.05)}",
      ".kc-sr .t,.kc-act .t{flex:1;min-width:0}.kc-sr .t b,.kc-act .t b{display:block;font:600 calc(14.5px*var(--kfs)) Inter,sans-serif}.kc-sr .t span,.kc-act .t span{display:block;font-size:calc(12.5px*var(--kfs));line-height:1.4;color:var(--kmu);margin-top:2px}.kc-sr .v{font-size:calc(12.5px*var(--kfs));color:var(--kmu);white-space:nowrap;max-width:40%;overflow:hidden;text-overflow:ellipsis}.kc-sr .ch,.kc-act .ch{color:var(--kmu);flex:0 0 18px}",
      ".kc-si{width:38px;height:38px;border-radius:12px;background:rgba(var(--kacc),.16);color:var(--kh);display:grid;place-items:center;flex:0 0 38px}.kc-sr.danger .t b{color:#b3261e}.kc-sr.danger .kc-si{background:#fdecef;color:#b3261e}",
      ".kc-act{border:1px solid var(--kline);border-radius:18px;background:#fff;margin-bottom:10px}.kc-act:last-of-type{margin-bottom:6px}",
      ".kc-sw{width:50px;height:30px;border-radius:99px;border:0;background:#cdc3a8;position:relative;cursor:pointer;flex:0 0 50px;transition:background .2s}.kc-sw::after{content:'';position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .2s var(--ease,ease)}.kc-sw[aria-checked=true]{background:var(--kh)}.kc-sw[aria-checked=true]::after{transform:translateX(20px)}.kc-sw:disabled{opacity:.45;cursor:default}",
      ".kc-code{background:linear-gradient(135deg,var(--kv) 0%,var(--kv-d) 62%,rgba(var(--kacc2),.9) 190%);color:#f6efdc;border-radius:20px;padding:18px;margin-bottom:14px}.kc-code .lb{font-size:calc(12.5px*var(--kfs));opacity:.78}.kc-code .cd{font:800 calc(30px*var(--kfs)) 'Shippori Mincho',serif;letter-spacing:.2em;margin:6px 0 14px;word-break:break-all}.kc-code .row{display:flex;gap:8px}.kc-code .kc-btn.sm{flex:1;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4);box-shadow:none}.kc-code .kc-btn.sm:first-child{background:#f6efdc;color:var(--kv-d);border-color:#f6efdc}",
      ".kc-pg{position:absolute;inset:0;z-index:4;background:var(--kpaper),var(--kbg);display:flex;flex-direction:column;animation:riseIn .25s both}",
      ".kc-ghero{text-align:center;padding:6px 0 18px}.kc-ghero h2{font:800 calc(24px*var(--kfs))/1.2 'Shippori Mincho',serif;margin:14px 0 4px;display:flex;align-items:center;justify-content:center;gap:4px}.kc-ghero p{margin:0 0 10px;font-size:calc(13px*var(--kfs));color:var(--kmu)}",
      ".kc-mb,.kc-pk{display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;background:none;border:0;border-bottom:1px solid var(--kline);font:inherit;color:inherit;text-align:left}.kc-mb:last-child,.kc-pk:last-child{border-bottom:0}.kc-pk{cursor:pointer;min-height:64px}.kc-pk:active{background:rgba(23,35,61,.05)}",
      ".kc-tag{font:600 calc(10.5px*var(--kfs)) Inter,sans-serif;font-style:normal;background:rgba(23,35,61,.08);color:var(--kv);border-radius:6px;padding:2px 6px}.kc-tag.own{background:rgba(var(--kacc),.2);color:#8a4b0f}",
      ".kc-pk .box{width:26px;height:26px;border-radius:50%;border:2px solid var(--kline);display:grid;place-items:center;color:transparent;flex:0 0 26px;transition:all .15s}.kc-pk.on .box{background:var(--kh);border-color:var(--kh);color:#fff}",
      ".kc-dock{padding:12px 18px calc(env(safe-area-inset-bottom,0px) + 14px);background:rgba(251,247,234,.94);border-top:1px solid var(--kline)}",
      ".kc-li.unread b{font-weight:700}.kc-li.unread .pv{color:var(--kink);font-weight:600}.kc-li.unread .tm{color:var(--kh);font-weight:700}",
      ".kc-li .rt{display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:7px;align-self:stretch;min-width:34px}.kc-li .rt .tm{margin:0;align-self:auto}",
      ".kc-bd{min-width:21px;height:21px;border-radius:11px;background:var(--kh);color:#fff;font:700 calc(11px*var(--kfs)) Inter,sans-serif;display:grid;place-items:center;padding:0 6px;box-shadow:0 4px 10px -4px rgba(var(--kacc2),.7)}",
      ".kc-nb .nbd{position:absolute;top:0;right:3px;min-width:18px;height:18px;border-radius:9px;background:var(--kh);color:#fff;font:700 calc(10px*var(--kfs)) Inter,sans-serif;display:grid;place-items:center;padding:0 4px;box-shadow:0 0 0 2px rgba(250,244,228,.96)}",
      ".kc-day.kc-new{background:var(--kh);color:#fff;border-color:transparent}",
      ".kc-seg{display:flex;gap:6px;margin-top:10px;width:100%}.kc-seg button{flex:1;border:1px solid var(--kline);background:#fff;border-radius:12px;padding:9px 0;font:600 calc(13px*var(--kfs)) Inter,sans-serif;color:var(--kink);cursor:pointer}.kc-seg button[aria-pressed=true]{background:var(--kv);color:#f6efdc;border-color:var(--kv)}",
      ".kc-sr.col{flex-wrap:wrap}.kc-sr.col .t{flex:1 1 60%}",
      ".kc-toast{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);transform:translateX(-50%);max-width:86%;background:var(--kink);color:#fff;font:500 calc(13px*var(--kfs))/1.4 Inter,sans-serif;padding:10px 16px;border-radius:14px;z-index:12;text-align:center;animation:riseIn .2s both;box-shadow:0 10px 24px -8px rgba(0,0,0,.4)}",
      ".kc-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;overflow:hidden}.kc-wp{position:absolute;inset:0;z-index:0}",
      ".kc-list{flex:1;min-height:0;overflow-y:auto;padding:14px 12px 8px;display:flex;flex-direction:column;gap:2px;-webkit-overflow-scrolling:touch;position:relative;z-index:1}",
      ".kc-body .kc-emp{background:rgba(251,247,234,.92);border:1px solid var(--kline);border-radius:20px;margin:auto 18px;padding:26px 18px}",
      ".kc-day{align-self:center;font:600 calc(11px*var(--kfs)) Inter,sans-serif;letter-spacing:.02em;color:var(--kmu);background:rgba(251,247,234,.92);border:1px solid var(--kline);border-radius:99px;padding:4px 13px;margin:12px 0 8px}",
      ".kc-sysm{align-self:center;max-width:86%;text-align:center;font:500 calc(12px*var(--kfs))/1.4 Inter,sans-serif;color:var(--kmu);background:rgba(251,247,234,.92);border:1px solid var(--kline);border-radius:99px;padding:5px 13px;margin:8px 0}",
      ".kc-b{padding:9px 13px 7px;border-radius:18px 18px 18px 6px;background:var(--kcard);border:1px solid rgba(122,110,80,.18);box-shadow:0 1px 2px rgba(42,37,29,.06);font-size:calc(15px*var(--kfs));line-height:1.45;overflow-wrap:anywhere;white-space:pre-wrap}",
      ".kc-m.me .kc-b{background:linear-gradient(135deg,var(--kv),var(--kv-d));color:#f6efdc;border-color:transparent;border-radius:18px 18px 6px 18px;box-shadow:none}",
      ".kc-who{font:700 calc(12px*var(--kfs)) Inter,sans-serif;margin:0 0 3px 6px;display:flex;align-items:center;gap:6px}.kc-who .kc-fg{width:12px;height:12px}",
      ".kc-m.me .kc-wv i{background:#f6efdc}.kc-m.me .kc-pl{background:#f6efdc;color:#223a5c}",
      ".kc-bar{background:var(--kink);color:#fff;font-size:calc(12.5px*var(--kfs));text-align:center;padding:6px;font-weight:600}",
      ".kc-comp{display:flex;gap:8px;align-items:flex-end;padding:10px 12px calc(env(safe-area-inset-bottom,0px) + 12px);background:rgba(251,247,234,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--kline)}",
      ".kc-comp textarea{flex:1;font:inherit;font-size:max(16px,calc(16px*var(--kfs)));line-height:1.35;padding:12px 16px;border-radius:24px;border:1px solid var(--kline);resize:none;max-height:120px;background:#fff;color:var(--kink);outline:0}.kc-comp textarea:focus{border-color:var(--kv);box-shadow:0 0 0 1px var(--kv)}",
      ".kc-att{width:46px;height:46px;flex:0 0 46px;border-radius:50%;border:0;padding:0;margin:0;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.kc-att:active{filter:brightness(.92)}.kc-att svg{width:22px;height:22px;display:block;flex:0 0 auto}.kc-comp .kc-att,.kc-comp .kc-send{align-self:flex-end}",
      ".kc-head .ttl{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:0 8px}.kc-head .ttl>span:first-child{min-width:0;grid-column:1}.kc-head .ttl .kc-pair{grid-column:2;justify-self:end}.kc-head .ttl .sub{grid-column:1/-1}.kc-pair .kc-sw{flex:0 0 auto;opacity:.7}.kc-pair .kc-fg{flex:0 0 auto}.kc-head .kc-av{flex:0 0 auto}",
      "@media (max-width:380px){.kc-head .kc-ib{width:38px;height:38px;flex-basis:38px}.kc-head{gap:4px}.kc-pair{padding:3px 6px;gap:3px}.kc-att,.kc-send{width:42px;height:42px;flex-basis:42px}}",
      ".kc-send{width:46px;height:46px;border-radius:50%;border:0;background:linear-gradient(150deg,var(--kh2),var(--kh));color:#fff5e8;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 46px;box-shadow:0 8px 16px -6px rgba(var(--kacc2),.6)}.kc-send:active{filter:brightness(.92)}.kc-send:disabled{background:#cfc6ad;box-shadow:none}.kc-send svg{width:22px;height:22px}.kc-mic{background:linear-gradient(135deg,var(--kv),var(--kv-d));box-shadow:none}",
      ".kc-sheet{z-index:5}.kc-sheet>div{background:var(--kcard);border-radius:26px 26px 0 0;box-shadow:0 -12px 34px rgba(23,35,61,.25)}",
      ".kc-call{background:linear-gradient(160deg,#17233d 0%,#2c4568 100%)}"
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
  function langPicker(sel) { return '<div class="kc-lang" id="kcLangs">' + LG.map(function (l) { return '<button type="button" data-a="pick" data-l="' + l[0] + '" class="' + (l[0] === sel ? "sel" : "") + '"><b>' + fl(l[0]) + "</b>" + l[2] + "</button>"; }).join("") + "</div>"; }

  var IC = {
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3.1-5.5 6.5-5.5s6.5 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.8c2.2.6 3.5 2.2 3.5 5.2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', back: '<path d="M15 5 8 12l7 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 9"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9s1.2-6.4 3.8-9z"/>',
    crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>', logout: '<path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"/><path d="M16 8l4 4-4 4M20 12H9"/>',
    addu: '<circle cx="10" cy="8" r="4"/><path d="M3 20c0-3.6 3.1-6 7-6"/><path d="M18 8v6M15 11h6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>', chev: '<path d="m9 6 6 6-6 6"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    video: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
  };
  var SWAPI = '<svg class="kc-sw" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/></svg>';
  var ic = function (n, s) { s = s || 20; return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>"; };
  var chev = ic("chev", 18).replace("<svg", '<svg class="ch"');
  var GMAX = { free: 8, premium: 30 }; // sama dengan GROUP_LIMITS di Worker (server yang menentukan)
  var uniq = function (a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); };
  var avG = function (name, sz) { return '<span class="kc-gav" style="--c:' + avCol(name) + ";width:" + sz + "px;height:" + sz + "px;font-size:" + Math.round(sz * .42) + 'px">' + esc(Array.from(String(name || "?"))[0] || "?").toUpperCase() + "</span>"; };
  var lastTxt = function (l) { var t = T(); return l.kind === "img" ? t.kImg + (l.text ? " · " + l.text : "") : l.kind === "aud" ? t.kAud : l.text; };
  var stamp = function (ts) { return dayKey(ts) === dayKey(Date.now()) ? hm(ts) : dayLabel(ts); };
  var sysText = function (s) { var x = T().sys[s.k] || ""; return x.replace("{n}", s.n || "").replace("{g}", s.g || ""); };
  var groupPeer = function (r) { return { group: true, gid: r.group.id, id: "g:" + r.group.id, name: r.group.name, n: r.members ? r.members.length : 0 }; };

  /* ---------- komponen tampilan ---------- */
  function sheet(inner, cls, key) { // popup dari bawah; hanya satu sheet aktif
    var old = $("#kcSheet"); if (old) old.remove();
    var s = document.createElement("div"); s.className = "kc-sheet" + (cls ? " " + cls : ""); s.id = "kcSheet"; if (key) s.dataset.k = key;
    s.innerHTML = '<div role="dialog" aria-modal="true"><div class="grab"></div>' + inner + "</div>";
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
    $(".kc-app").appendChild(s); return s;
  }
  var sumUn = function (l) { return (l || []).reduce(function (n, x) { return n + (x.unread || 0); }, 0); };
  var badge = function (n) { return n ? '<i class="nbd">' + (n > 99 ? "99+" : n) + "</i>" : ""; };
  function updNav() { // badge belum dibaca di ikon navbar
    var m = { chats: sumUn(contacts), groups: sumUn(groups) };
    Array.prototype.forEach.call(root.querySelectorAll(".kc-nb[data-t]"), function (b) { var o = b.querySelector(".nbd"); if (o) o.remove(); if (m[b.dataset.t]) b.insertAdjacentHTML("beforeend", badge(m[b.dataset.t])); });
  }
  function nav(active) { // navbar bawah, bentuknya sama dengan navbar Kakeibo
    var t = T(), bd = { chats: sumUn(contacts), groups: sumUn(groups) }, b = function (id, icn, label, on) { return '<button type="button" class="kc-nb' + (on ? " on" : "") + '" data-a="' + (id === "home" ? "close" : "nav") + '" data-t="' + id + '" aria-label="' + esc(label) + '"' + (on ? ' aria-current="page"' : "") + ">" + ic(icn, 23) + badge(bd[id]) + "</button>"; };
    return '<nav class="kc-nav"><div class="kc-nav-in"><div class="kc-nav-bg"></div>' + b("chats", "chat", t.tabChat, active === "chats") + b("groups", "users", t.tabGroups, active === "groups") + '<div class="kc-nc"><button type="button" data-a="fab" aria-label="' + esc(t.newT) + '">' + ic("plus", 23) + "</button></div>" + b("home", "home", t.tabHome, false) + b("me", "user", t.tabMe, active === "me") + "</div></nav>";
  }
  var top = function (title, sub, right) { return '<header class="kc-top"><div><h1>' + title + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + "</div>" + (right || "") + "</header>"; };
  var meBtn = function () { return '<button class="kc-mebtn" data-a="nav" data-t="me" aria-label="' + T().tabMe + '">' + avMe(42) + "</button>"; };
  var srow = function (icn, title, val, act, danger) { return '<button class="kc-sr' + (danger ? " danger" : "") + '" data-a="' + act + '"><span class="kc-si">' + ic(icn) + '</span><span class="t"><b>' + title + "</b></span>" + (val ? '<span class="v">' + val + "</span>" : "") + (danger ? "" : chev) + "</button>"; };
  var subHead = function (title, extra) { return '<div class="kc-head"><button class="kc-ib" data-a="back" aria-label="Back">' + ic("back") + '</button><div class="pg">' + title + "</div>" + (extra || "") + "</div>"; };
  var unBd = function (n) { return n ? '<span class="kc-bd" aria-label="' + n + " " + T().unread + '">' + (n > 99 ? "99+" : n) + "</span>" : ""; };
  var peerRow = function (c, i) {
    var pv = c.last ? esc((c.last.mine ? T().you + ": " : "") + lastTxt(c.last)) : fl(c.lang) + " " + esc(ln(c.lang));
    return '<button class="kc-li' + (c.unread ? " unread" : "") + '" data-a="open" data-i="' + i + '" data-n="' + esc(c.name.toLowerCase()) + '">' + avP(c, 50) + '<span class="mid"><b>' + esc(c.name) + " " + fl(c.lang) + '</b><span class="pv">' + pv + '</span></span><span class="rt">' + (c.last ? '<span class="tm">' + stamp(c.last.ts) + "</span>" : "") + unBd(c.unread) + "</span></button>";
  };
  var groupRow = function (g, i) {
    var pv = g.last ? esc((g.last.mine ? T().you : g.last.from) + ": " + lastTxt(g.last)) : g.n + " " + T().gMembers;
    return '<button class="kc-li' + (g.unread ? " unread" : "") + '" data-a="openg" data-i="' + i + '" data-n="' + esc(g.name.toLowerCase()) + '">' + avG(g.name, 50) + '<span class="mid"><b>' + esc(g.name) + ' <span class="kc-fl">' + uniq(g.langs || []).slice(0, 4).map(fl).join("") + '</span></b><span class="pv">' + pv + '</span></span><span class="rt">' + (g.last ? '<span class="tm">' + stamp(g.last.ts) + "</span>" : "") + unBd(g.unread) + "</span></button>";
  };
  var searchBox = function () { return '<label class="kc-search">' + ic("search", 18) + '<input id="kcQ" type="search" autocomplete="off" placeholder="' + esc(T().search) + '"></label>'; };
  var emptyBox = function (stampCh, title, sub, btn, act) { return '<div class="kc-emp"><div class="kc-stamp">' + stampCh + "</div><b>" + title + "</b><span>" + sub + "</span>" + (btn ? '<button class="kc-btn sm" style="margin-top:18px" data-a="' + act + '">' + btn + "</button>" : "") + "</div>"; };
  var pickRows = function (list, sel) { return list.map(function (c) { return '<button type="button" class="kc-pk' + (sel[c.id] ? " on" : "") + '" data-a="pk" data-id="' + esc(c.id) + '">' + avP(c, 44) + '<span class="mid"><b>' + esc(c.name) + '</b><span class="pv">' + fl(c.lang) + " " + esc(ln(c.lang)) + '</span></span><span class="box">' + ic("check", 16) + "</span></button>"; }).join(""); };

  function loginHtml(v) {
    var t = T();
      var demo = '<div class="kc-demo"><div class="l" style="animation-delay:.2s">こんにちは！調子はどう？<small>' + fl("ja") + ' → ' + fl("id") + ' Halo! Apa kabar?</small></div><div class="r" style="animation-delay:.9s">Baik-baik aja, lagi kerja shift malam 😄<small>' + fl("id") + ' → ' + fl("ja") + ' 元気だよ、夜勤中 😄</small></div></div>';
      var h = '<div class="kc-scroll" style="padding:0"><div class="kc-hero"><button class="kc-ib x" data-a="close" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="kc-seal">話</div><h2>' + t.hero + "</h2><p>" + t.heroSub + "</p>" + demo + "</div>";
      if (v === "login") {
        h += '<div class="kc-form"><input class="kc-in" id="kcEmail" type="email" autocomplete="email" inputmode="email" autocapitalize="off" placeholder="' + t.email + '" value="' + esc(tmp.email || "") + '"><div id="kcErr"></div><button class="kc-btn" data-a="req" data-t="' + t.sendc + '">' + t.sendc + "</button></div>";
      } else {
        h += '<div class="kc-form"><div class="kc-note">' + t.mail + " <b>" + esc(tmp.email) + "</b></div>" +
          '<input class="kc-in kc-otp" id="kcCode" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" placeholder="••••••">' +
          (tmp.need ? '<div class="kc-note"><b>' + t.prof + '</b></div><input class="kc-in" id="kcName" maxlength="24" autocomplete="nickname" placeholder="' + t.name + '"><div class="kc-note" style="margin-bottom:6px">' + t.mylang + "</div>" + langPicker(tmp.lang || host.lang) : "") +
          '<div id="kcErr"></div><button class="kc-btn" data-a="ver" data-t="' + t.login + '">' + t.login + '</button><div style="display:flex;justify-content:space-between;margin-top:8px"><button class="kc-link" data-a="relogin">← ' + t.email + '</button><button class="kc-link" id="kcResend" data-a="resend" disabled></button></div></div>';
      }
      h += "</div>";
    return h;
  }

  function meHtml() {
    var t = T(), u = A.user, prem = (u.plan === "premium" || u.plan === "plus");
    return '<div class="kc-page">' + top(t.tabMe, "") +
      '<div class="kc-pc"><button class="kc-pcav" data-a="profile" aria-label="' + t.profT + '">' + avMe(64) + '</button><div class="mid"><div class="nm">' + esc(u.name) + '</div><div class="em">' + esc(u.email || "") + '</div><div class="pills"><span class="kc-pill">' + fl(u.lang) + " " + esc(ln(u.lang)) + '</span><button class="kc-pill' + (prem ? " prem" : "") + '" data-a="plan">' + (planLbl(u.plan)) + "</button></div></div></div>" +
      '<div class="kc-h">' + t.setGen + '</div><div class="kc-set"><div class="kc-sr"><span class="kc-si">' + ic("bell") + '</span><span class="t"><b>' + t.notif + '</b><span id="kcPushNote">…</span></span><button class="kc-sw" id="kcPushB" data-a="push" role="switch" aria-checked="false" aria-label="' + esc(t.notif) + '" disabled></button></div>' +
      '<div class="kc-sr col"><span class="kc-si">' + ic("edit") + '</span><span class="t"><b>' + t.fontT + '</b></span><div class="kc-seg" role="group" aria-label="' + esc(t.fontT) + '">' + ["s", "m", "l"].map(function (k) { return '<button type="button" data-a="fs" data-v="' + k + '" aria-pressed="' + (FSK === k) + '">' + t["font" + k.toUpperCase()] + "</button>"; }).join("") + "</div></div>" +
      (window.SeasonFX ? '<div class="kc-sr"><span class="kc-si">' + ic("globe") + '</span><span class="t"><b>' + t.seasonFx + "</b><span>" + t.seasonFxSub + '</span></span><button class="kc-sw" id="kcFxB" data-a="seasonfx" role="switch" aria-checked="' + (window.SeasonFX.getMode() !== "off") + '" aria-label="' + esc(t.seasonFx) + '"></button></div>' : "") +
      srow("image", t.wp, "", "wallpaper") + srow("globe", t.profRow, esc(u.name), "profile") + "</div>" +
      '<div class="kc-h">' + t.setPlan + '</div><div class="kc-set">' + srow("crown", t.planT, planLbl(u.plan), "plan") + srow("addu", t.mine, esc(u.invite), "invite") + "</div>" +
      '<div class="kc-set">' + srow("logout", t.out, "", "logout", true) + "</div></div>" + nav("me");
  }

  function go(v) {
    if (view === "chat" && v !== "chat") leaveChat();
    clearInterval(cdT);
    if (v === "contacts") v = "chats"; // nama lama
    if (v === "chats" || v === "groups" || v === "me") tab = v;
    var pg = $("#kcPg"); if (pg) pg.remove();
    view = v; document.documentElement.classList.toggle("kc-conv", v === "chat"); if (v !== "chat") newCnt = 0; else newDone = false;
    var t = T(), u = A.user, h = "";
    if (v === "login" || v === "code") h = loginHtml(v);
    else if (v === "chats") h = '<div class="kc-page">' + top(t.tabChat, t.chatsSub, meBtn()) + '<div id="kcFilter"></div><div id="kcPeers"><div class="kc-sk"></div><div class="kc-sk"></div><div class="kc-sk"></div></div><div id="kcErr"></div></div>' + nav("chats");
    else if (v === "groups") h = '<div class="kc-page">' + top(t.tabGroups, t.groupsSub, meBtn()) + '<div id="kcFilter"></div><div id="kcGroups"><div class="kc-sk"></div><div class="kc-sk"></div></div><div id="kcErr"></div></div>' + nav("groups");
    else if (v === "me") h = meHtml();
    else if (v === "newgroup") {
      h = subHead(t.groupNew) + '<div class="kc-page" style="padding-bottom:24px"><div class="kc-note" style="margin-bottom:6px">' + t.gName + '</div><input class="kc-in" id="kcGName" maxlength="30" autocomplete="off" placeholder="' + esc(t.gNamePh) + '"><div class="kc-h" style="margin-top:6px">' + t.gPick + ' <span id="kcPkN"></span></div><div class="kc-set" id="kcPick"><div class="kc-sk"></div><div class="kc-sk"></div></div><div class="kc-note" id="kcPkMax"></div></div>' +
        '<div class="kc-dock"><div id="kcErr"></div><button class="kc-btn" id="kcMk" data-a="mk" data-t="' + t.gCreate + '">' + t.gCreate + "</button></div>";
    } else if (v === "chat") {
      var g = peer.group, btn = function (a, icn, label, id) { return '<button class="kc-ib" ' + (id ? 'id="' + id + '" ' : "") + 'data-a="' + a + '" aria-label="' + label + '">' + ic(icn) + "</button>"; };
      h = '<div class="kc-head"><button class="kc-ib" data-a="back" aria-label="Back">' + ic("back") + "</button>" + (g ? '<span data-a="ginfo" style="display:flex;cursor:pointer">' + avG(peer.name, 40) + "</span>" : avP(peer, 40)) +
        '<div class="ttl"' + (g ? ' data-a="ginfo" style="cursor:pointer"' : "") + "><span" + (g ? ' id="kcGTitle"' : "") + ">" + esc(peer.name) + "</span>" + (g ? "" : '<span class="kc-pair">' + fl(u.lang) + SWAPI + fl(peer.lang) + "</span>") + '<div class="sub" id="kcSt">' + (g ? (peer.n ? peer.n + " " + t.gMembers : "") : t.offl) + "</div></div>" +
        (g ? "" : btn("call", "phone", "Call", "kcCallB") + btn("vcall", "video", "Video call", "kcVCallB")) + btn("media", "grid", "Media") + (g ? btn("ginfo", "info", t.gInfo) : "") + "</div>" +
        '<div class="kc-bar" id="kcBar" style="display:none">' + t.off + '</div><div class="kc-body"><div class="kc-wp" id="kcWp"></div><div class="kc-list" id="kcList"></div></div>' +
        '<form class="kc-comp" id="kcForm"><button type="button" class="kc-att" data-a="photo" aria-label="Photo">' + ic("image") + '</button><input type="file" id="kcFile" accept="image/*" hidden><textarea id="kcTxt" rows="1" maxlength="1000" enterkeyhint="send" placeholder="' + t.typ + '"></textarea><button class="kc-send" id="kcSend" aria-label="send" style="display:none" disabled>' + SEND + '</button><button type="button" class="kc-send kc-mic" id="kcMic" data-a="mic" aria-label="Mic">' + MICI + '</button><div class="kc-recbar"><button type="button" class="kc-att" data-a="reccancel" aria-label="Cancel">' + XI + '</button><span class="kc-rdot"></span><b id="kcRt">0:00</b><span class="kc-rh">' + t.rec + '</span><button type="button" class="kc-send" data-a="recsend" aria-label="Send">' + SEND + "</button></div></form>";
    }
    $(".kc-view").innerHTML = h; $(".kc-view").style.animation = "none"; void $(".kc-view").offsetWidth; $(".kc-view").style.animation = "";
    if (v === "chats") loadContacts();
    if (v === "groups") loadGroups();
    if (v === "me") pushRefresh();
    if (v === "newgroup") loadPicker();
    if (v === "code") { startCd(); var c = $("#kcCode"); if (c) setTimeout(function () { c.focus(); }, 250); }
    if (v === "chat") { applyWp(); drawMsgs(true); closing = false; retry = 0; connect(); if (peer.group) loadGroupInfo(); }
  }
  function startCd() {
    var left = 30, b = $("#kcResend"); if (!b) return;
    function tick() { if (!b.isConnected) return clearInterval(cdT); if (left > 0) { b.disabled = true; b.textContent = T().resendIn + " " + left + "s"; left--; } else { b.disabled = false; b.textContent = T().resend; clearInterval(cdT); } }
    tick(); cdT = setInterval(tick, 1000);
  }

  var avTried = false;
  function autoShareAvatar() { // foto profil lokal ikut diunggah supaya terlihat oleh lawan chat (kecuali pernah dihapus sengaja)
    try {
      if (avTried || !A.user || /^data:image\//.test(A.user.avatar || "")) return;
      if (localStorage.getItem("kc-av-off")) return;
      var ph = kp().photo; if (!ph) return; avTried = true;
      squareAvatar(ph, function (d) { if (d) sendAvatar(d); });
    } catch (e) {}
  }
  function syncPeer() { // perbarui foto/nama lawan chat yang sedang dibuka dari daftar kontak terbaru
    if (view !== "chat" || !peer || peer.group) return;
    var f = contacts.filter(function (x) { return x.id === peer.id; })[0]; if (!f) return;
    var ch = (f.avatar || "") !== (peer.avatar || "");
    peer.avatar = f.avatar || ""; peer.name = f.name; peer.lang = f.lang;
    if (!ch) return;
    var hv = root && root.querySelector(".kc-head > .kc-av"); if (hv) hv.outerHTML = avP(peer, 40);
    try { drawMsgs(false); } catch (e) {}
  }
  function loadContacts() {
    autoShareAvatar();
    api("/api/me").then(function (r) { if (r.user && A.user) { A.user.plan = r.user.plan; A.user.until = r.user.until; store(); } }).catch(function () {});
    api("/api/contacts").then(function (r) {
      contacts = r.contacts || [];
      if (DEEP && DEEP.indexOf("g:") === 0) { var gid = DEEP.slice(2); DEEP = null; return openGroupById(gid); }
      if (DEEP) { var oi = -1; contacts.forEach(function (x, i) { if (x.id === DEEP) oi = i; }); DEEP = null; if (oi >= 0) { peer = contacts[oi]; msgs = []; go("chat"); return; } }
      drawPeers(true); quietLists();
    }).catch(function (e) { var n = $("#kcPeers"); if (n) n.innerHTML = ""; err(e); });
  }
  function loadGroups() {
    api("/api/groups").then(function (r) {
      groups = r.groups || [];
      if (DEEP && DEEP.indexOf("g:") === 0) { var gid = DEEP.slice(2); DEEP = null; return openGroupById(gid); }
      drawGroups(true); quietLists();
    }).catch(function (e) { var n = $("#kcGroups"); if (n) n.innerHTML = ""; err(e); });
  }
  function applyQ() { var q = $("#kcQ"), v = q ? q.value.trim().toLowerCase() : ""; Array.prototype.forEach.call(root.querySelectorAll(".kc-li[data-n]"), function (n) { n.style.display = !v || n.dataset.n.indexOf(v) >= 0 ? "" : "none"; }); }
  function drawPeers(withSearch) {
    var n = $("#kcPeers"); if (!n || view !== "chats") return;
    if (withSearch) { var f = $("#kcFilter"); if (f) f.innerHTML = contacts.length >= 6 ? searchBox() : ""; }
    n.innerHTML = contacts.length ? contacts.map(peerRow).join("") : emptyBox("話", T().emptyChats, T().emptyChatsSub, T().addFriend, "invite"); applyQ(); updNav();
  }
  function drawGroups(withSearch) {
    var n = $("#kcGroups"); if (!n || view !== "groups") return;
    if (withSearch) { var f = $("#kcFilter"); if (f) f.innerHTML = groups.length >= 6 ? searchBox() : ""; }
    n.innerHTML = groups.length ? groups.map(groupRow).join("") : emptyBox("群", T().emptyGroups, T().emptyGroupsSub, T().mkGroup, "newgroup") + '<button class="kc-link" style="display:block;margin:0 auto" data-a="joinsheet">' + T().joinGroup + "</button>"; applyQ(); updNav();
  }
  function quietLists() { // ambil daftar yang tidak sedang tampil, supaya badge di navbar akurat
    if (view !== "chats") api("/api/contacts").then(function (r) { contacts = r.contacts || []; syncPeer(); updNav(); }).catch(function () {});
    if (view !== "groups") api("/api/groups").then(function (r) { groups = r.groups || []; updNav(); }).catch(function () {});
  }
  function pollLists() { // segarkan daftar tiap 15 detik selama layar daftar terbuka
    if (!root || !root.classList.contains("open") || document.hidden || A.tok === undefined || !A.tok) return;
    if (view === "chats") api("/api/contacts").then(function (r) { if (view === "chats") { contacts = r.contacts || []; drawPeers(false); } }).catch(function () {});
    else if (view === "groups") api("/api/groups").then(function (r) { if (view === "groups") { groups = r.groups || []; drawGroups(false); } }).catch(function () {});
    else if (view === "me") return;
    quietLists();
  }
  function markNew(hist) { // pesan pertama yang belum dibaca saat chat dibuka (untuk garis "Pesan belum dibaca")
    if (newDone) return; newDone = true; newFrom = null; var n = newCnt, i, first = null;
    for (i = hist.length - 1; i >= 0 && n > 0; i--) if (!hist[i].sys && hist[i].uid !== me) { n--; first = hist[i].id; }
    if (newCnt > 0) newFrom = first; // unread lebih banyak dari riwayat yang dimuat: garis di pesan masuk paling awal
  }
  function jumpNew() { var d = $("#kcNew"), b = $("#kcList"); if (d && b) b.scrollTop = Math.max(0, d.offsetTop - 56); }
  function openGroupById(id) {
    api("/api/groups/info", { id: id }).then(function (r) { peer = groupPeer(r); GI = r; GM = {}; r.members.forEach(function (m) { GM[m.id] = m; }); msgs = []; tab = "groups"; go("chat"); }).catch(function (e) { err(e); });
  }
  function loadGroupInfo() { // daftar anggota + info grup; dipanggil saat masuk grup dan saat ada pesan sistem
    if (!peer || !peer.group) return;
    var gid = peer.gid;
    api("/api/groups/info", { id: gid }).then(function (r) {
      if (!peer || peer.gid !== gid) return;
      GI = r; GM = {}; r.members.forEach(function (m) { GM[m.id] = m; });
      peer.name = r.group.name; peer.n = r.members.length;
      var h = $("#kcGTitle"); if (h) h.textContent = peer.name;
      online(onl); drawMsgs(); drawGroupInfo();
    }).catch(function (e) { if (e && e.code === "notfound") leftGroup(); });
  }
  function leftGroup() { toast(T().gGone); leaveChat(); go("groups"); }
  function loadPicker() {
    var cap = GMAX[A.user.plan === "premium" || A.user.plan === "plus" ? "premium" : "free"];
    tmp.sel = {}; tmp.cap = cap - 1; tmp.capMsg = T().gMax.replace("{n}", cap);
    var mx = $("#kcPkMax"); if (mx) mx.textContent = tmp.capMsg;
    api("/api/contacts").then(function (r) {
      contacts = r.contacts || []; var n = $("#kcPick"); if (!n || view !== "newgroup") return;
      n.innerHTML = contacts.length ? pickRows(contacts, tmp.sel) : '<div class="kc-emp" style="padding:22px"><span>' + T().gNoFriends + "</span></div>"; updPick();
    }).catch(function (e) { var n = $("#kcPick"); if (n) n.innerHTML = ""; err(e); });
  }
  function updPick() {
    var c = Object.keys(tmp.sel || {}).length, n = $("#kcPkN"); if (n) n.textContent = c ? "(" + c + " " + T().gPicked + ")" : "";
    var b = $("#kcAddDo"); if (b) b.disabled = !c;
  }

  function drawMsgs(force) {
    var box = $("#kcList"); if (!box) return;
    var end = force || box.scrollHeight - box.scrollTop - box.clientHeight < 90, t = T(), L = A.user.lang, grp = !!peer.group, prev = null, html = "";
    var same = function (x, m) { return x && !x.sys && x.uid === m.uid && dayKey(x.ts) === dayKey(m.ts); };
    if (!msgs.length) html = '<div class="kc-emp"><div class="kc-stamp">' + (grp ? "群" : "話") + "</div><b>" + esc(peer.name) + "</b><span>" + t.empty + "</span></div>";
    msgs.forEach(function (m, i) {
      if (newFrom && m.id === newFrom) html += '<div class="kc-day kc-new" id="kcNew">' + t.newMsgs + "</div>";
      if (!prev || dayKey(prev.ts) !== dayKey(m.ts)) html += '<div class="kc-day">' + dayLabel(m.ts) + "</div>";
      if (m.sys) { html += '<div class="kc-sysm">' + esc(sysText(m.sys)) + "</div>"; prev = m; return; }
      var mine = m.uid === me, tgt = mine && !grp ? peer.lang : L, tr = m.tr && m.tr[tgt], main = m.text, sub = "";
      if (m.text && m.lang !== tgt && !(mine && grp)) {
        if (tr) { if (mine) sub = '<div class="kc-o"><i class="kc-cd">' + fl(tgt) + "</i>" + esc(tr) + "</div>"; else { main = tr; sub = '<div class="kc-o"><i class="kc-cd">' + fl(m.lang) + "</i>" + esc(m.text) + "</div>"; } }
        else if (m.st === "fail" || m.st === "quota") sub = '<div class="kc-st bad">⚠ ' + t[m.st] + (!mine ? ' · <button data-a="retr" data-id="' + esc(m.id) + '">' + t.retry + "</button>" : "") + "</div>";
        else if (!m.local) sub = '<div class="kc-st"><span class="kc-dots"><i></i><i></i><i></i></span>' + t.wait + "</div>";
      }
      var cont = same(prev, m) && m.ts - prev.ts < 120000, nx = msgs[i + 1], last = !(same(nx, m) && nx.ts - m.ts < 120000);
      var tick = mine ? (m.local ? '<i class="kc-ck pend"></i>' : '<i class="kc-ck">✓</i>') : "";
      var snd = grp ? (GM[m.uid] || { id: m.uid, name: m.from || "?", lang: m.lang }) : peer;
      var who = grp && !mine && !cont ? '<div class="kc-who" style="color:' + avCol(snd.name) + '">' + esc(snd.name) + " " + fl(m.lang) + "</div>" : "";
      html += '<div class="kc-row' + (mine ? " me" : "") + (cont ? " cont" : "") + '">' + (mine ? "" : '<span class="kc-ra">' + (last ? avP(snd, 28) : "") + "</span>") +
        '<div class="kc-m' + (mine ? " me" : "") + '">' + who + '<div class="kc-b' + (m.img ? " has-img" : m.aud ? " has-aud" : "") + '">' + (m.img ? imgHtml(m.img) + (main ? '<div class="kc-cp">' + esc(main) + "</div>" : "") : m.aud ? audHtml(m) + (main ? '<div class="kc-cp">' + esc(main) + "</div>" : "") : esc(main)) + sub + audSt(m) + '<span class="kc-tm">' + (m.local ? "" : hm(m.ts)) + tick + "</span></div></div></div>";
      prev = m;
    });
    if (peerTyping) html += '<div class="kc-typ"><span class="kc-dots"><i></i><i></i><i></i></span></div>';
    box.innerHTML = html; hydrate(box);
    if (end) box.scrollTop = box.scrollHeight;
  }

  /* ---------- grup: info, anggota ---------- */
  function openGroupInfo() {
    if (!peer || !peer.group || $("#kcPg")) return;
    var d = document.createElement("div"); d.className = "kc-pg"; d.id = "kcPg";
    d.innerHTML = subHead(T().gInfo) + '<div class="kc-page" id="kcGI" style="padding-top:18px"></div>';
    $(".kc-app").appendChild(d); drawGroupInfo(); loadGroupInfo();
  }
  function drawGroupInfo() {
    var n = $("#kcGI"); if (!n || !GI) return;
    var t = T(), g = GI.group, ms = GI.members, uid = A.user.id, own = g.mine;
    n.innerHTML = '<div class="kc-ghero">' + avG(g.name, 84) + "<h2>" + esc(g.name) + (own ? '<button class="kc-ib sm" data-a="grename" aria-label="' + t.gRename + '">' + ic("edit", 18) + "</button>" : "") + "</h2><p>" + ms.length + " / " + g.max + " " + t.gMembers + '</p><div class="kc-fl big">' + uniq(ms.map(function (m) { return m.lang; })).map(fl).join("") + "</div></div>" +
      '<div class="kc-code"><div class="lb">' + t.gInvite + '</div><div class="cd">' + esc(g.invite) + '</div><div class="row"><button class="kc-btn sm" data-a="gshare">' + t.share + '</button><button class="kc-btn sm" data-a="gcopy">' + t.copy + "</button></div></div>" +
      '<div class="kc-h">' + t.gMembers + '</div><div class="kc-set">' + ms.map(function (m) {
        return '<div class="kc-mb">' + avP(m, 44) + '<span class="mid"><b>' + esc(m.name) + (m.id === uid ? ' <i class="kc-tag">' + t.gYou + "</i>" : "") + (m.id === g.owner ? ' <i class="kc-tag own">' + t.gOwner + "</i>" : "") + '</b><span class="pv">' + fl(m.lang) + " " + esc(ln(m.lang)) + "</span></span>" +
          (own && m.id !== uid ? '<button class="kc-ib sm" data-a="gkick" data-u="' + esc(m.id) + '" data-n="' + esc(m.name) + '" aria-label="' + t.gRemove + '">' + ic("x", 18) + "</button>" : "") + "</div>";
      }).join("") + "</div>" +
      '<button class="kc-btn ghost" data-a="gadd" style="margin-bottom:16px">' + t.gAddM + '</button><div class="kc-set">' + srow("logout", t.gLeave, "", "gleave", true) + "</div>";
  }
  function openAddMembers() {
    var t = T(); if (!GI) return;
    tmp.sel = {}; tmp.cap = Math.max(0, GI.group.max - GI.members.length); tmp.capMsg = t.gMax.replace("{n}", GI.group.max);
    sheet("<h3>" + t.gAddM + '</h3><div id="kcPick"><div class="kc-sk"></div><div class="kc-sk"></div></div><div id="kcErr"></div><button class="kc-btn" id="kcAddDo" data-a="gadddo" disabled style="margin-top:10px">' + t.gAddDo + "</button>", "tall", "gadd");
    api("/api/contacts").then(function (r) {
      contacts = r.contacts || []; var inG = {}; GI.members.forEach(function (m) { inG[m.id] = 1; });
      var free = contacts.filter(function (c) { return !inG[c.id]; }), n = $("#kcPick"); if (!n) return;
      n.innerHTML = free.length ? '<div class="kc-set">' + pickRows(free, tmp.sel) + "</div>" : '<div class="kc-emp" style="padding:22px"><span>' + t.gNoAdd + "</span></div>";
    }).catch(function (e) { err(e); });
  }
  function confirmSheet(title, yesLabel, act, extra) {
    sheet("<h3>" + esc(title) + '</h3><button class="kc-btn danger" data-a="' + act + '"' + (extra || "") + ">" + yesLabel + '</button><button class="kc-btn ghost" style="margin-top:10px" data-a="closesheet">' + T().cancel + "</button>", "", "confirm");
  }
  function shareCode(b, text, link) {
    if (b.dataset.a.indexOf("share") >= 0 && navigator.share) navigator.share({ text: text, url: link }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text + " " + link).then(function () { var o = b.textContent; b.textContent = T().copied; setTimeout(function () { b.textContent = o; }, 1500); });
  }

  /* ---------- popup: mulai, undang, gabung, paket, profil ---------- */
  function openFab() {
    var t = T(), r = function (icn, ti, sub, act) { return '<button class="kc-act" data-a="' + act + '"><span class="kc-si">' + ic(icn) + '</span><span class="t"><b>' + ti + "</b><span>" + sub + "</span></span>" + chev + "</button>"; };
    sheet("<h3>" + t.newT + "</h3>" + r("addu", t.actFriend, t.actFriendSub, "invite") + r("users", t.actGroup, t.actGroupSub, "newgroup") + r("link", t.actJoin, t.actJoinSub, "joinsheet"), "", "fab");
  }
  function openInvite() {
    var t = T();
    sheet("<h3>" + t.actFriend + '</h3><div class="kc-code"><div class="lb">' + t.mine + '</div><div class="cd">' + esc(A.user.invite) + '</div><div class="row"><button class="kc-btn sm" data-a="share">' + t.share + '</button><button class="kc-btn sm" data-a="copy">' + t.copy + '</button></div></div><div class="kc-h" style="margin-top:4px">' + t.addph + '</div><div class="kc-add"><input class="kc-in" id="kcAdd" maxlength="8" autocapitalize="characters" autocomplete="off" placeholder="' + t.addph + '"><button class="kc-btn sm" data-a="add" style="padding:0 18px">' + t.add + '</button></div><div id="kcErr"></div>', "", "invite");
  }
  function openJoin() {
    var t = T();
    sheet("<h3>" + t.gJoinT + '</h3><div class="kc-add"><input class="kc-in" id="kcJoin" maxlength="8" autocapitalize="characters" autocomplete="off" placeholder="' + t.gCodePh + '"><button class="kc-btn sm" data-a="join" style="padding:0 18px">' + t.gJoin + '</button></div><div id="kcErr"></div>', "", "join");
  }
  function openPlan() {
    if (window.KakeiboAuth) return window.KakeiboAuth.openPlan(); // satu popup paket untuk seluruh app
    sheet("<h3>" + T().planT + '</h3><div id="kcAcc"><div class="kc-sk"></div><div class="kc-sk"></div></div>', "tall", "plan"); loadAccount();
  }
  function openProfile() {
    var u = A.user, t = T(), k = kp(); tmp.lang2 = u.lang;
    sheet("<h3>" + t.profT + '</h3><div id="kcAvBlock">' + avBlock() + '</div><div class="kc-note" style="margin-bottom:6px">' + t.name + '</div><input class="kc-in" id="kcPName" maxlength="24" value="' + esc(u.name) + '" placeholder="' + t.name + '">' +
      (k.name && k.name !== u.name ? '<button class="kc-link" style="padding:0 0 10px" data-a="usek" data-n="' + esc(k.name) + '">↺ ' + t.useK + " (" + esc(k.name) + ")</button>" : "") +
      '<div class="kc-note" style="margin-bottom:6px">' + t.mylang + "</div>" + langPicker(u.lang) + '<div id="kcErr"></div><button class="kc-btn" data-a="saveprof" data-t="' + t.save + '">' + t.save + '</button><button class="kc-link" style="width:100%;margin-top:6px" data-a="closesheet">' + t.cancel + "</button>", "tall", "profile");
  }

  /* ---------- tombol Back (HP / browser) ---------- */
  // Dipanggil host (index.html) saat tombol Back ditekan. true = Back sudah dipakai di sini.
  function navBack() {
    var vi = root.querySelector(".kc-view-img"), sh = $("#kcSheet"), pg = $("#kcPg");
    if (vi) { vi.remove(); return true; }
    if (CALL) return true; // sedang telepon: pakai tombol Akhiri
    if (sh) { sh.remove(); return true; }
    if (REC) { stopRec(false); return true; }
    if (pg) { pg.remove(); return true; }
    if (view === "chat" || view === "newgroup") { go(tab); return true; }
    if (view === "code") { go("login"); return true; }
    if (view === "groups" || view === "me") { go("chats"); return true; }
    close(); return true;
  }
  /* ---------- realtime ---------- */
  function connect() {
    clearTimeout(rt);
    api("/api/ws-ticket", peer.group ? { group: peer.gid } : { peer: peer.id }).then(function (r) {
      if (closing || view !== "chat") return;
      try { ws && ws.close(); } catch (e) {}
      var sock = ws = new WebSocket(API.replace(/^http/, "ws") + "/ws?ticket=" + encodeURIComponent(r.ticket));
      sock.onopen = function () { if (sock !== ws) return; retry = 0; bar(false); };
      sock.onmessage = function (e) {
        if (sock !== ws || e.data === "pong") return;
        var d; try { d = JSON.parse(e.data); } catch (x) { return; }
        if (d.type === "init") {
          me = d.me; var hist = d.history || [], keep = msgs.filter(function (m) { return m.local; });
          msgs = hist; msgs.forEach(watchTr); markNew(hist);
          keep = keep.filter(function (l) { return !hist.some(function (h) { return (l.aud ? h.aud && h.aud.id === l.aud.id : l.img ? h.img && h.img.id === l.img.id : h.uid === me && h.text === l.text && h.ts >= l.ts - 5000); }); });
          keep.forEach(function (l) { l.uid = me; msgs.push(l); });
          online(d.online); flush(); drawMsgs(true); jumpNew();
        } else if (d.type === "online") online(d.online);
        else if (d.type === "tx") onTx(d);
        else if (d.type === "call") onCall(d);
        else if (d.type === "typing") { if (d.uid !== me) { peerTyping = true; clearTimeout(peerTypT); peerTypT = setTimeout(function () { peerTyping = false; online(onl); drawMsgs(); }, 3500); online(onl); } }
        else if (d.type === "msg") {
          peerTyping = false; online(onl);
          if (d.msg.sys && peer.group) loadGroupInfo();
          if (!msgs.some(function (x) { return x.id === d.msg.id; })) {
            var li = -1; if (d.msg.uid === me) msgs.some(function (x, i) { if (x.local && (d.msg.aud ? x.aud && x.aud.id === d.msg.aud.id : d.msg.img ? x.img && x.img.id === d.msg.img.id : !x.img && !x.aud && x.text === d.msg.text)) { li = i; return true; } });
            if (li >= 0) msgs[li] = d.msg; else msgs.push(d.msg);
            if (d.msg.uid !== me) watchTr(d.msg);
          }
          drawMsgs(d.msg.uid === me);
        }
        else if (d.type === "tr") { var m = msgs.filter(function (x) { return x.id === d.id; })[0]; if (m) { m.tr = m.tr || {}; if (d.text) { m.tr[d.lang] = d.text; delete m.st; } else if (d.lang === (m.uid === me && !peer.group ? peer.lang : A.user.lang)) m.st = d.quota ? "quota" : "fail"; drawMsgs(); } }
        else if (d.type === "error") { var n = $("#kcTxt"); if (n) toast(T().e[d.code] || T().e.server); }
      };
      sock.onclose = function () { if (sock !== ws) return; clearInterval(pingT); if (closing || view !== "chat") return; bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); };
      sock.onerror = function () { try { sock.close(); } catch (e) {} };
    }).catch(function (e) { if (e && e.code === "notfound") return peer && peer.group ? leftGroup() : go("chats"); if (!closing && view === "chat") { bar(true); rt = setTimeout(connect, Math.min(1000 * Math.pow(2, retry++), 8000)); } });
  }
  function armTr(m) { setTimeout(function () { if (m.st === "wait" && !(m.tr && m.tr[A.user.lang])) { m.st = "fail"; drawMsgs(); } }, 12000); }
  function watchTr(m) { // pesan masuk beda bahasa: kalau 12 dtk terjemahan belum datang, tandai gagal (ada tombol coba lagi)
    if (m.sys || m.uid === me || m.lang === A.user.lang || (m.tr && m.tr[A.user.lang])) return;
    m.st = "wait"; armTr(m);
  }
  function flush() { // kirim pesan yang tertahan saat offline
    if (!ws || ws.readyState !== 1) return;
    msgs.forEach(function (m) { if (m.local && !m.sent && !m.uploading) { try { ws.send(JSON.stringify(m.aud ? { aud: { id: m.aud.id, dur: m.aud.dur } } : m.img ? { img: { id: m.img.id, w: m.img.w, h: m.img.h }, text: m.text } : { text: m.text })); m.sent = true; } catch (e) {} } });
  }
  function leaveChat() { stopAud(); if (CALL) endCall(true); closing = true; clearTimeout(rt); clearInterval(pingT); try { ws && ws.close(); } catch (e) {} ws = null; peerTyping = false; }
  function bar(on) { var b = $("#kcBar"); if (b) b.style.display = on ? "" : "none"; if (!on) { flush(); sendVis(); } upSend(); }
  function online(a) { onl = a || []; var s = $("#kcSt"); if (!s) return; if (peer.group) { var c = GI ? GI.members.length : peer.n, k = onl.length; s.textContent = (c ? c + " " + T().gMembers : "") + (k ? " · " + k + " " + T().on : ""); s.className = "sub" + (k > 1 ? " on" : ""); return; } var on = onl.indexOf(peer.id) >= 0; s.textContent = peerTyping ? T().typing : on ? "● " + T().on : T().offl; s.className = "sub" + (on ? " on" : ""); }
  function upSend() { var s = $("#kcSend"), x = $("#kcTxt"), mi = $("#kcMic"); if (!s || !x) return; var has = !!x.value.trim(); s.disabled = !has; s.style.display = has ? "" : "none"; if (mi) mi.style.display = has ? "none" : ""; }
  function toast(msg) { var old = root.querySelector(".kc-toast"); if (old) old.remove(); var n = document.createElement("div"); n.className = "kc-toast"; n.setAttribute("role", "status"); n.textContent = msg; $(".kc-app").appendChild(n); setTimeout(function () { n.remove(); }, 2600); }

  /* ---------- pengaturan ---------- */
  var IMG = {}, LOADING = {}, IMGFAIL = {};
  function imgHtml(im) {
    var src = im.url || IMG[im.id] || "";
    return '<div class="kc-im" data-a="viewimg" data-id="' + esc(im.id) + '" style="aspect-ratio:' + (im.w || 4) + "/" + (im.h || 3) + '">' + (src ? '<img alt="" src="' + src + '">' : "") + (im.id ? "" : '<span class="kc-up"></span>') + "</div>";
  }
  function hydrate(scope) { // unduh gambar teman sekali, lalu simpan sebagai blob URL
    Array.prototype.forEach.call(scope.querySelectorAll("[data-id]"), function (n) {
      var id = n.dataset.id; if (!id || IMG[id] || LOADING[id] || IMGFAIL[id] || !/^[\w-]+$/.test(id)) return; LOADING[id] = 1;
      fetch(API + "/api/media/" + id, { headers: { authorization: "Bearer " + A.tok } }).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
        .then(function (b) { IMG[id] = URL.createObjectURL(b); delete LOADING[id]; drawMsgs(); if ($("#kcSheet") && $("#kcSheet").dataset.k === "media") openMedia(tmp.tab); })
        .catch(function () { delete LOADING[id]; IMGFAIL[id] = 1; });
    });
  }
  function shrink(file, cb) { // maks 1280 px, JPEG, kualitas diturunkan sampai < ~420 KB
    readFile(file, function (src) {
      if (!src) return cb(null);
      loadImg(src, function (im) {
        if (!im) return cb(null);
        (function attempt(side, q, n) {
          var k = Math.min(1, side / Math.max(im.width, im.height)), w = Math.max(1, Math.round(im.width * k)), h = Math.max(1, Math.round(im.height * k)), cv = document.createElement("canvas");
          cv.width = w; cv.height = h; cv.getContext("2d").drawImage(im, 0, 0, w, h);
          cv.toBlob(function (b) {
            if (b && b.size < 420000) return cb({ blob: b, url: URL.createObjectURL(b), w: w, h: h });
            if (n > 6) return cb(null);
            attempt(q <= 0.55 ? Math.round(side * 0.75) : side, q <= 0.55 ? 0.72 : q - 0.1, n + 1);
          }, "image/jpeg", q);
        })(1280, 0.8, 0);
      });
    });
  }
  function onFile(e) {
    if (e.target.id !== "kcFile") return;
    var f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    shrink(f, function (p) { if (!p) return toast(T().upFail); tmp.photo = p; openPhotoSheet(); });
  }
  function openPhotoSheet() {
    var t = T(), old = $("#kcSheet"); if (old) old.remove();
    var s = document.createElement("div"); s.className = "kc-sheet"; s.id = "kcSheet"; s.dataset.k = "photo";
    s.innerHTML = '<div><div class="grab"></div><img class="kc-prev" alt="" src="' + tmp.photo.url + '"><input class="kc-in" id="kcCap" maxlength="300" placeholder="' + t.caption + '"><button class="kc-btn" data-a="sendphoto">' + t.sendPhoto + "</button></div>";
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
    $(".kc-app").appendChild(s);
  }
  function sendPhoto() {
    var p = tmp.photo, cap = (($("#kcCap") || {}).value || "").trim(), sh = $("#kcSheet"); if (sh) sh.remove(); if (!p) return; tmp.photo = null;
    var m = { id: "l" + Date.now() + Math.random().toString(36).slice(2, 6), uid: me || A.user.id, lang: A.user.lang, text: cap, tr: {}, ts: Date.now(), local: true, uploading: true, img: { id: "", w: p.w, h: p.h, url: p.url } };
    msgs.push(m); drawMsgs(true);
    readFile(p.blob, function (d) {
      if (!d) { msgs = msgs.filter(function (x) { return x !== m; }); drawMsgs(); return toast(T().upFail); }
      api("/api/media", { peer: peer.id, mime: "image/jpeg", w: p.w, h: p.h, data: d.split(",")[1] }).then(function (r) {
        m.img.id = r.id; m.uploading = false; IMG[r.id] = p.url; flush(); drawMsgs();
      }).catch(function (e) { msgs = msgs.filter(function (x) { return x !== m; }); drawMsgs(); if (!limitMsg(e)) toast(T().upFail); });
    });
  }
  function openViewer(id) {
    var src = IMG[id]; if (!src) return;
    var v = document.createElement("div"); v.className = "kc-view-img";
    v.innerHTML = '<img alt="" src="' + src + '"><button class="kc-ib" aria-label="Close">' + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
    v.addEventListener("click", function () { v.remove(); }); $(".kc-app").appendChild(v);
  }
  function openMedia(tab) {
    tab = tmp.tab = tab === "links" ? "links" : "media";
    var t = T(), old = $("#kcSheet"); if (old) old.remove();
    var imgs = msgs.filter(function (m) { return m.img && m.img.id; }).reverse(), links = [];
    msgs.forEach(function (m) { (String(m.text || "").match(/https?:\/\/[^\s<>"']+/g) || []).forEach(function (u) { links.push(u); }); }); links.reverse();
    var body = tab === "media"
      ? (imgs.length ? '<div class="kc-grid">' + imgs.map(function (m) { var s = IMG[m.img.id]; return '<button class="kc-gi" data-a="viewimg" data-id="' + esc(m.img.id) + '">' + (s ? '<img alt="" src="' + s + '">' : "") + "</button>"; }).join("") + "</div>" : '<div class="kc-emp"><span>' + t.noMedia + "</span></div>")
      : (links.length ? links.map(function (u) { var h = u.replace(/^https?:\/\//, ""); return '<a class="kc-lk" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer"><b>' + esc(h.split("/")[0]) + "</b><span>" + esc(h.length > 60 ? h.slice(0, 60) + "..." : h) + "</span></a>"; }).join("") : '<div class="kc-emp"><span>' + t.noLinks + "</span></div>");
    var s = document.createElement("div"); s.className = "kc-sheet tall"; s.id = "kcSheet"; s.dataset.k = "media";
    s.innerHTML = '<div><div class="grab"></div><h3>' + t.mediaT + '</h3><div class="kc-tabs"><button data-a="tab" data-t="media" class="' + (tab === "media" ? "on" : "") + '">' + t.tabMedia + '</button><button data-a="tab" data-t="links" class="' + (tab === "links" ? "on" : "") + '">' + t.tabLinks + "</button></div>" + body + '<button class="kc-btn ghost" style="margin-top:16px" data-a="wallpaper">' + (t.wp || "Wallpaper") + "</button></div>";
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); });
    $(".kc-app").appendChild(s); hydrate(s);
  }
  var MICI = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>', XI = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>', PH = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>', VID = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3z"/></svg>', PLAYI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>', PAUSEI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>', BACKI = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>';
  var REC = null, AUD = null, PLAY = { id: "", paused: true, pct: 0, cur: 0 }, CALL = null, TONE = null, USAGE = null;
  function mmss(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }
  function drop(m) { msgs = msgs.filter(function (x) { return x !== m; }); drawMsgs(); }
  function vmax() { return USAGE && USAGE.limits ? USAGE.limits.voiceSec : (A.user && (A.user.plan === "premium" || A.user.plan === "plus") ? 120 : 30); }

  /* ---------- batas paket ---------- */
  function premiumPrompt(msg) {
    var t = T(), old = $("#kcSheet"); if (old) old.remove();
    var s = document.createElement("div"); s.className = "kc-sheet"; s.id = "kcSheet"; s.dataset.k = "prem";
    s.innerHTML = '<div><div class="grab"></div><h3>' + t.planFree + '</h3><p class="kc-note" style="font-size:14px;margin:0 0 14px">' + esc(msg) + '</p><button class="kc-btn" data-a="premium">' + t.seePremium + '</button><button class="kc-btn ghost" style="margin-top:8px" data-a="closesheet">' + t.shut + "</button></div>";
    s.addEventListener("click", function (e) { if (e.target === s) s.remove(); }); $(".kc-app").appendChild(s);
  }
  function limitMsg(e) {
    if (!e || e.code !== "limit") return false; var t = T();
    premiumPrompt(e.what === "voicelen" ? t.limVoiceLen.replace("{n}", e.max || 30) : e.what === "voice" ? t.limVoice : t.limPhoto); return true;
  }
  function loadAccount() {
    api("/api/usage").then(function (u) {
      USAGE = u; if (A.user) { A.user.plan = u.plan; A.user.until = u.until; store(); }
      var t = T(), P = u.plans || {}, F = P.free || u.limits, R = P.premium || u.limits, prem = (u.plan === "premium" || u.plan === "plus"), n = $("#kcAcc"); if (!n) return;
      var bar = function (lb, used, max) { var p = Math.min(100, Math.round(used / Math.max(1, max) * 100)); return '<div class="kc-um"><div class="r"><span>' + lb + "</span><b>" + used + " / " + max + '</b></div><div class="kc-bar2"><i style="width:' + p + '%"></i></div></div>'; };
      var fs = function (s) { return s >= 60 ? Math.round(s / 60) + " " + t.min : s + " " + t.sec; };
      var row = function (lb, a, b) { return "<tr><td>" + lb + "</td><td>" + a + '</td><td class="pr">' + b + "</td></tr>"; };
      var yn = function (v) { return v ? t.yes : t.no; };
      n.innerHTML = '<div class="kc-plan' + (prem ? " prem" : "") + '"><div class="lb">' + t.accPlan + '</div><div class="pn">' + (planLbl(u.plan)) + "</div>" + (prem && u.until ? '<div class="lb">' + t.until + " " + esc(new Date(u.until).toLocaleDateString(host.lang)) + "</div>" : "") + '<div class="lb">' + esc((A.user && A.user.email) || "") + "</div></div>" +
        '<div class="kc-h">' + t.usage + "</div>" + bar(t.uTr, u.used.tr, u.limits.tr) + bar(t.uPhoto, u.used.photoDay, u.limits.photoDay) + bar(t.uVoice, u.used.voiceDay, u.limits.voiceDay) + bar(t.uVn, u.used.vnMonth, u.limits.vnMonth) +
        '<div class="kc-h">' + t.compare + '</div><table class="kc-cmp"><tr><th></th><th>' + t.planFree + '</th><th class="pr">' + t.planPrem + "</th></tr>" + row(t.cTr, F.tr, R.tr) + row(t.cPhoto, F.photoDay, R.photoDay) + row(t.cVoice, F.voiceDay, R.voiceDay) + row(t.cVoiceLen, fs(F.voiceSec), fs(R.voiceSec)) + row(t.cVn, F.vnMonth, R.vnMonth) + row(t.cCall, fs(F.callSec), fs(R.callSec)) + row(t.cVideo, yn(F.video), yn(R.video)) + "</table>" +
        (u.upgrade_url ? '<a class="kc-btn" style="display:block;text-align:center;text-decoration:none;margin-top:16px" href="' + esc(u.upgrade_url) + '" target="_blank" rel="noopener noreferrer">' + (prem ? t.renew : t.upgrade) + "</a>" : '<div class="kc-note" style="margin-top:14px">' + t.upgradeNone + "</div>") +
        '<div class="kc-note">' + t.upgradeNote + "</div>";
    }).catch(function (e) { var n = $("#kcAcc"); if (n) n.innerHTML = '<div class="kc-emp"><span>' + (T().e[e && e.code] || T().e.server) + "</span></div>"; });
  }

  /* ---------- voice note ---------- */
  function pickMime() { var l = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"]; for (var i = 0; i < l.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(l[i])) return l[i]; return ""; }
  function startRec() {
    if (REC || CALL) return;
    if (!navigator.mediaDevices || !window.MediaRecorder) return toast(T().micFail);
    stopAud();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
      var mime = pickMime(), mr;
      try { mr = new MediaRecorder(st, mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : { audioBitsPerSecond: 24000 }); } catch (e) { st.getTracks().forEach(function (t) { t.stop(); }); return toast(T().micFail); }
      var R = REC = { mr: mr, st: st, chunks: [], t0: Date.now(), mime: (mr.mimeType || mime || "audio/webm").split(";")[0], send: false };
      mr.ondataavailable = function (e) { if (e.data && e.data.size) R.chunks.push(e.data); };
      mr.onstop = onRecStop; mr.start(250);
      var f = $("#kcForm"); if (f) f.classList.add("rec");
      R.tick = setInterval(function () { var s = Math.floor((Date.now() - R.t0) / 1000), el = $("#kcRt"); if (el) el.textContent = mmss(s); if (s >= vmax()) stopRec(true); }, 250);
    }).catch(function () { toast(T().micFail); });
  }
  function stopRec(send) { if (!REC) return; REC.send = !!send; clearInterval(REC.tick); try { REC.mr.stop(); } catch (e) { onRecStop(); } }
  function onRecStop() {
    var R = REC; if (!R) return; REC = null; clearInterval(R.tick);
    R.st.getTracks().forEach(function (t) { t.stop(); }); var f = $("#kcForm"); if (f) f.classList.remove("rec");
    var dur = Math.max(1, Math.round((Date.now() - R.t0) / 1000));
    if (!R.send || (Date.now() - R.t0) < 700 || !R.chunks.length) return;
    sendVoice(new Blob(R.chunks, { type: R.mime }), Math.min(dur, vmax()), R.mime);
  }
  function sendVoice(blob, dur, mime) {
    var url = URL.createObjectURL(blob);
    var m = { id: "l" + Date.now() + Math.random().toString(36).slice(2, 6), uid: me || A.user.id, lang: A.user.lang, text: "", tr: {}, ts: Date.now(), local: true, uploading: true, aud: { id: "", dur: dur, url: url } };
    msgs.push(m); drawMsgs(true);
    readFile(blob, function (d) {
      if (!d) { drop(m); return toast(T().micFail); }
      api("/api/media", { peer: peer.id, mime: mime, dur: dur, data: d.split(",")[1] }).then(function (r) { m.aud.id = r.id; m.uploading = false; IMG[r.id] = url; flush(); drawMsgs(); })
        .catch(function (e) { drop(m); if (!limitMsg(e)) toast(T().upFail); });
    });
  }
  function onTx(d) { var m = msgs.filter(function (x) { return x.id === d.id; })[0]; if (!m) return; if (d.text) m.text = d.text; else m.txFail = d.quota ? "quota" : "none"; drawMsgs(); }
  function audHtml(m) {
    var a = m.aud, id = a.id || "", on = id && PLAY.id === id;
    return '<div class="kc-au" data-aid="' + esc(id) + '"><button type="button" class="kc-pl" data-a="play" data-aid="' + esc(id) + '" aria-label="Play">' + (on && !PLAY.paused ? PAUSEI : PLAYI) + '</button><div class="kc-wv"><i style="width:' + (on ? PLAY.pct : 0) + '%"></i></div><span class="kc-du">' + mmss(on ? PLAY.cur : a.dur) + "</span>" + (id ? "" : '<span class="kc-sp2"></span>') + "</div>";
  }
  function audSt(m) {
    if (!m.aud || m.text) return ""; var t = T();
    if (m.txFail === "quota") return '<div class="kc-st">' + t.vnQuota + "</div>";
    if (m.txFail === "none" || Date.now() - m.ts > 25000) return "";
    return '<div class="kc-st"><span class="kc-dots"><i></i><i></i><i></i></span>' + t.vnTx + "</div>";
  }
  function fetchMedia(id, cb) {
    if (IMG[id]) return cb(true); if (LOADING[id]) return; LOADING[id] = 1;
    fetch(API + "/api/media/" + id, { headers: { authorization: "Bearer " + A.tok } }).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
      .then(function (b) { IMG[id] = URL.createObjectURL(b); delete LOADING[id]; cb(true); }).catch(function () { delete LOADING[id]; IMGFAIL[id] = 1; cb(false); });
  }
  function stopAud() { if (AUD) { try { AUD.pause(); } catch (e) {} AUD = null; } PLAY = { id: "", paused: true, pct: 0, cur: 0 }; }
  function paintAud() { var n = root.querySelector('.kc-au[data-aid="' + PLAY.id + '"]'); if (!n) return; n.querySelector(".kc-wv i").style.width = PLAY.pct + "%"; n.querySelector(".kc-du").textContent = mmss(PLAY.cur); }
  function playAud(id) {
    if (!id) return;
    if (PLAY.id === id && AUD) { if (AUD.paused) AUD.play(); else AUD.pause(); return; }
    var go2 = function () {
      stopAud(); AUD = new Audio(IMG[id]); PLAY = { id: id, paused: false, pct: 0, cur: 0 };
      AUD.ontimeupdate = function () { PLAY.cur = Math.floor(AUD.currentTime); PLAY.pct = AUD.duration ? Math.round(AUD.currentTime / AUD.duration * 100) : 0; paintAud(); };
      AUD.onpause = function () { PLAY.paused = true; drawMsgs(); }; AUD.onplay = function () { PLAY.paused = false; drawMsgs(); };
      AUD.onended = function () { PLAY = { id: "", paused: true, pct: 0, cur: 0 }; drawMsgs(); };
      var p = AUD.play(); if (p && p.catch) p.catch(function () {}); drawMsgs();
    };
    fetchMedia(id, function (ok) { if (ok) go2(); });
  }

  /* ---------- telepon dan video call (WebRTC, sinyal lewat WebSocket chat) ---------- */
  function sig(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ call: o })); }
  function newCid() { return Math.random().toString(36).slice(2, 10); }
  function getMedia(video) { if (!navigator.mediaDevices) return Promise.reject(new Error("nomedia")); return navigator.mediaDevices.getUserMedia({ audio: true, video: video ? { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } : false }); }
  function loadIce() { return api("/api/turn").then(function (r) { if (CALL) CALL.ice = r.iceServers || []; }).catch(function () {}); }
  function startCall(video) {
    if (CALL || REC) return;
    if (!ws || ws.readyState !== 1 || onl.indexOf(peer.id) < 0) return toast(T().unavailable);
    getMedia(video).then(function (st) {
      CALL = { id: newCid(), video: video, dir: "out", st: "ring", local: st, ice: [], pend: [], max: 0, muted: false, camoff: false };
      CALL.icep = loadIce(); sig({ op: "ring", cid: CALL.id, video: video }); callUI(); ringTone(true);
      CALL.to = setTimeout(function () { if (CALL && CALL.st === "ring") endCall(true, T().noAnswer); }, 40000);
    }).catch(function () { toast(T().permCall); });
  }
  function acceptCall() {
    var C = CALL; if (!C || C.st !== "incoming") return;
    getMedia(C.video).then(function (st) {
      if (CALL !== C) { st.getTracks().forEach(function (t) { t.stop(); }); return; }
      C.local = st; C.st = "connecting"; ringTone(false); C.icep = loadIce();
      sig({ op: "accept", cid: C.id }); callUI(); C.icep.then(function () { if (CALL === C) makePc(); });
    }).catch(function () { toast(T().permCall); endCall(true); });
  }
  function makePc() {
    var C = CALL, pc = new RTCPeerConnection({ iceServers: C.ice.length ? C.ice : [{ urls: ["stun:stun.cloudflare.com:3478"] }] });
    C.pc = pc; C.local.getTracks().forEach(function (t) { pc.addTrack(t, C.local); });
    pc.onicecandidate = function (e) { if (e.candidate && CALL === C) sig({ op: "ice", cid: C.id, cand: e.candidate.toJSON ? e.candidate.toJSON() : e.candidate }); };
    pc.ontrack = function (e) { C.remote = e.streams[0]; attachRemote(); };
    pc.onconnectionstatechange = function () {
      if (CALL !== C) return; var s = pc.connectionState;
      if (s === "connected") callActive();
      else if (s === "failed") endCall(true, T().failedCall);
      else if (s === "disconnected") { clearTimeout(C.dc); C.dc = setTimeout(function () { if (CALL === C && pc.connectionState !== "connected") endCall(true, T().failedCall); }, 8000); }
    };
    return pc;
  }
  function drain() { var C = CALL; if (!C || !C.pc || !C.pc.remoteDescription) return; C.pend.splice(0).forEach(function (x) { C.pc.addIceCandidate(x).catch(function () {}); }); }
  function onCall(d) {
    var C = CALL, t = T();
    if (d.op === "ring") { if (C || REC) return sig({ op: "busy", cid: d.cid }); CALL = { id: d.cid, video: !!d.video, dir: "in", st: "incoming", ice: [], pend: [], max: d.max || 300, muted: false, camoff: false }; callUI(); ringTone(true); try { navigator.vibrate && navigator.vibrate([400, 200, 400]); } catch (e) {} return; }
    if (!C || d.cid !== C.id) return;
    if (d.op === "ringok") C.max = d.max || C.max;
    else if (d.op === "denied") endCall(false, d.reason === "video" ? t.denyVideo : t.denyCalls);
    else if (d.op === "unavailable") endCall(false, t.unavailable);
    else if (d.op === "busy") endCall(false, t.busy);
    else if (d.op === "reject") endCall(false, t.rejected);
    else if (d.op === "end" || d.op === "cancel") endCall(false, t.callEnded);
    else if (d.op === "accept" && C.dir === "out") {
      clearTimeout(C.to); ringTone(false); C.st = "connecting"; callUI();
      C.icep.then(function () { if (CALL !== C) return; var pc = makePc(); pc.createOffer().then(function (o) { return pc.setLocalDescription(o); }).then(function () { sig({ op: "offer", cid: C.id, sdp: pc.localDescription }); }).catch(function () { endCall(true, t.failedCall); }); });
    } else if (d.op === "offer" && C.pc) {
      C.pc.setRemoteDescription(d.sdp).then(function () { drain(); return C.pc.createAnswer(); }).then(function (a) { return C.pc.setLocalDescription(a); }).then(function () { sig({ op: "answer", cid: C.id, sdp: C.pc.localDescription }); }).catch(function () { endCall(true, t.failedCall); });
    } else if (d.op === "answer" && C.pc) C.pc.setRemoteDescription(d.sdp).then(drain).catch(function () { endCall(true, t.failedCall); });
    else if (d.op === "ice" && d.cand) { if (C.pc && C.pc.remoteDescription) C.pc.addIceCandidate(d.cand).catch(function () {}); else C.pend.push(d.cand); }
  }
  function callActive() { var C = CALL; if (!C || C.st === "active") return; C.st = "active"; C.t0 = Date.now(); ringTone(false); callUI(); C.tick = setInterval(callTick, 1000); }
  function callTick() {
    var C = CALL; if (!C || C.st !== "active") return; var s = Math.floor((Date.now() - C.t0) / 1000), el = $("#kcCs"); if (el) el.textContent = mmss(s);
    if (C.max && s >= C.max) endCall(true, T().callMax);
  }
  function toggleMute() { var C = CALL; if (!C || !C.local) return; C.muted = !C.muted; C.local.getAudioTracks().forEach(function (t) { t.enabled = !C.muted; }); callUI(); }
  function toggleCam() { var C = CALL; if (!C || !C.local) return; C.camoff = !C.camoff; C.local.getVideoTracks().forEach(function (t) { t.enabled = !C.camoff; }); callUI(); }
  function endCall(notify, msg) {
    var C = CALL; if (!C) return; CALL = null;
    clearTimeout(C.to); clearTimeout(C.dc); clearInterval(C.tick); ringTone(false);
    if (notify) sig({ op: C.st === "ring" ? "cancel" : C.st === "incoming" ? "reject" : "end", cid: C.id });
    try { C.pc && C.pc.close(); } catch (e) {}
    if (C.local) C.local.getTracks().forEach(function (t) { t.stop(); });
    var ov = $("#kcCall"); if (ov) ov.remove(); if (msg) toast(msg);
  }
  function attachRemote() { var rv = $("#kcRV"); if (rv && CALL && CALL.remote && rv.srcObject !== CALL.remote) { rv.srcObject = CALL.remote; var p = rv.play && rv.play(); if (p && p.catch) p.catch(function () {}); } }
  function callUI() {
    var C = CALL, t = T(); if (!C) return; var ov = $("#kcCall");
    if (!ov) { ov = document.createElement("div"); ov.id = "kcCall"; ov.innerHTML = '<video id="kcRV" class="kc-rv" autoplay playsinline></video><video id="kcLV" class="kc-lv" autoplay playsinline muted></video><div class="kc-cmid">' + avP(peer, 104) + '<div class="kc-cn">' + esc(peer.name) + '</div><div class="kc-cs" id="kcCs"></div></div><div class="kc-cbar" id="kcCb"></div>'; $(".kc-app").appendChild(ov); }
    ov.className = "kc-call" + (C.video ? " video" : "") + (C.st === "active" ? " live" : "");
    var lv = $("#kcLV"); if (C.local && lv && lv.srcObject !== C.local) lv.srcObject = C.local; attachRemote();
    $("#kcCs").textContent = C.st === "incoming" ? (C.video ? t.incomingV : t.incoming) : C.st === "ring" ? t.calling : C.st === "connecting" ? t.connecting : mmss((Date.now() - C.t0) / 1000);
    var b = function (cls, act, lb, svg) { return '<button type="button" class="kc-cb ' + cls + '" data-a="' + act + '" aria-label="' + lb + '">' + svg + "<span>" + lb + "</span></button>"; };
    $("#kcCb").innerHTML = C.st === "incoming" ? b("red", "cdec", t.decline, PH) + b("grn", "cacc", t.accept, C.video ? VID : PH)
      : b(C.muted ? "on" : "", "cmute", C.muted ? t.unmute : t.mute, MICI) + (C.video ? b(C.camoff ? "on" : "", "ccam", C.camoff ? t.camOn : t.camOff, VID) : "") + b("red", "cend", t.endCall, PH);
  }
  function ringTone(on) {
    if (TONE) { clearInterval(TONE.iv); try { TONE.o.stop(); TONE.ctx.close(); } catch (e) {} TONE = null; }
    if (!on) return;
    try { var AC = window.AudioContext || window.webkitAudioContext, ctx = new AC(), o = ctx.createOscillator(), g = ctx.createGain(), hi = false; o.frequency.value = 440; g.gain.value = 0; o.connect(g); g.connect(ctx.destination); o.start(); TONE = { ctx: ctx, o: o, iv: setInterval(function () { hi = !hi; g.gain.value = hi ? 0.06 : 0; }, 900) }; } catch (e) {}
  }
  var PUSHOK = ("serviceWorker" in navigator) && ("PushManager" in window) && ("Notification" in window), DEEP = null;
  function iosNeedsInstall() { return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches)); }
  function swReady() { return Promise.race([navigator.serviceWorker.ready, new Promise(function (r) { setTimeout(function () { r(null); }, 2000); })]); }
  function u8(b) { var s = atob((b + "==".slice((b.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/")), o = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) o[i] = s.charCodeAt(i); return o; }
  function subSend(sub) { var j = sub.toJSON(); return api("/api/push/subscribe", { endpoint: j.endpoint, keys: j.keys, ua: navigator.userAgent.slice(0, 120) }); }
  function pushRefresh() {
    var t = T();
    var set = function (on, txt, dis) { var bb = $("#kcPushB"), nn = $("#kcPushNote"); if (!bb || !nn) return; bb.setAttribute("aria-checked", on ? "true" : "false"); bb.dataset.on = on ? "1" : ""; bb.disabled = !!dis; nn.textContent = txt; };
    if (!$("#kcPushB")) return;
    if (!PUSHOK) return set(false, /iPad|iPhone|iPod/.test(navigator.userAgent) ? t.pushIos : t.pushNo, true);
    if (iosNeedsInstall()) return set(false, t.pushIos, true);
    if (Notification.permission === "denied") return set(false, t.pushDenied, true);
    swReady().then(function (reg) { if (!reg) throw 0; return reg.pushManager.getSubscription(); }).then(function (sub) {
      set(!!sub, sub ? t.pushOnS : t.pushOffS, false);
      if (sub && A.tok) subSend(sub).catch(function () {});
    }).catch(function () { set(false, t.pushNo, true); });
  }
  function pushToggle() {
    var b = $("#kcPushB"); if (!b || b.disabled) return;
    if (b.dataset.on) { swReady().then(function (reg) { return reg && reg.pushManager.getSubscription(); }).then(function (sub) { if (!sub) return; var ep = sub.endpoint; return sub.unsubscribe().then(function () { return api("/api/push/unsubscribe", { endpoint: ep }); }); }).then(pushRefresh, pushRefresh); return; }
    Notification.requestPermission().then(function (perm) {
      if (perm !== "granted") return pushRefresh();
      return api("/api/push/key").then(function (r) { if (!r.key) throw 0; return swReady().then(function (reg) { if (!reg) throw 0; return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: u8(r.key) }); }); }).then(subSend).then(pushRefresh);
    }).catch(function () { toast(T().pushFail); pushRefresh(); });
  }
  function pushDrop(tok) {
    if (!PUSHOK || !tok) return Promise.resolve();
    return swReady().then(function (reg) { return reg && reg.pushManager.getSubscription(); }).then(function (sub) {
      if (!sub) return; var ep = sub.endpoint;
      return sub.unsubscribe().then(function () { return fetch(API + "/api/push/unsubscribe", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tok }, body: JSON.stringify({ endpoint: ep }) }); });
    }).catch(function () {});
  }
  function sendVis() { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ vis: document.hidden })); }
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
    return '<div style="display:flex;align-items:center;gap:14px">' + avMe(68) + '<div style="flex:1;min-width:0"><div style="display:flex;flex-wrap:wrap;gap:6px"><button class="kc-btn sm ghost" data-a="avfile">' + t.avChange + "</button>" +
      (k.photo && !shared ? '<button class="kc-btn sm navy" data-a="avk">' + t.avK + "</button>" : "") + (shared ? '<button class="kc-btn sm ghost" data-a="avdel" style="color:var(--hanko)">' + t.avDel + "</button>" : "") + "</div></div></div>" +
      '<div class="kc-note" id="kcAvNote" style="margin:8px 0 12px">' + (shared ? t.avShared : k.photo ? t.avLocal : t.avNone) + '</div><input type="file" id="kcAvFile" accept="image/*" hidden>';
  }
  function avFail() { var b = $("#kcAvBlock"); if (b) b.innerHTML = avBlock(); err({ code: "avfail" }); }
  function sendAvatar(dataUrl) {
    var n = $("#kcAvNote"); if (n) n.textContent = T().avUp; clearErr();
    if (dataUrl) { try { localStorage.removeItem("kc-av-off"); } catch (e) {} }
    api("/api/me", { name: A.user.name, lang: A.user.lang, avatar: dataUrl }).then(function (r) {
      A.user = Object.assign(A.user, r.user || { avatar: dataUrl }); store();
      var b = $("#kcAvBlock"); if (b) b.innerHTML = avBlock();
      Array.prototype.forEach.call(root.querySelectorAll(".kc-pcav,.kc-mebtn"), function (n) { n.innerHTML = avMe(n.classList.contains("kc-pcav") ? 64 : 42); });
    }).catch(function (x) { var b = $("#kcAvBlock"); if (b) b.innerHTML = avBlock(); err(x); });
  }
  function openWallpaper() {
    var t = T(), old = $("#kcSheet"); if (old) old.remove();
    var s = document.createElement("div"); s.className = "kc-sheet" + (view === "chat" ? " clear" : ""); s.id = "kcSheet";
    var tiles = WPS.map(function (w) { return '<button data-a="wp" data-id="' + w.id + '" class="' + (WP.id === w.id ? "sel" : "") + '"><i style="' + (w.L.length ? wpText(w.L, w.c) : "background:var(--kbg)") + '"></i>' + w.n + "</button>"; }).join("") +
      (WP.img ? '<button data-a="wp" data-id="custom" class="' + (WP.id === "custom" ? "sel" : "") + '"><i style="' + wpText(wpSpec("custom", WP.img).L, "#17233d") + '"></i>Foto</button>' : "");
    s.innerHTML = '<div><div class="grab"></div><h3>' + t.wp + '</h3><button class="kc-btn" data-a="wpfile" style="margin-bottom:14px">' + t.wpUpload + '</button><div class="kc-wps">' + tiles + '</div>' +
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
    var t = T(); sheet("<h3>" + t.outAsk + '</h3><button class="kc-btn danger" data-a="logout2">' + t.outYes + '</button><button class="kc-btn ghost" style="margin-top:10px" data-a="closesheet">' + t.cancel + "</button>", "", "logout");
  }
  function doLogout() {
    var done = function () { wipe(); tmp = {}; msgs = []; contacts = []; groups = []; GI = null; GM = {}; var s = $("#kcSheet"); if (s) s.remove(); go("login"); };
    pushDrop(A.tok).then(function () { return api("/api/auth/logout", {}); }).then(done, done);
  }

  /* ---------- aksi ---------- */
  function onClick(e) {
    var b = e.target.closest("[data-a]"); if (!b) return; var a = b.dataset.a, t = T();
    if (a === "close") close();
    else if (a === "back" || a === "tocontacts") navBack();
    else if (a === "nav") go(b.dataset.t);
    else if (a === "fab") openFab();
    else if (a === "invite") openInvite();
    else if (a === "joinsheet") openJoin();
    else if (a === "plan" || a === "account" || a === "premium") openPlan();
    else if (a === "profile" || a === "settings") openProfile();
    else if (a === "newgroup") { var s0 = $("#kcSheet"); if (s0) s0.remove(); go("newgroup"); }
    else if (a === "fs") { FSK = b.dataset.v; try { localStorage.setItem(FSKEY, FSK); } catch (e0) {} applyFs(); Array.prototype.forEach.call(b.parentNode.children, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); }
    else if (a === "seasonfx") { var fx = window.SeasonFX; if (fx) { fx.setMode(fx.getMode() === "off" ? "auto" : "off"); b.setAttribute("aria-checked", fx.getMode() !== "off" ? "true" : "false"); } }
    else if (a === "openg") { var g0 = groups[+b.dataset.i]; if (g0) { newCnt = g0.unread || 0; g0.unread = 0; peer = { group: true, gid: g0.id, id: "g:" + g0.id, name: g0.name, n: g0.n }; GI = null; GM = {}; msgs = []; go("chat"); } }
    else if (a === "ginfo") openGroupInfo();
    else if (a === "photo") { var fi = $("#kcFile"); if (fi) fi.click(); }
    else if (a === "sendphoto") sendPhoto();
    else if (a === "media") openMedia("media");
    else if (a === "tab") openMedia(b.dataset.t);
    else if (a === "viewimg") openViewer(b.dataset.id);
    else if (a === "mic") startRec();
    else if (a === "reccancel") stopRec(false);
    else if (a === "recsend") stopRec(true);
    else if (a === "play") playAud(b.dataset.aid);
    else if (a === "call") startCall(false);
    else if (a === "vcall") { if (A.user && A.user.plan !== "premium" && A.user.plan !== "plus") premiumPrompt(t.denyVideo); else startCall(true); }
    else if (a === "cacc") acceptCall();
    else if (a === "cdec" || a === "cend") endCall(true);
    else if (a === "cmute") toggleMute();
    else if (a === "ccam") toggleCam();
    else if (a === "push") pushToggle();
    else if (a === "closesheet") { var sh1 = $("#kcSheet"); if (sh1) sh1.remove(); }
    else if (a === "pick") { tmp.lang = tmp.lang2 = b.dataset.l; Array.prototype.forEach.call(b.parentNode.children, function (x) { x.classList.toggle("sel", x === b); }); }
    else if (a === "pk") {
      var id = b.dataset.id, S = tmp.sel || (tmp.sel = {});
      if (!S[id] && Object.keys(S).length >= tmp.cap) return toast(tmp.capMsg);
      if (S[id]) delete S[id]; else S[id] = 1; b.classList.toggle("on", !!S[id]); updPick();
    }
    else if (a === "req" || a === "resend") {
      var em = a === "req" ? ($("#kcEmail").value || "").trim() : tmp.email; if (a === "req") { tmp.email = em; tmp.need = false; } clearErr();
      busy(b, true, t.sending);
      api("/api/auth/request", { email: em }).then(function () { go("code"); }, function (x) { busy(b, false); err(x); });
    } else if (a === "ver") {
      var body = { email: tmp.email, code: ($("#kcCode").value || "").trim() }; clearErr();
      if (tmp.need) { body.name = ($("#kcName").value || "").trim(); body.lang = tmp.lang || host.lang; }
      busy(b, true, "…");
      api("/api/auth/verify", body).then(function (r) {
        if (r.need_profile) { tmp.need = true; var c = body.code; go("code"); $("#kcCode").value = c; $("#kcName").focus(); return; }
        r.user.email = r.user.email || tmp.email; A.tok = r.token; A.user = r.user; store(); var nx = tmp.next; tmp = {}; go("chats"); if (nx === "account") openPlan();
      }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "relogin") go("login");
    else if (a === "add") {
      var c2 = $("#kcAdd"), code = (c2.value || "").trim(); if (!code) return; clearErr(); busy(b, true, "…");
      api("/api/contacts/add", { code: code }).then(function () { var s2 = $("#kcSheet"); if (s2) s2.remove(); toast(t.friendAdded); if (view === "chats") loadContacts(); }).catch(function (x) { busy(b, false); err(x); });
    } else if (a === "open") { peer = contacts[+b.dataset.i]; newCnt = peer.unread || 0; peer.unread = 0; msgs = []; go("chat"); }
    else if (a === "join") {
      var jc = ($("#kcJoin").value || "").trim(); if (!jc) return; clearErr(); busy(b, true, "…");
      api("/api/groups/join", { code: jc }).then(function (r) { var s3 = $("#kcSheet"); if (s3) s3.remove(); peer = groupPeer(r); GI = r; GM = {}; r.members.forEach(function (m) { GM[m.id] = m; }); msgs = []; tab = "groups"; go("chat"); }).catch(function (x) { busy(b, false); err(x); });
    }
    else if (a === "mk") {
      var nm0 = ($("#kcGName").value || "").trim(); clearErr(); if (!nm0) return err({ code: "gname" });
      busy(b, true, t.gCreating);
      api("/api/groups/create", { name: nm0, members: Object.keys(tmp.sel || {}) }).then(function (r) { peer = groupPeer(r); GI = r; GM = {}; r.members.forEach(function (m) { GM[m.id] = m; }); msgs = []; tab = "groups"; go("chat"); }).catch(function (x) { busy(b, false); err(x); });
    }
    else if (a === "gshare" || a === "gcopy") { if (GI) shareCode(b, t.gShareTxt + GI.group.invite, "https://kakeibo.iranza.com"); }
    else if (a === "gadd") openAddMembers();
    else if (a === "gadddo") {
      var ids = Object.keys(tmp.sel || {}); if (!ids.length) return; clearErr(); busy(b, true, "…");
      api("/api/groups/add", { id: peer.gid, users: ids }).then(function (r) { GI = r; GM = {}; r.members.forEach(function (m) { GM[m.id] = m; }); peer.n = r.members.length; var s4 = $("#kcSheet"); if (s4) s4.remove(); online(onl); drawGroupInfo(); }).catch(function (x) { busy(b, false); err(x); });
    }
    else if (a === "gkick") confirmSheet(t.gRemoveAsk.replace("{n}", b.dataset.n), t.gRemove, "gkick2", ' data-u="' + esc(b.dataset.u) + '"');
    else if (a === "gkick2") { var uu = b.dataset.u; api("/api/groups/remove", { id: peer.gid, user: uu }).then(function (r) { GI = r; GM = {}; r.members.forEach(function (m) { GM[m.id] = m; }); peer.n = r.members.length; var s5 = $("#kcSheet"); if (s5) s5.remove(); online(onl); drawGroupInfo(); }).catch(function (x) { var s6 = $("#kcSheet"); if (s6) s6.remove(); toast(t.e[x && x.code] || t.e.server); }); }
    else if (a === "grename") {
      sheet("<h3>" + t.gRename + '</h3><input class="kc-in" id="kcRen" maxlength="30" value="' + esc(GI ? GI.group.name : peer.name) + '"><div id="kcErr"></div><button class="kc-btn" data-a="grename2">' + t.save + "</button>", "", "rename");
    }
    else if (a === "grename2") {
      var rn = ($("#kcRen").value || "").trim(); clearErr(); if (!rn) return err({ code: "gname" }); busy(b, true, "…");
      api("/api/groups/rename", { id: peer.gid, name: rn }).then(function (r) { GI = r; peer.name = r.group.name; var s7 = $("#kcSheet"); if (s7) s7.remove(); var h = $("#kcGTitle"); if (h) h.textContent = peer.name; drawGroupInfo(); }).catch(function (x) { busy(b, false); err(x); });
    }
    else if (a === "gleave") confirmSheet(t.gLeaveAsk, t.gLeaveYes, "gleave2");
    else if (a === "gleave2") { api("/api/groups/leave", { id: peer.gid }).then(function () { var s8 = $("#kcSheet"); if (s8) s8.remove(); leaveChat(); tab = "groups"; go("groups"); }).catch(function (x) { var s9 = $("#kcSheet"); if (s9) s9.remove(); toast(t.e[x && x.code] || t.e.server); }); }
    else if (a === "wallpaper") openWallpaper();
    else if (a === "wp") pickWp(b.dataset.id);
    else if (a === "wpfile") { var wf = $("#kcWpFile"); if (wf) wf.click(); }
    else if (a === "avfile") { var af = $("#kcAvFile"); if (af) af.click(); }
    else if (a === "avk") { var ph = kp().photo; if (ph) { var n0 = $("#kcAvNote"); if (n0) n0.textContent = t.avUp; squareAvatar(ph, function (d) { if (d) sendAvatar(d); else avFail(); }); } }
    else if (a === "avdel") { try { localStorage.setItem("kc-av-off", "1"); } catch (e) {} sendAvatar(""); }
    else if (a === "usek") { var pn = $("#kcPName"); if (pn) pn.value = b.dataset.n; }
    else if (a === "saveprof") {
      var nm = ($("#kcPName").value || "").trim(); clearErr();
      if (!nm) return err({ code: "profile" });
      var lg = tmp.lang2 || A.user.lang; busy(b, true, "…");
      api("/api/me", { name: nm, lang: lg }).then(function (r) {
        A.user = Object.assign(A.user, r.user || { name: nm, lang: lg }); store();
        busy(b, false); b.textContent = t.savedP;
        setTimeout(function () { var s2 = $("#kcSheet"); if (s2) s2.remove(); if (view === "chats" || view === "groups" || view === "me") go(view); }, 700);
      }).catch(function (x) { busy(b, false); err(x); });
    }
    else if (a === "logout") confirmLogout();
    else if (a === "logout2") doLogout();
    else if (a === "retr") {
      var m = msgs.filter(function (x) { return x.id === b.dataset.id; })[0];
      if (m) {
        m.st = "wait"; drawMsgs(); armTr(m);
        if (ws && ws.readyState === 1) ws.send(JSON.stringify({ retr: m.id })); else { retry = 0; try { ws && ws.close(); } catch (e2) {} connect(); }
      }
    }
    else if (a === "share" || a === "copy") shareCode(b, t.shareTxt + A.user.invite, "https://kakeibo.iranza.com");
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
    } else if (e.target.id === "kcQ") { var q = e.target.value.trim().toLowerCase(); Array.prototype.forEach.call(root.querySelectorAll(".kc-li[data-n]"), function (n) { n.style.display = !q || n.dataset.n.indexOf(q) >= 0 ? "" : "none"; });
    } else if (e.target.id === "kcDim") { WP.dim = +e.target.value; applyWp(); }
    else if (e.target.id === "kcBlur") { WP.blur = +e.target.value; applyWp(); }
    else if (e.target.id === "kcCode") { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6); if (e.target.value.length === 6 && !tmp.need) { var b = $('[data-a="ver"]'); if (b) b.click(); } }
  }
  function onKey(e) {
    if (e.target.id === "kcTxt" && e.key === "Enter" && !e.shiftKey && window.matchMedia && window.matchMedia("(hover:hover)").matches) { e.preventDefault(); $("#kcForm").requestSubmit ? $("#kcForm").requestSubmit() : $("#kcSend").click(); }
    else if (e.key === "Enter" && (e.target.id === "kcEmail")) { e.preventDefault(); $('[data-a="req"]').click(); }
    else if (e.key === "Enter" && (e.target.id === "kcAdd")) { e.preventDefault(); $('[data-a="add"]').click(); }
    else if (e.key === "Enter" && e.target.id === "kcJoin") { e.preventDefault(); $('[data-a="join"]').click(); }
    else if (e.key === "Escape") navBack();
  }
  function onVis() { if (!root || !root.classList.contains("open") || view !== "chat" || closing) return; if (!ws || ws.readyState > 1) { clearTimeout(rt); retry = 0; connect(); } }
  function close() { if (!root) return; document.documentElement.classList.remove("kc-open", "kc-conv"); var pg = $("#kcPg"); if (pg) pg.remove(); var sh = $("#kcSheet"); if (sh) sh.remove(); stopAud(); if (CALL) endCall(true); leaveChat(); clearInterval(cdT); root.classList.remove("open"); document.body.style.overflow = ""; }

  window.KakeiboChat = {
    open: function (ctx) {
      host = ctx; css();
      try { var st = JSON.parse(localStorage.getItem(KEY) || "{}"); A.tok = st.tok || null; A.user = st.user || null; } catch (e0) {} // sesi bersama dengan login Kakeibo
      if (!root) {
        root = document.createElement("div"); root.id = "kcRoot"; root.innerHTML = '<div class="kc-app"><div class="kc-view"></div></div>';
        root.addEventListener("click", function (e) { if (e.target === root) return close(); onClick(e); });
        root.addEventListener("submit", onSubmit); root.addEventListener("input", onInput); root.addEventListener("change", onFile); root.addEventListener("keydown", onKey);
        root.addEventListener("change", function (e) { if (e.target.id === "kcWpFile") loadWpFile(e.target.files && e.target.files[0]); else if (e.target.id === "kcDim" || e.target.id === "kcBlur") saveWp();
          else if (e.target.id === "kcAvFile") { var f = e.target.files && e.target.files[0]; if (f) { var n1 = $("#kcAvNote"); if (n1) n1.textContent = T().avUp; readFile(f, function (src) { if (!src) return avFail(); squareAvatar(src, function (d) { if (d) sendAvatar(d); else avFail(); }); }); } } });
        document.addEventListener("visibilitychange", function () { sendVis(); if (!document.hidden) onVis(); }); window.addEventListener("online", onVis);
        document.body.appendChild(root);
      }
      root.classList.add("open"); document.body.style.overflow = "hidden"; document.documentElement.classList.add("kc-open"); applyFs();
      if (!pollT) pollT = setInterval(pollLists, 15000);
      tmp.next = ctx.view === "account" ? "account" : null; DEEP = ctx.peer || null;
      var pg0 = $("#kcPg"); if (pg0) pg0.remove(); var sh0 = $("#kcSheet"); if (sh0) sh0.remove();
      if (A.tok && A.user) { go("chats"); if (ctx.view === "account") openPlan(); } else go("login");
    },
    close: function () { close(); },
    isOpen: function () { return !!root && root.classList.contains("open"); },
    back: function () { return !!root && root.classList.contains("open") && navBack(); }
  };
})();
