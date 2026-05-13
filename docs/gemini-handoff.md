# Hand-off à Gemini — Finalisation APK Android

État du projet quand tu le récupères : **80% terminé**. Tu n'as plus que le build APK à faire. Tout le prep est commit.

---

## Ce qui est déjà fait (NE PAS REFAIRE)

✅ Capacitor 7 installé en deps (`@capacitor/core`, `/cli`, `/android`, `/assets`)
✅ `capacitor.config.ts` créé (appId `com.lalupita.revolucion`)
✅ Scripts `build:static` et `build:apk` dans `package.json`
✅ **Dossier `android/`** créé via `npx cap add android` — projet Gradle natif complet
✅ **Icône + splash générés** depuis `lalupita-logo2.png` (87 fichiers dans `android/app/src/main/res/`)
✅ **`AndroidManifest.xml`** configuré avec `android:screenOrientation="portrait"` sur MainActivity
✅ **`styles.xml`** configuré avec `android:windowFullscreen=true` sur les 2 thèmes
✅ Logos brand dans `src/assets/` (lalupita-logo2.png, revo-clean.png, halal.png)
✅ 44 photos compressées dans `src/assets/items/` (~4 MB total)
✅ Menu data finale dans `src/data/menu.ts` (142 items bilingues EN/中)

---

## Le SEUL problème restant : `build:static` produit du SSR

Quand tu lances `npm run build:static`, ça produit `dist/server/` (Cloudflare Worker bundle) **PAS** `dist/index.html` (SPA pour Capacitor).

C'est le piège TanStack Start. Capacitor a besoin d'un `dist/index.html` autonome qui charge l'app client-side.

### Symptôme

```
> npm run build:static
✓ built in 8.13s
> ls dist/
client/  server/        ← pas d'index.html à la racine de dist/
> ls dist/client/
apple-touch-icon.png  icon-192.png  icon-512.png  manifest.webmanifest
(aucun index.html)
```

### 3 fixes possibles à tester (du plus simple au plus radical)

#### Fix 1 — Activer le prerender de TanStack Start (préféré)

Édite `vite.config.ts`. Le `@lovable.dev/vite-tanstack-config` accepte des options TanStack Start. Tester :

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    target: "static",
    pages: ["/"], // ou "prerender": { routes: ["/"] }
  },
});
```

**Important** : la syntaxe exacte dépend de la version de TanStack Start. Vérifie `node_modules/@tanstack/react-start/dist/configs.d.ts` ou `node_modules/@lovable.dev/vite-tanstack-config/dist/*.d.ts` pour le shape exact.

J'ai testé `prerender: { enabled: true, filter: ... }` → ça crashe avec ReadableStream error. Donc essaie d'autres clés.

#### Fix 2 — Build SPA pur, sans TanStack Start

Crée un `vite.config.apk.ts` séparé qui utilise SEULEMENT plugin-react + plugin-tailwindcss + tsconfig-paths. Pas de TanStack Start :

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "./index.html",
    },
  },
});
```

Crée aussi un `index.html` à la racine :
```html
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>La Lupita × Revolución</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
```

Et un `src/main.tsx` qui bootstrap React sans TanStack Start :
```tsx
import { createRoot } from "react-dom/client";
import "./styles.css";
import { RouterProvider, createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import { Route as IndexRoute } from "./routes/index";

const rootRoute = createRootRoute();
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: IndexRoute.options.component });
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) });

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
```

Update `package.json` :
```json
"build:static": "vite build --config vite.config.apk.ts"
```

Puis `npm run build:apk` devrait passer.

#### Fix 3 — Hack post-build minimal

Si rien d'autre marche, écris un script post-build qui :
1. Prend le bundle JS dans `dist/server/assets/index-*.js`
2. Crée un `dist/index.html` qui le charge :
```html
<!doctype html><html><head><meta charset="UTF-8"/></head>
<body><div id="root"></div><script type="module" src="./assets/index-XXXX.js"></script></body>
</html>
```

Probable échec : le bundle SSR n'est pas conçu pour bootstrapper en client.

---

## Procédure complète à exécuter

```powershell
# Vérifier pré-requis
node --version           # ≥ 20
java --version           # 17.x (PAS 21.x)
echo $env:ANDROID_HOME   # doit pointer sur le SDK
echo $env:JAVA_HOME      # doit pointer sur JDK 17

# 1. Pull
git pull
npm install

# 2. FIX build:static (voir section ci-dessus)
# Essaie Fix 1 d'abord, sinon Fix 2

# 3. Valide
npm run build:static
ls dist/                 # doit afficher index.html à la racine
npx serve dist           # → http://localhost:3000 doit afficher le menu

# 4. Sync Capacitor avec le nouveau dist
npx cap sync android

# 5. Build l'APK
cd android
./gradlew assembleDebug
# (sur Windows : .\gradlew.bat assembleDebug)

# 6. APK disponible :
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Test final

```powershell
# Émulateur ou device USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Vérifie :
- [ ] App lance en portrait fullscreen, pas de bar Android
- [ ] Splash La Lupita au démarrage
- [ ] Menu navigation tactile OK
- [ ] LangSwitcher EN+中 / EN / 中 cycle
- [ ] Mode avion → app continue de fonctionner

---

## Si tu bloques

Push un commit `wip: build:static issue` avec ton dernier state, écris dans le PR description l'erreur EXACTE (commande + sortie complète). Le user humain tranchera.

**Ne pas** :
- ❌ Réinstaller framer-motion (volontairement retiré)
- ❌ Modifier `src/data/menu.ts` (data finale validée)
- ❌ Modifier `src/components/menu/*` (UX validée)
- ❌ Toucher aux photos `src/assets/items/*.jpg` (déjà optimisées)

---

*Bon courage. L'app est solide, c'est juste la conf vite-tanstack qui résiste.*
