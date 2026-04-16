// SpotFinder PWA Service Worker
const CACHE_NAME = 'spotfinder-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // API 요청은 네트워크 우선
  if (e.request.url.includes('googleapis.com')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // 정적 자산은 캐시 우선
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
