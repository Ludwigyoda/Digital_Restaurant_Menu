# Documentation technique — Menu Tablette

Document destiné au développeur en charge de la maintenance ou des évolutions futures.

---

## Stack

- **React 19** + **TanStack Start** + **TanStack Router** + **Vite 7**
- **TailwindCSS v4** (palette oklch custom : terracotta, talavera, saffron, fuchsia-mx, cactus)
- Animations 100% **CSS keyframes** natifs (Framer Motion retiré pour alléger le bundle)
- **Sharp** pour la compression batch des photos
- Détection allergens par regex/keywords ([src/lib/allergens.ts](src/lib/allergens.ts))
- Bilingue EN/中 via classes CSS sur `<html>` (zéro JS overhead, voir [src/components/menu/LangSwitcher.tsx](src/components/menu/LangSwitcher.tsx))
- Capacitor (Phase 2) pour wrapper en APK Android

## Structure du projet

```
src/
├── data/
│   ├── menu.ts                   ← 121 items, schéma typé Category > SubCategory > SubGroup > Item
│   ├── itemImages.ts             ← glob auto sur src/assets/items/*.jpg
│   └── images.ts
├── components/menu/
│   ├── TopNav.tsx                ← logos + LangSwitcher + halal + dropdowns
│   ├── SubTabs.tsx               ← onglets sous-catégories
│   ├── ItemCard.tsx              ← card avec photo + nom + prix + allergens + Plus icon
│   ├── ItemModal.tsx             ← popup détail (portrait/landscape adaptatif)
│   ├── LangSwitcher.tsx          ← EN | 中 | EN+中 (persist localStorage)
│   ├── UpdateButton.tsx          ← bouton reload online/offline
│   ├── VipModal.tsx              ← page VIP cachée (dark gold premium)
│   └── PriceTag.tsx
├── lib/
│   ├── i18n.ts                   ← détection CJK
│   ├── allergens.ts              ← détection auto 9 allergens
│   ├── secretSequence.ts         ← hook séquence taps (VIP unlock)
│   └── utils.ts
├── routes/
│   └── index.tsx                 ← page principale (navigation, grille adaptative, idle reset)
└── styles.css                    ← palette + animations CSS + règles language

scripts/
└── optimize-images.mjs           ← compression batch via sharp (mozjpeg quality 78, max 1024px)

docs/
├── edgeone-setup.md              ← Guide hébergement Tencent EdgeOne
└── dev.md                        ← ce document
```

## Commandes

```powershell
# Développement local
bun run dev               # → http://localhost:8080
bun run lint              # ESLint
bun run format            # Prettier

# Compression images (après ajout de nouvelles images dans src/assets/items/)
node scripts/optimize-images.mjs

# Build production
bun run build             # Cloudflare Workers SSR (legacy)
bun run deploy            # déploie sur Cloudflare Workers (legacy)

# Build APK Android (Phase 2, scripts à créer)
bun run build:static      # → produit dist/ (SPA pur, déployable n'importe où)
bun run build:apk         # → produit app-release.apk via Capacitor
```

## Schéma de la donnée

Type defs dans [src/data/menu.ts](src/data/menu.ts) :

```ts
type Item = {
  id: string;
  nameEn: string;
  nameZh: string;
  descEn?: string;
  descZh?: string;
  price: number | string;
  priceAlt?: { label: string; value: number }[];
  accent?: "terracotta" | "talavera" | "saffron" | "fuchsia-mx" | "cactus";
};

type SubGroup = { id, nameEn, nameZh, items: Item[] };
type SubCategory = { id, nameEn, nameZh, defaultAccent?, items?, groups? };
type Category = { id, nameEn, nameZh, displayEn?, subEn?, subs: SubCategory[] };
```

## Phase 2 — Packaging APK Capacitor

À implémenter pour livrer l'APK Android :

1. `bun add -d @capacitor/core @capacitor/cli @capacitor/android @capacitor/assets`
2. Créer `capacitor.config.ts` à la racine :
   ```ts
   {
     appId: "com.lalupita.revolucion",
     appName: "La Lupita × Revolución",
     webDir: "dist",
   }
   ```
3. Ajouter dans `package.json` :
   ```json
   "build:static": "vite build",
   "build:apk": "bun run build:static && bunx cap sync android && cd android && ./gradlew assembleDebug"
   ```
4. `bunx cap add android` → crée le dossier `android/` (gitignoré)
5. Préparer `resources/icon.png` (1024×1024) + `resources/splash.png` (2732×2732)
6. `bunx capacitor-assets generate --android` → génère toutes les résolutions Android
7. Éditer `android/app/src/main/res/values/styles.xml` pour le mode fullscreen + portrait
8. Éditer `AndroidManifest.xml` : `android:screenOrientation="portrait"`
9. `bun run build:apk` → APK debug à `android/app/build/outputs/apk/debug/app-debug.apk`

Pré-requis machine : Android Studio + JDK 17 + variables d'env `ANDROID_HOME` et `JAVA_HOME`.

## Phase 3 — Hébergement EdgeOne (optionnel)

Permet la mise à jour à distance du menu. Voir [docs/edgeone-setup.md](docs/edgeone-setup.md).

Modifications code requises côté app :
- Ajouter `useEffect` au mount qui `fetch('/menu.json')` depuis EdgeOne
- Fallback sur la version embarquée si offline ou fetch fail
- Modifier `UpdateButton` pour forcer le refetch (no-cache)
- Externaliser `MENU` dans un `menu.json` versionné côté EdgeOne

## Sécurité supply-chain

[bunfig.toml](../bunfig.toml) contient `minimumReleaseAge = "7d"` : bloque l'installation de packages publiés depuis moins de 7 jours. Filet anti supply-chain attack inspiré de l'incident TanStack du 11 mai 2026 (84 versions malicieuses publiées dans une fenêtre de 20 minutes).

## Maintenance courante

**Ajouter/modifier un plat** :
1. Éditer [src/data/menu.ts](src/data/menu.ts)
2. (optionnel) Ajouter la photo correspondante dans [src/assets/items/](src/assets/items/) en respectant l'ID du plat (`{id}.jpg`)
3. `node scripts/optimize-images.mjs` pour compresser la nouvelle photo
4. Rebuild APK et redéployer sur les tablettes (ou push EdgeOne si Phase 3 active)

**Code secret VIP** : modifiable dans [src/routes/index.tsx](src/routes/index.tsx) ligne `VIP_SEQUENCE`.

**Idle reset durée** : constantes `IDLE_WARNING_MS` et `IDLE_RESET_MS` dans [src/routes/index.tsx](src/routes/index.tsx).
