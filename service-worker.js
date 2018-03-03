const cacheName = 'cache-v1';

const cacheFiles = [
  './index.html',
  './js/paper.min.js',
  './js/paperscript.js',
  './16797237_1370515339673203_9071941648588982247_o.ico',
  './16797237_1370515339673203_9071941648588982247_o.jpg',
  './css/style.css'
];

function handleError(error) {
  console.error('[ServiceWorker]', error);
}

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Installing');

  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    }).catch(handleError)
  );
});

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activating');

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(thisCacheName => {
        if (thisCacheName !== cacheName) {
          console.log('[ServiceWorker] Removing cached files from', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    }).catch(handleError)
  );
});

self.addEventListener('fetch', e => {
  console.log('[ServiceWorker] Fetching', e.request.url);

  e.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(e.request).then(response => {
        let fetchPromise = fetch(e.request).then(networkResponse => {
          cache.put(e.request, networkResponse.clone());
          console.log('[ServiceWorker] Did a network request for ', e.request.url);
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }).catch(handleError)
  )
});
