const CACHE_NAME = 'platetraits-cache-v1';
const API_CACHE_NAME = 'platetraits-api-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/home.html',
    '/about.html',
    '/admin.html',
    '/contact.html',
    '/home-beta.html',
    '/tos.html',
    '/users.html',
    '/js/main.js',
    '/js/utils.js',
    '/js/admin.js',
    '/js/contact.js',
    '/js/users.js',
    '/assets/fonts/LicensePlate-j9eO.ttf',
    '/images/pt_logo.png',
    '/images/blankplate.png',
    '/images/favicon.ico',
    '/images/parkinglot_cover.png',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
    'https://cdn.jsdelivr.net/npm/toastify-js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            // Add static assets, but don't fail the install if some CDN assets are unreachable
            const staticPromise = cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('Could not cache all static assets:', err);
            });
            return staticPromise;
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // API requests: Network first, then cache
    if (requestUrl.href.startsWith('https://platetraits.com/api/')) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        return cache.match(event.request);
                    });
            })
        );
        return;
    }

    // Static assets: Cache first, then network
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then(fetchResponse => {
                // For non-API, non-static assets, cache them dynamically if they are successful GET requests
                if (event.request.method === 'GET' && fetchResponse.status === 200) {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                }
                return fetchResponse;
            });
        })
    );
});
