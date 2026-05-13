---
name: project-deployment-target
description: This project deploys exclusively to Tencent EdgeOne Pages (static). Cloudflare Workers and Capacitor APK paths are abandoned.
metadata:
  type: project
---

The kiosk menu deploys to **Tencent EdgeOne Pages** as a pure static site, loaded by Fully Kiosk Browser on tablets in a restaurant in China (EdgeOne is the Cloudflare-equivalent that actually works in mainland China — see [docs/edgeone-setup.md](docs/edgeone-setup.md)). The deployment is static — EdgeOne CI runs `bun install` then `edgeone pages build` which expects `npm run build` to produce a single `dist/` folder it can serve as-is.

The old multi-track setup is dead:
- TanStack Start + Cloudflare Worker SSR (`vite.config.ts`, `wrangler.jsonc`, `src/server.ts`) — abandoned. Cloudflare's network is blocked/degraded in mainland China.
- Capacitor Android APK (`vite.config.apk.ts` was named for this, `android/` folder, `@capacitor/*` deps) — abandoned. Reinstalling APKs on tablets was the painful workflow EdgeOne is replacing.

**Why:** 2026-05-13, user was emphatic ("ON OUBLIE LAPK ON OUBLIE LAPP ON FAIT CA PAR TENSEN ET CEST TOUT") after EdgeOne CI broke on a `bunfig.toml` typo. Single target = EdgeOne.

**How to apply:**
- `npm run build` is the production build. It uses `vite.config.apk.ts` (yes, the filename is legacy from the APK era — it's now the EdgeOne build).
- Don't reintroduce `wrangler deploy`, `cap sync`, or `gradlew assembleDebug` in scripts unless the user explicitly revives those paths.
- PWA (vite-plugin-pwa, injectManifest mode, `src/sw.ts`) is the offline story — kiosks pull the latest bundle from EdgeOne when online, otherwise the SW serves the precached build. See [[feedback-pwa-old-version]] for the keep-old-until-new-is-ready behavior.
- `bunfig.toml` `minimumReleaseAge` must be a **number of seconds**, not a string like `"7d"`. EdgeOne's bun version rejects strings (see `dist/shm` log).
