// Skedaddle Service Worker
// Cache name includes version — changing it triggers the update flow
const CACHE = "skedaddle-v1.5.0";
const ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) { return cache.addAll(ASSETS); })
  );
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("message", function(e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function(e) {
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes("api.anthropic.com") || e.request.url.includes("nominatim.openstreetmap.org")) {
    return; // let browser handle
  }
  e.respondWith(
    fetch(e.request).then(function(res) {
      var clone = res.clone();
      caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
      return res;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
