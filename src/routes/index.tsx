import { useCallback, useMemo, useState } from "react";
import { MENU, type Item } from "@/data/menu";
import { TopNav } from "@/components/menu/TopNav";
import { SubTabs } from "@/components/menu/SubTabs";
import { ItemCard } from "@/components/menu/ItemCard";
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
    s.groups
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
  const itemsPerPage = allItems.length <= 6 ? Math.max(allItems.length, 1) : 5;
  const pages = useMemo(() => chunk(allItems, itemsPerPage), [allItems, itemsPerPage]);
  const items = pages[Math.min(pageIdx, pages.length - 1)] ?? [];
  const layout = getGridLayout(items.length);
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

      <Breadcrumb sub={sub} group={group} stepIdx={stepIdx} total={STEPS.length} />

      <section data-frame className="relative flex flex-1 overflow-hidden">
        {sub.groups && (
          <aside className="hidden md:flex w-44 shrink-0 flex-col gap-1 border-r border-border/50 px-3 py-6">
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
                  <div className="zh text-[11px] opacity-70">{g.nameZh}</div>
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
          </div>

          {pages.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 flex gap-1.5">
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

      <footer className="flex items-center justify-end border-t border-border/60 px-4 sm:px-8 py-3">
        <UpdateButton />
      </footer>

      <ItemModal
        item={openItem}
        isDrink={activeCat === "drinks"}
        onClose={() => setOpenItem(null)}
      />

      <VipModal open={vipOpen} onClose={() => setVipOpen(false)} />

      {warningSecondsLeft !== null && (
        <div className="anim-drop-up pointer-events-none fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-foreground/90 px-6 py-3 text-background shadow-2xl backdrop-blur">
          <span className="text-xs uppercase tracking-[0.25em]">
            <span className="en-text">Returning to start in {warningSecondsLeft}s · tap to cancel</span>
            <span className="zh">{warningSecondsLeft} 秒后返回起点 · 点击取消</span>
          </span>
        </div>
      )}
    </main>
  );
}
