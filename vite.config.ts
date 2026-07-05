import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// Static SPA build deployed to Tencent EdgeOne Pages and loaded by Fully
// Kiosk Browser on restaurant tablets. The PWA layer (manifest + service
// worker + precache) is always on so kiosks keep working when the network
// is flaky and silently swap in the next build on idle.
//
// Tailwind est passé en v3 (via PostCSS, voir postcss.config.js) car la v4
// génère du CSS (oklch, color-mix, @property) illisible par le vieux WebView
// des tablettes RK3566 (Chrome < 111). C'était LE problème (rendu en HTML brut).
// Le JS, lui, s'exécute déjà sur ce moteur (l'ancienne build esnext s'affichait),
// donc pas de plugin-legacy : il forçait le build du service worker vers une
// cible chrome64 que l'esbuild de Bun ne sait pas transpiler (échec sur Tencent).
// `build.target: chrome80` suffit à abaisser la syntaxe JS par sécurité.
// Identifiant de build (MMJJ-HHmm) injecté dans l'app et affiché en bas du
// menu, pour vérifier d'un coup d'œil quelle version tourne réellement sur le
// kiosk (utile tant que les mises à jour à distance posent question).
const _d = new Date();
const _p = (n: number) => String(n).padStart(2, "0");
const BUILD_ID = `${_p(_d.getMonth() + 1)}${_p(_d.getDate())}-${_p(_d.getHours())}${_p(_d.getMinutes())}`;

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  plugins: [
    react(),
    tsconfigPaths(),
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
        // IMPORTANT : on ne pré-cache QUE la coquille de l'app (js/css/html +
        // icônes/manifest). Les ~16 Mo de photos NE sont plus dans le précache.
        // Avant, le nouveau service worker devait télécharger les 16 Mo AVANT de
        // pouvoir s'activer ; sur la connexion du kiosk (Chine, variable) ça
        // n'aboutissait jamais → la mise à jour ne s'appliquait jamais et le
        // kiosk restait bloqué sur l'ancienne version. Désormais l'install est
        // minuscule → les mises à jour passent. Les photos sont mises en cache au
        // premier affichage via la route CacheFirst "menu-images" (offline OK
        // après une première navigation).
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        globIgnores: ["**/assets/*-*.{jpg,jpeg,webp,avif}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      devOptions: { enabled: false, type: "module" },
    }),
  ],
  build: {
    // Cible le moteur ancien du kiosk pour la syntaxe JS émise par esbuild/rollup.
    target: "chrome80",
    // CSS visé très bas : le kiosk (Chine, pas de WebView Google moderne) tourne
    // sur un moteur ancien et non-standard (type Tencent X5/TBS, ~Chrome 53).
    // chrome61 empêche esbuild d'émettre des hex 8 chiffres (#rrggbbaa, Chrome
    // 62+). Les couleurs à opacité sont déjà écrites en rgba() legacy via
    // tailwind.config (withAlpha) pour ne pas dépendre de `rgb(r g b / a)`.
    cssTarget: "chrome61",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "./index.html",
    },
  },
});
