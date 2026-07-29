const CACHE_NAME = "vjox-cache-v2.0.2";

const APP_FILES = [
  "./",
  "./index.html",
  "./viewer.html",
  "./manifest.json",
  "./css/index.css",
  "./css/viewer.css",
  "./js/index.js",
  "./js/viewer.js",
  "./js/storage.js",
  "./js/images.js",
  "./js/cloudinary.js",
  "./js/share.js",
  "./js/database.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});