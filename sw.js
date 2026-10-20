/* Service worker — 帳簿 Japan Work Ledger
   Cache app shell biar bisa dibuka walau lagi gak ada sinyal (data tetap di localStorage). */
const CACHE_NAME = "bocho-jp-v40";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./modules/auth.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // network-first: selalu coba ambil versi TERBARU dari server dulu kalau online (biar update
  // app langsung kerasa tanpa harus nunggu 2x buka), fallback ke cache cuma kalau offline/gagal.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// Notifikasi push chat: pesan baru dan panggilan masuk saat aplikasi tertutup atau di latar belakang
self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) {}
  const call = d.kind === "call";
  event.waitUntil(self.registration.showNotification(d.title || "Kakeibo", {
    body: d.body || "",
    tag: d.tag || "kakeibo",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    renotify: true,
    requireInteraction: call,
    vibrate: call ? [300, 150, 300, 150, 300] : [120],
    data: { peer: d.peer || "" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const peer = (event.notification.data || {}).peer || "";
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) {
      if ("focus" in w) { await w.focus(); w.postMessage({ type: "open-chat", peer }); return; }
    }
    if (self.clients.openWindow) await self.clients.openWindow("./?chat=" + encodeURIComponent(peer));
  })());
});
