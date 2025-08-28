const CACHE_NAME = 'dhikr-pwa-v1';
const toCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/serviceworker.js'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k =>
        k !== CACHE_NAME ? caches.delete(k) : null
      ))
    )
  );
});
