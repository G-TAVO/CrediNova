self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
  event.waitUntil(
    caches.open("crediapp-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/login.html",
        "/register.html",
        "/panel.html",
        "/style.css",
        "/app.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});
