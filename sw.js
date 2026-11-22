const cachePrefix = 'spider-tracker-';
const cacheName = cachePrefix + 'public-v5';
const assets = ['./', './index.html', './manifest.webmanifest', './icon.svg', './app.css?v=5', './features.js?v=5', './recipes.js?v=5'];
const assetUrls = new Set(assets.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !assetUrls.has(event.request.url)) return;
  event.respondWith(fetch(event.request).catch(async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(event.request) ?? Response.error();
  }));
});
