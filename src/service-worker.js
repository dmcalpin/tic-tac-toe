/*
    Thank you Google: https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/
*/

// Update when FILES_TO_CACHE changes
const CACHE_NAME = 'static-cache-v3';

const FILES_TO_CACHE = [
    './styles.css',
    './TicTacToe.js',
    './icon_192.png',
    './icon_512.png',
    './offline.html'
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

    // Prevents browsers default handling of fetch so we can control it ourselves
    evt.respondWith(
        // Try the cache
        caches.match(evt.request)
        .then(function(response) {
            // Fall back to network
            return response || fetch(evt.request);
        }).catch(function() {
            // If both fail, show a generic fallback:
            return caches.match('./offline.html');
        })
    );
});







