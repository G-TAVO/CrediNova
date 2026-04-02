self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");

  event.waitUntil(
    caches.open("crediapp-cache-v1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./login.html",
        "./register.html",
        "./panel.html",
        "./admin.html",
        "./style.css",
        "./app.js",
        "./manifest.json",
        "./icons/icon-192.png",
        "./icons/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});
