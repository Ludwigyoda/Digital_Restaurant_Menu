import { useCallback, useMemo, useState } from "react";
import { MENU, type Item } from "@/data/menu";
import { TopNav } from "@/components/menu/TopNav";
import { SubTabs } from "@/components/menu/SubTabs";
import { ItemCard } from "@/components/menu/ItemCard";
import { ShishaView } from "@/components/menu/ShishaView";
import { ItemModal } from "@/components/menu/ItemModal";
import { UpdateButton } from "@/components/menu/UpdateButton";
import { VipModal } from "@/components/menu/VipModal";
import { Breadcrumb } from "@/components/menu/Breadcrumb";
import { useSecretSequence } from "@/lib/secretSequence";
import { useSwipe } from "@/lib/useSwipe";
import { useIdleReset } from "@/lib/useIdleReset";
import { chunk, getGridLayout } from "@/lib/gridLayout";


// Flat sequence of (catId, subId, groupId?) so swipe traverses every group.
type Step = { catId: string; subId: string; groupId?: string };
const STEPS: Step[] = MENU.flatMap((c) =>
  c.subs.flatMap((s) =>
    // Shisha reste une seule étape : on montre tous les parfums d'un coup à
    // côté de la photo, pas un écran par groupe.
    s.groups && s.id !== "shisha"
      ? s.groups.map((g) => ({ catId: c.id, subId: s.id, groupId: g.id }))
      : [{ catId: c.id, subId: s.id }],
  ),
);

// Secret sequence: 2× La Lupita logo + 2× Revolucion logo + 1× halal badge → VIP menu.
const VIP_SEQUENCE = ["lalupita", "lalupita", "revo", "revo", "halal"] as const;
// Staff gesture: 4 taps on the "Taqueria & Cocktail Bar" subtitle → toggle fullscreen.
const FULLSCREEN_SEQUENCE = ["taqueria", "taqueria", "taqueria", "taqueria"] as const;

const isIOS = () => {
  if (typeof navigator === "undefined") return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  // iPadOS 13+ reports as MacIntel; distinguish by touch support.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
};

const toggleFullscreen = () => {
  if (typeof document === "undefined") return;
  // iOS Safari shows an anti-phishing warning on requestFullscreen — skip.
  if (isIOS()) return;
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
    return;
  }
  const el = document.documentElement as HTMLElement & {
    requestFullscreen?: (opts?: FullscreenOptions) => Promise<void>;
  };
  el.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
};

