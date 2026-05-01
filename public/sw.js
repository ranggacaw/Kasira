const CACHE_NAME = 'kasira-shell-v2';
const OFFLINE_URL = '/offline.html';
const MANIFEST_URL = '/manifest.webmanifest';
const SHELL_ASSETS = [
    OFFLINE_URL,
    MANIFEST_URL,
    '/icons/kasira-icon.svg',
    '/icons/kasira-maskable.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
    );

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName)),
            ).then(() => self.clients.claim()),
        ),
    );
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
