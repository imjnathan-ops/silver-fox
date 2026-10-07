// Silver Fox opens from the saved copy straight away, even on a weak signal,
// and quietly fetches any newer version for next time.
const CACHE = "silver-fox-v5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); });
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then((c) => c.match(e.request, { ignoreSearch: true }).then((hit) => {
    const fresh = fetch(e.request).then((r) => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit || c.match("./index.html"));
    return hit || fresh;
  })));
});
