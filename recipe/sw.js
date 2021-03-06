var CACHE_STATIC_NAME = 'static-v13';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/recipe',
          '/recipe/index.html',
          '/recipe/404.html',
          '/recipe/css/normalize.css',
          '/recipe/css/main.css',
          '/recipe/css/bootstrap.min.css',
          '/recipe/css/animate.min.css',
          '/recipe/css/fontawesome-all.min.css',
          '/recipe/fonts/flaticon.css',
          '/recipe/css/owl.carousel.min.css',
          '/recipe/css/owl.theme.default.min.css',
          '/recipe/style.css',
          '/recipe/js/modernizr-3.6.0.min.js',
          '/recipe/js/jquery-3.3.1.min.js',
          '/recipe/js/popper.min.js',
          '/recipe/js/bootstrap.min.js',
          '/recipe/js/plugins.js',
          '/recipe/js/owl.carousel.min.js',
          '/recipe/js/smoothscroll.min.js',
          '/recipe/js/main.js',
          '/manifest.json',
          '/img/icons/icon-96x96.png',
          '/img/icons/icon-144x144.png',
          '/img/icons/icon-192x192.png',
          '/img/icons/icon-384x384.png',
          '/img/icons/icon-512x512.png'

          // '/src/js/app.js',
          // '/src/js/feed.js',
          // '/src/js/promise.js',
          // '/src/js/fetch.js',
          // '/src/js/material.min.js',
          // '/src/css/app.css',
          // '/src/css/feed.css',
          // '/src/images/main-image.jpg',
          // 'https://fonts.googleapis.com/css?family=Roboto:400,700',
          // 'https://fonts.googleapis.com/icon?family=Material+Icons',
          // 'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var url = 'https://httpbin.org/get';

  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    return cache.match('/offline.html');
                  });
              });
          }
        })
    );
  }
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/offline.html');
//                 });
//             });
//         }
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });
