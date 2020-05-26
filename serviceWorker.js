const staticDevCoffee = "dev-coffee-site-v1";
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

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
