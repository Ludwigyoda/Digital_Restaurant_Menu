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

// Valide le TYPE de contenu, pas seulement le statut HTTP.
//
// EdgeOne Pages ne renvoie jamais 404 : tout chemin absent renvoie l'index.html
// avec un statut 200, y compris sous /assets/. Quand le kiosk tourne sur un
// build dont les hachages de photos n'existent plus côté serveur, chaque photo
// revient donc en "200 + text/html". Un CacheableResponsePlugin({statuses:[200]})
// n'y voit que du feu et ENREGISTRE LA PAGE HTML SOUS L'URL DE LA PHOTO. Comme
// CacheFirst ne revalide jamais, l'empoisonnement est définitif : plus aucune
// photo ne s'affiche, même une fois le réseau et le bon build revenus.
//
// cacheWillUpdate      : rien qui ne soit une image n'entre dans le cache.
// cachedResponseWillBeUsed : une entrée déjà empoisonnée n'est plus resservie
//                        (elle est ignorée, la requête repart au réseau).
const isImage = {
  cacheWillUpdate: async ({ response }: { response: Response }) => {
    if (!response || response.status !== 200) return null;
    const type = response.headers.get("content-type") || "";
    return type.toLowerCase().startsWith("image/") ? response : null;
  },
  cachedResponseWillBeUsed: async ({ cachedResponse }: { cachedResponse?: Response }) => {
    if (!cachedResponse) return undefined;
    const type = cachedResponse.headers.get("content-type") || "";
    return type.toLowerCase().startsWith("image/") ? cachedResponse : undefined;
  },
};

registerRoute(
  // Match par extension d'URL (pas `request.destination` : absent du vieux
  // WebView Tencent X5 ~Chrome 53 du kiosk → la route ne matchait jamais et
  // les images n'étaient jamais mises en cache).
  ({ url, sameOrigin }) =>
    sameOrigin && /\.(jpe?g|png|webp|avif)$/i.test(url.pathname),
  new CacheFirst({
    // v2 : le cache "menu-images" du kiosk contient des pages HTML enregistrées
    // sous des URL de photos (voir isImage ci-dessous). Il n'est pas
    // récupérable, on repart à zéro.
    cacheName: "menu-images-v2",
    plugins: [
      isImage,
      // 141 photos + logos : à 200 la marge était trop courte, les dernières
      // entrées évinçaient les premières et le kiosk repartait chercher des
      // photos qu'il avait déjà eues.
      new ExpirationPlugin({ maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 60 }),
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
