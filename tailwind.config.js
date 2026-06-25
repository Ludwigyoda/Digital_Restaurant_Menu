/** @type {import('tailwindcss').Config} */
// Config Tailwind v3 — reprend à l'identique les tokens qui étaient déclarés
// dans le bloc `@theme inline { … }` de src/styles.css (supprimé avec la v4).
//
// Les tokens utilisés avec un modificateur d'opacité (foreground, primary,
// secondary, muted-foreground, border) sont déclarés via une FONCTION couleur
// qui émet du `rgba()` ANCIENNE syntaxe (rgba(r, g, b, a)). C'est volontaire :
// la syntaxe moderne `rgb(r g b / a)` exige Chrome ≥ 66, et on ne connaît pas
// l'âge exact du WebView du kiosk. rgba() marche sur tout moteur. Les valeurs
// RGB sont les équivalents sRGB exacts des oklch d'origine (mêmes couleurs v4).

// Émet du rgba() legacy. `base` permet de pré-multiplier l'alpha (utilisé pour
// --border qui valait blanc 8 % : border-border/50 -> 8 % * 50 % = 4 %, = v4).
// opacityValue est numérique avec un modificateur (/50 -> "0.5") et non
// numérique (undefined ou une var) pour la classe de base -> alpha = base.
const withAlpha =
  (r, g, b, base = 1) =>
  ({ opacityValue }) => {
    const n = Number(opacityValue);
    const a = Number.isFinite(n) ? n * base : base;
    return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(4))})`;
  };

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: [
    // Classes de grille construites dynamiquement dans src/lib/gridLayout.ts
    "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4",
    "grid-rows-1", "grid-rows-2", "col-span-2", "row-span-2",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: withAlpha(247, 238, 223), // cream
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: withAlpha(198, 78, 49), // terracotta
        "primary-foreground": "var(--primary-foreground)",
        // bg-secondary/50 et /60 = états hover/tap des boutons (voiles légers).
        secondary: withAlpha(42, 34, 31),
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": withAlpha(168, 156, 146),
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        // --border valait blanc 8 % ; border-border/50 -> 8 % * 50 % = 4 %
        // (fin liseré, exactement comme la v4 via color-mix).
        border: withAlpha(255, 255, 255, 0.08),
        input: "var(--input)",
        ring: "var(--ring)",

        terracotta: "var(--terracotta)",
        talavera: "var(--talavera)",
        saffron: "var(--saffron)",
        "fuchsia-mx": "var(--fuchsia-mx)",
        cactus: "var(--cactus)",
        cream: "var(--cream)",
        night: "var(--night)",

        // Palette par défaut redéfinie en rgba() legacy : sinon Tailwind émet
        // ces couleurs à opacité (bg-black/40, from-black/85, text-white/70,
        // text-amber-200…) en `rgb(r g b / a)` que le vieux moteur ne lit pas
        // -> dégradés des photos et texte blanc/ambre cassés. Valeurs = Tailwind.
        black: withAlpha(0, 0, 0),
        white: withAlpha(255, 255, 255),
        amber: {
          100: withAlpha(254, 243, 199),
          200: withAlpha(253, 230, 138),
          300: withAlpha(252, 211, 77),
          400: withAlpha(251, 191, 36),
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      fontFamily: {
        display: ["Fraunces", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        zh: ["Noto Sans SC", "Source Han Sans SC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
