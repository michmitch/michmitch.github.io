
var CACHE_STATIC_NAME = 'static-v10';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          "/",
          "/index.html",
          "/404.html",
          "/recipe.html",
          "/single-recipe1.html",
          "/css/normalize.css",
          "/css/main.css",
          "/css/bootstrap.min.css",
          "/css/animate.min.css",
          "/css/fontawesome-all.min.css",
          "/fonts/flaticon.css",
          "/css/owl.carousel.min.css",
          "/css/owl.theme.default.min.css",
          "/style.css",
          "/js/modernizr-3.6.0.min.js",
          "/js/jquery-3.3.1.min.js",
          "/js/popper.min.js",
          "/js/bootstrap.min.js",
          "js/plugins.js",
          "js/owl.carousel.min.js",
          "js/smoothscroll.min.js",
          "js/main.js",
          "/manifest.json",
          "/img/icons/icon-96x96.png",
          "/img/icons/icon-144x144.png",
          "/img/icons/icon-192x192.png",
          "/img/icons/icon-384x384.png",
          "/img/icons/icon-512x512.png"
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('/404.html');
                });
            });
        }
      })
  );
});
