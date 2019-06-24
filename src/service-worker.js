/*
    Thank you Google: https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/
*/

// Update when FILES_TO_CACHE changes
const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
    '/offline.html',
    '/styles.css',
    '/TicTacToe.js'
];

// 1st Step in service worker lifecycle
// Happens every time the service work is updated
self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');

    // Precache files in the list
    evt.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});
 
// Final Step in service worker lifecycle
// Happens every time the server worker starts up
self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');

    // Clean cache of files removed from the list
    evt.waitUntil(
        caches
        .keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
                console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
            }
            }));
        })
    );
});

// Additional event to intercept any network requests
self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);

    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }

    // Prevents browsers default handling of fetch so we can control it ourselves
    evt.respondWith(
        fetch(evt.request)
        .catch(() => {
            return caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.match('offline.html');
            });
        })
    );
});







