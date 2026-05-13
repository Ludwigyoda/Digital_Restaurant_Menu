---
name: project-deployment-target
description: This project deploys exclusively to Tencent EdgeOne Pages (static SPA). Cloudflare Workers, TanStack Start SSR, and Capacitor APK have all been removed.
metadata:
  type: project
---

The kiosk menu deploys to **Tencent EdgeOne Pages** as a pure static site, loaded by Fully Kiosk Browser on restaurant tablets in China. EdgeOne is the Cloudflare-equivalent that actually works in mainland China (see [docs/edgeone-setup.md](docs/edgeone-setup.md)). EdgeOne CI runs `bun install` then `edgeone pages build`, which calls `npm run build` and serves the resulting `dist/` folder.

**Build chain** (post-2026-05-13 cleanup):
- `vite.config.ts` — plain Vite + React + Tailwind + `vite-plugin-pwa` (injectManifest mode, SW source at `src/sw.ts`)
- `src/main.tsx` — single-page React entry, mounts `<MenuPage />` directly (no router, no react-query — both deleted along with the TanStack Start scaffold)
- PWA: precaches the whole bundle, `registerType: "prompt"` so the new SW stays in waiting until `src/lib/pwa.ts` triggers `SKIP_WAITING` on idle. Old build keeps serving until the swap is safe.

**Dead paths that were removed** — do NOT reintroduce without asking:
- TanStack Start SSR (`vite.config.ts` Lovable wrapper, `src/server.ts`, `src/start.ts`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routeTree.gen.ts`, `@tanstack/react-start`, `@tanstack/router-plugin`, `@lovable.dev/vite-tanstack-config`).
- Cloudflare Workers deploy (`wrangler.jsonc`, `@cloudflare/vite-plugin`).
- Capacitor Android APK (`capacitor.config.ts`, `android/`, `resources/`, `@capacitor/*`).
- TanStack Router + React Query (no route changes, no async data — single page).

**Why:** 2026-05-13, user was emphatic ("ON OUBLIE LAPK ON OUBLIE LAPP ON FAIT CA PAR TENSEN ET CEST TOUT") after EdgeOne CI broke first on a `bunfig.toml` typo, then on `minimumReleaseAge` blocking recently-published `@capacitor/*` versions. Single target = EdgeOne Pages.

**How to apply:**
- `npm run build` is the production build. Vite picks up `vite.config.ts` automatically — no `--config` flag needed.
- `bunfig.toml` `minimumReleaseAge` must be a **number of seconds**, not `"7d"`. EdgeOne's bun version rejects strings.
- If you add a feature that needs routing or server state, propose it explicitly and wait for sign-off before reintroducing the deleted scaffold.
