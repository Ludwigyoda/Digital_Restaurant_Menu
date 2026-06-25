import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// Static SPA build deployed to Tencent EdgeOne Pages and loaded by Fully
// Kiosk Browser on restaurant tablets. The PWA layer (manifest + service
// worker + precache) is always on so kiosks keep working when the network
// is flaky and silently swap in the next build on idle.
//
// Tailwind est passé en v3 (via PostCSS, voir postcss.config.js) car la v4
// génère du CSS (oklch, color-mix, @property) illisible par le vieux WebView
// des tablettes RK3566. @vitejs/plugin-legacy transpile + polyfille le JS pour
// le même moteur ancien (cible chrome >= 80). Voir le plan de migration.
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    legacy({
      // Émet un bundle moderne (type=module, transpilé via build.target chrome80
      // + polyfills modernes) ET un fallback `nomodule` legacy pour les moteurs
      // sans support des modules ES. Couvre tout le spectre des vieux WebView.
      targets: ["chrome >= 80"],
      modernPolyfills: true,
    }),
    VitePWA({
      injectRegister: false,
      // "prompt" so the new SW stays in waiting until we explicitly send
      // SKIP_WAITING on idle. The old build keeps serving customers until
      // the swap is safe to apply.
      registerType: "prompt",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["apple-touch-icon.png", "icon-192.png", "icon-512.png"],
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
      injectManifest: {
        // Precache every emitted asset so the kiosk works offline from the
        // first launch. The new SW only activates once every entry is
        // fetched, so the old bundle keeps serving until the new one is
        // fully ready.
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif,woff,woff2,webmanifest}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      devOptions: { enabled: false, type: "module" },
    }),
  ],
  build: {
    // Cible le moteur ancien du kiosk pour la syntaxe JS émise par esbuild/rollup.
    target: "chrome80",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "./index.html",
    },
  },
});
