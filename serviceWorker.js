const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
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
];

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    }).catch(() => caches.match('/404.html'))
  );
});