export function MenuPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const [direction, setDirection] = useState(0);
  const [vipOpen, setVipOpen] = useState(false);
  const tapLogo = useSecretSequence(VIP_SEQUENCE, () => setVipOpen(true));
  const tapSubtitle = useSecretSequence(FULLSCREEN_SEQUENCE, toggleFullscreen);

  const { catId: activeCat, subId: activeSub, groupId: activeGroup } = STEPS[stepIdx];

  const category = useMemo(
    () => MENU.find((c) => c.id === activeCat) ?? MENU[0],
    [activeCat],
  );
  const sub = useMemo(
    () => category.subs.find((s) => s.id === activeSub) ?? category.subs[0],
    [category, activeSub],
  );
  const group = useMemo(() => {
    if (!sub.groups) return null;
    return sub.groups.find((g) => g.id === activeGroup) ?? sub.groups[0];
  }, [sub, activeGroup]);

  const allItems = group?.items ?? sub.items ?? [];
  // Boissons : 5 cartes portrait max par page (au-delà on pagine), pour garder
  // le rendu de la page 5 colonnes. Food : jusqu'à 6 en grille.
  const itemsPerPage =
    activeCat === "drinks"
      ? Math.max(Math.min(allItems.length, 5), 1)
      : allItems.length <= 6
        ? Math.max(allItems.length, 1)
        : 5;
  const pages = useMemo(() => chunk(allItems, itemsPerPage), [allItems, itemsPerPage]);
  const items = pages[Math.min(pageIdx, pages.length - 1)] ?? [];
  const layout = getGridLayout(items.length, activeCat === "drinks");
  const fallbackAccent = sub.defaultAccent;

  const goToStep = (idx: number, dir: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, idx));
    if (next === stepIdx) return;
    setDirection(dir);
    setStepIdx(next);
    setPageIdx(0);
  };

  const next = () => {
    if (pageIdx < pages.length - 1) {
      setDirection(1);
      setPageIdx(pageIdx + 1);
    } else {
      goToStep(stepIdx + 1, 1);
    }
  };
  const prev = () => {
    if (pageIdx > 0) {
      setDirection(-1);
      setPageIdx(pageIdx - 1);
    } else {
      goToStep(stepIdx - 1, -1);
    }
  };

  const handleReset = useCallback(() => {
    setStepIdx(0);
    setPageIdx(0);
    setOpenItem(null);
  }, []);

  const { warningSecondsLeft } = useIdleReset(handleReset);
  const { canvasRef, pointerHandlers } = useSwipe(next, prev);

  const handleCatSelect = (catId: string, subId: string) => {
    const idx = STEPS.findIndex((s) => s.catId === catId && s.subId === subId);
    if (idx >= 0) goToStep(idx, idx > stepIdx ? 1 : -1);
  };
  const handleSubSelect = (subId: string) => {
    const idx = STEPS.findIndex((s) => s.catId === activeCat && s.subId === subId);
    if (idx >= 0) goToStep(idx, idx > stepIdx ? 1 : -1);
  };
  const handleGroupSelect = (gid: string) => {
    const idx = STEPS.findIndex(
      (s) => s.catId === activeCat && s.subId === activeSub && s.groupId === gid,
    );
    if (idx >= 0) goToStep(idx, idx > stepIdx ? 1 : -1);
  };

  return (
    <main className="flex h-dvh w-full flex-col bg-background overflow-hidden">
      <TopNav
        activeCat={activeCat}
        activeSub={activeSub}
        onSelect={handleCatSelect}
        onLogoTap={tapLogo}
        onSubtitleTap={() => tapSubtitle("taqueria")}
      />
      <SubTabs
        category={category}
        activeSub={activeSub}
        onSelect={handleSubSelect}
      />

      <Breadcrumb sub={sub} group={activeSub === "shisha" ? null : group} stepIdx={stepIdx} total={STEPS.length} />

      <section data-frame className="relative flex flex-1 overflow-hidden">
        {sub.groups && activeSub !== "shisha" && (
          <aside className="hidden md:flex w-44 shrink-0 flex-col space-y-1 border-r border-border/50 px-3 py-6">
            <div className="mb-3 px-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="en-text">{sub.nameEn}</span>
            </div>
            {sub.groups.map((g) => {
              const active = g.id === activeGroup;
              return (
                <button
                  key={g.id}
                  onClick={() => handleGroupSelect(g.id)}
                  className={`rounded-xl px-3 py-3 text-left transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <div className="en-text font-display text-base leading-tight">
                    {g.nameEn}
                  </div>
                  <div className="zh text-[13px] opacity-90">{g.nameZh}</div>
                </button>
              );
            })}
          </aside>
        )}

        <div
          className="relative flex-1 overflow-hidden touch-pan-y"
          {...pointerHandlers}
        >
          <div
            ref={canvasRef}
            data-canvas
            key={`${activeCat}-${activeSub}-${activeGroup}-${pageIdx}`}
            className={`absolute inset-0 px-4 sm:px-8 py-6 pb-10 cursor-grab active:cursor-grabbing ${
              direction >= 0 ? "anim-slide-in-right" : "anim-slide-in-left"
            }`}
          >
            {activeSub === "shisha" && sub.groups ? (
              <ShishaView groups={sub.groups} onOpen={setOpenItem} />
            ) : activeCat === "drinks" ? (
              /* Boissons = verres verticaux. On ne les met JAMAIS dans une
               * grille qui étire les cellules en large (ça coupe le haut/bas du
               * verre quand il y a peu d'items). À la place : une rangée centrée
               * de cartes PORTRAIT, comme la page à 5 colonnes qui rend bien.
               * flex-1 + max-w les fait grandir jusqu'à 400px puis justify-center
               * centre le tout ; ça marche de 1 à 5 items. (pas de flex-gap :
               * non supporté Chrome 83, on utilise des marges) */
              <div className="flex h-full w-full items-center justify-center">
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    /* Largeur FIXE = 1/5 de la rangée (basis-1/5 + grow-0/shrink-0),
                     * PAS flex-1 : sinon 3 cartes deviennent plus larges que 5 →
                     * ratio de carte différent → object-cover rogne + zoome la
                     * page à 3 et coupe la base du verre. À 1/5 fixe, une page de
                     * 3 et une page de 5 ont des cartes de même ratio → rendu
                     * identique. px (box-border) sert de gouttière (flex gap KO
                     * sur Chrome 83). h-full → jamais de clip vertical de la base. */
                    className="h-full max-h-[640px] shrink-0 grow-0 basis-1/5 max-w-[280px] px-1.5 sm:px-2"
                  >
                    <ItemCard
                      item={item}
                      index={i}
                      onOpen={setOpenItem}
                      spanClass=""
                      fallbackAccent={fallbackAccent}
                      isHero={false}
                    />
                  </div>
                ))}
              </div>
            ) : items.length === 1 ? (
              /* Un seul plat (food) : on ne l'étire pas sur tout le canvas.
               * On le centre à une taille de carte "héro" d'une page pleine.
               * (pas d'aspect-ratio : non supporté par le WebView Chrome 83) */
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-full max-h-[540px] w-full max-w-[620px]">
                  <ItemCard
                    item={items[0]}
                    index={0}
                    onOpen={setOpenItem}
                    spanClass=""
                    fallbackAccent={fallbackAccent}
                    isHero={false}
                  />
                </div>
              </div>
            ) : (
              <div className={`grid h-full w-full gap-3 sm:gap-4 ${layout.gridClass}`}>
                {items.map((item, i) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={setOpenItem}
                    spanClass={i === 0 ? layout.heroSpan : ""}
                    fallbackAccent={fallbackAccent}
                    isHero={i === 0 && layout.heroSpan !== ""}
                  />
                ))}
              </div>
            )}
          </div>

          {pages.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 flex space-x-1.5">
              {pages.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === pageIdx ? "w-8 bg-foreground" : "w-2 bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-border/60 px-4 sm:px-8 py-3">
        {/* DIAGNOSTIC TEMPORAIRE : build + moteur. Masqué en plein écran via
            `:fullscreen footer { display:none }`, d'où le petit marqueur fixe
            ci-dessous (lui, visible même en plein écran). À retirer ensuite. */}
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">
          build {__BUILD_ID__}
          {typeof navigator !== "undefined"
            ? " · " +
              (navigator.userAgent.match(/(Chrome|CriOS|Version|TBS|XWEB|MQQBrowser)\/[\d.]+/g) || [
                navigator.userAgent.slice(0, 48),
              ]).join(" · ")
            : ""}
        </span>
        <UpdateButton />
      </footer>

      <ItemModal
        item={openItem}
        isDrink={activeCat === "drinks"}
        onClose={() => setOpenItem(null)}
      />

      <VipModal open={vipOpen} onClose={() => setVipOpen(false)} />

      {warningSecondsLeft !== null && (
        <div className="anim-drop-up pointer-events-none fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-foreground px-6 py-3 text-background shadow-2xl">
          <span className="text-xs uppercase tracking-[0.25em]">
            <span className="en-text">Returning to start in {warningSecondsLeft}s · tap to cancel</span>
            <span className="zh">{warningSecondsLeft} 秒后返回起点 · 点击取消</span>
          </span>
        </div>
      )}

      {/* Grain de dithering global : casse le banding du proche-noir sur la
          dalle 6 bits du kiosk (fond, dégradés, photos sombres). Fixe,
          pointer-events:none, sous les modals. Voir .dither-overlay (styles.css). */}
      <div className="dither-overlay" aria-hidden />

      {/* DIAGNOSTIC TEMPORAIRE : marqueur de build visible MÊME en plein écran
          (le footer, lui, est masqué en plein écran). Permet de vérifier quelle
          version tourne réellement sur le kiosk. À retirer une fois confirmé. */}
      <span className="pointer-events-none fixed bottom-1 left-1 z-[90] text-[8px] tracking-wider text-white/25">
        b{__BUILD_ID__}
      </span>
    </main>
  );
}
