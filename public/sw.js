/**
 * Minimal cache-first Service Worker for MyUpline PWA
 * Caches the app shell and static assets for offline availability.
 */

const CACHE_NAME = "myupline-v1";
const SHELL_URLS = [
  "/",
  "/en",
  "/am",
  "/manifest.json",
];

// Install: cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for API, cache-first for everything else
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Always bypass service worker for API routes and Next.js internals
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache fresh responses for static assets
        if (
          response.ok &&
          (url.pathname.startsWith("/_next/static/") ||
            url.pathname.startsWith("/public/"))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        // Offline fallback: return cached version if available
        caches.match(request).then(
          (cached) =>
            cached ??
            new Response(
              "<html><body style='background:#07132b;color:white;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;text-align:center'><div><h1>MyUpline</h1><p>You are offline. Please check your connection.</p></div></body></html>",
              {
                headers: { "Content-Type": "text/html" },
              }
            )
        )
      )
  );
});
