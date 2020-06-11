self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static')
    .then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      return cache.addAll([
          "/",
          "/index.html",
          "/404.html",
          "/recipe.html",
          "/single-recipe.html",
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
      ])
    })
  )
});


self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== 'static') {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        let responseClone = response.clone();
        caches.open('static').then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      });
    }).catch(() => {
      return caches.match('/index.html');
    })
  );
});
