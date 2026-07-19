/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

// vite-plugin-pwa replaces this at build time with the precache manifest
// covering every emitted asset. The new SW only activates once the entire
// manifest is fetched, so the old build keeps serving until the new one
// is fully ready.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Any in-app navigation that can't reach the network falls back to the
// precached app shell so the kiosk never lands on a broken browser page.
const navigationHandler = createHandlerBoundToURL("/index.html");
registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/sw\.js/, /^\/workbox-/, /\/api\//],
  }),
);

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({ cacheName: "google-fonts-stylesheets" }),
);

registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  }),
);

registerRoute(
  // Match par extension d'URL (pas `request.destination` : absent du vieux
  // WebView Tencent X5 ~Chrome 53 du kiosk → la route ne matchait jamais et
  // les images n'étaient jamais mises en cache).
  ({ url, sameOrigin }) =>
    sameOrigin && /\.(jpe?g|png|webp|avif)$/i.test(url.pathname),
  new CacheFirst({
    cacheName: "menu-images",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 60 }),
    ],
  }),
);

// Never skipWaiting / clientsClaim automatically. The client calls
// SKIP_WAITING explicitly when the user is idle so the kiosk swap is
// silent but never interrupts a customer mid-tap.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});
