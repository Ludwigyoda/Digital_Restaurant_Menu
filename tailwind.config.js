/** @type {import('tailwindcss').Config} */
// Config Tailwind v3 — reprend à l'identique les tokens qui étaient déclarés
// dans le bloc `@theme inline { … }` de src/styles.css (supprimé avec la v4).
// Les couleurs restent définies en CSS variables dans :root (converties en rgb
// par postcss-oklab-function au build). Les 4 tokens utilisés avec un
// modificateur d'opacité dans le JSX (foreground, primary, border,
// muted-foreground) sont déclarés en canaux RGB + `<alpha-value>` pour que
// `text-foreground/80`, `bg-primary/10`, `border-border/30`, etc. fonctionnent.
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
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "rgb(var(--muted-foreground-rgb) / <alpha-value>)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        // L'alpha-value (NN/100) est multiplié par 0.08 pour reproduire
        // exactement le comportement color-mix de Tailwind v4 sur --border
        // (blanc 8 %). Sinon `border-border/50` donnait du blanc 50 % criard
        // au lieu du fin liseré voulu (0.5 * 0.08 = 4 %).
        //   border-border    -> 1   * 0.08 = 8 %   (= v4)
        //   border-border/50 -> 0.5 * 0.08 = 4 %   (= v4)
        border: "rgb(var(--border-rgb) / calc(<alpha-value> * 0.08))",
        input: "var(--input)",
        ring: "var(--ring)",

        terracotta: "var(--terracotta)",
        talavera: "var(--talavera)",
        saffron: "var(--saffron)",
        "fuchsia-mx": "var(--fuchsia-mx)",
        cactus: "var(--cactus)",
        cream: "var(--cream)",
        night: "var(--night)",
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
