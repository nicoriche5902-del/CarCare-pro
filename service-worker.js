const CACHE_NAME = "carcare-v3";

const STATIC_CACHE = [
  "/",
  "/index.html",
  "/manifest.json"
];

// INSTALL : cache initial
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_CACHE);
    })
  );

  self.skipWaiting();
});

// ACTIVATE : nettoyage ancien cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// FETCH : STRATEGY "CACHE FIRST + FALLBACK"
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // fallback offline simple
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});