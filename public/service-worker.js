// Service Worker for Student Management Application
// Provides offline functionality, caching, and background sync

const CACHE_VERSION = "v1";
const CACHE_NAMES = {
  RUNTIME: `runtime-${CACHE_VERSION}`,
  STATIC: `static-${CACHE_VERSION}`,
  DYNAMIC: `dynamic-${CACHE_VERSION}`,
  API: `api-${CACHE_VERSION}`,
};

// Static assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAMES.STATIC)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn("[Service Worker] Error caching static assets:", err);
          // Don't fail installation if some assets fail to cache
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old cache versions
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that don't match current version
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network first, fall back to cache, then offline page
  if (url.pathname.startsWith("/api/")) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const cache = caches.open(CACHE_NAMES.API);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log("[Service Worker] Serving from cache:", request.url);
              return cachedResponse;
            }
            // Return offline page for API failures
            return caches.match(new Request("/offline.html")).catch(() => {
              return new Response("Offline - No cached data available", {
                status: 503,
                statusText: "Service Unavailable",
              });
            });
          });
        }),
    );
  }

  // Static assets - Cache first, fall back to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }

          // Clone response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAMES.RUNTIME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page if available
          return caches.match(new Request("/offline.html")).catch(() => {
            return new Response("Offline - Network request failed", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
        });
    }),
  );
});

// Background sync for storing data while offline
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync event:", event.tag);

  if (event.tag === "sync-students") {
    event.waitUntil(
      // Get stored data from IndexedDB
      getAllStoredStudents()
        .then((students) => {
          // Attempt to sync each student
          return Promise.all(
            students.map((student) => {
              return fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student),
              })
                .then(() => {
                  // Remove from IndexedDB after successful sync
                  return removeStoredStudent(student.id);
                })
                .catch((err) => {
                  console.error(
                    "[Service Worker] Sync failed for student:",
                    student.id,
                    err,
                  );
                  // Retry on next sync event
                  throw err;
                });
            }),
          );
        })
        .catch((error) => {
          console.error("[Service Worker] Sync error:", error);
          throw error; // Retry sync
        }),
    );
  }
});

// Message event - handle messages from clients
self.addEventListener("message", (event) => {
  console.log("[Service Worker] Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      }),
    );
  }
});

// Helper functions for IndexedDB operations
function getAllStoredStudents() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("StudentDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["students"], "readonly");
      const store = transaction.objectStore("students");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

function removeStoredStudent(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("StudentDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["students"], "readwrite");
      const store = transaction.objectStore("students");
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

console.log("[Service Worker] Service Worker Script Loaded");
