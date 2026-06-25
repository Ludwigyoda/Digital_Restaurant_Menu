// Tailwind v3 passe par PostCSS (la v4 utilisait @tailwindcss/vite).
// postcss-oklab-function convertit les couleurs oklch() du thème en rgb()
// pour le vieux WebView du kiosk (RK3566, Chrome < 111 ne lit pas oklch).
// autoprefixer ajoute les préfixes -webkit- (ex. backdrop-filter).
export default {
  plugins: {
    tailwindcss: {},
    "@csstools/postcss-oklab-function": { preserve: false },
    autoprefixer: {},
  },
};
