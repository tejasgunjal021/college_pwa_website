var staticCacheName = "pwa-v1"; // Versioned cache name

// Install event: Caching static assets
self.addEventListener("install", function (e) {
  console.log("Service Worker: Installing...");
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      console.log("Service Worker: Caching files...");
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js",
        "/logo.png",
        "/icon.png",
        "/offline.html" // Offline fallback page
      ]);
    })
  );
});

// Activate event: Cleanup old caches
self.addEventListener("activate", function (event) {
  console.log("Service Worker: Activating...");
  var cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Service Worker: Now controlling all clients.");
      self.clients.claim();
    })
  );
});

// Fetch event: Serve from cache, then network, then offline fallback
self.addEventListener("fetch", function (event) {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log("Fetch successful (from cache):", event.request.url);
        return response; // Serve from cache
      }
      return fetch(event.request, { credentials: "include" })
        .then((networkResponse) => {
          console.log("Fetch successful (from network):", event.request.url);
          return networkResponse;
        })
        .catch(() => {
          console.log("Fetch failed, serving offline page.");
          return caches.match("/offline.html");
        });
    })
  );
});

// Push Notification Event
self.addEventListener("push", function (event) {
  console.log("Push event received.");
  const data = event.data ? event.data.json() : { message: "Default notification" };

  const options = {
    body: data.message,
    icon: "/logo.png"
  };

  event.waitUntil(
    self.registration.showNotification("VESIT", options).then(() => {
      console.log("Push Notification displayed successfully.");
    })
  );
});

// Background Sync Event
self.addEventListener("sync", function (event) {
  console.log("Sync event received:", event.tag);

  if (event.tag === "syncMessage") {
    event.waitUntil(
      (async () => {
        console.log("Processing sync event...");

        // Simulate an actual sync operation (like posting data to server)
        try {
          let response = await fetch("/sync-endpoint", { method: "POST" });
          console.log("Sync request sent:", response.status);
        } catch (error) {
          console.error("Sync request failed:", error);
        }

        // Show notification
        await self.registration.showNotification("VESIT", {
          body: "Sync successful!",
          icon: "/logo.png"
        });

        console.log("Sync event handled successfully.");
      })()
    );
  }
});

// Message event for skipWaiting
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    console.log("Skipping waiting phase...");
    self.skipWaiting();
  }
});
