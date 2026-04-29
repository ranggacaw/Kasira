const CACHE_NAME = 'kasira-shell-v1';
const OFFLINE_URL = '/offline.html';
const MANIFEST_URL = '/manifest.webmanifest';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL, MANIFEST_URL])),
    );

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode !== 'navigate') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clonedResponse = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clonedResponse);
                });

                return response;
            })
            .catch(async () => {
                const cachedResponse = await caches.match(event.request);

                return cachedResponse || caches.match(OFFLINE_URL);
            }),
    );
});
