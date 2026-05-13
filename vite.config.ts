import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    target: "static",
  },
  plugins: [
    VitePWA({
      // Inject the SW registration helper. We register manually from
      // src/lib/pwa.ts so we can run the silent-update logic when idle.
      injectRegister: false,
      registerType: "autoUpdate",
      strategies: "generateSW",
      includeAssets: [
        "apple-touch-icon.png",
        "icon-192.png",
        "icon-512.png",
      ],
      manifest: {
        name: "La Lupita × Revolucion",
        short_name: "La Lupita",
        description: "Taqueria & Cocktail Bar — Menu",
        start_url: "/",
        scope: "/",
        id: "/",
        display: "fullscreen",
        display_override: ["fullscreen", "standalone"],
        orientation: "any",
        background_color: "#1a1a1a",
        theme_color: "#000000",
        lang: "en",
        categories: ["food", "lifestyle"],
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precache everything emitted by Vite (HTML, JS, CSS, fonts, images).
        // The new SW only activates once every entry is fetched, so the old
        // bundle keeps serving until the new build is fully ready.
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif,woff,woff2,webmanifest}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false,
        // Any in-app navigation that misses the network falls back to the
        // precached app shell so the kiosk never lands on a broken page.
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "menu-images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
        type: "module",
      },
    }),
  ],
});
