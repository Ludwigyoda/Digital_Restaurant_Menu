import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MENU, type Item } from "@/data/menu";
import { TopNav } from "@/components/menu/TopNav";
import { SubTabs } from "@/components/menu/SubTabs";
import { ItemCard } from "@/components/menu/ItemCard";
import { ItemModal } from "@/components/menu/ItemModal";

export const Route = createFileRoute("/")({
  component: MenuPage,
});

// Flat sequence of (catId, subId) pairs to enable horizontal swipe across all categories
type Step = { catId: string; subId: string };
const STEPS: Step[] = MENU.flatMap((c) => c.subs.map((s) => ({ catId: c.id, subId: s.id })));

const ITEMS_PER_PAGE = 7; // 1 featured (2x2) + 6 small in 4x2 grid
const chunk = <T,>(arr: T[], size: number): T[][] => {
  if (arr.length === 0) return [[]];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

function MenuPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [activeGroup, setActiveGroup] = useState<string>("all-star");
  const [pageIdx, setPageIdx] = useState(0);
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const [direction, setDirection] = useState(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { catId: activeCat, subId: activeSub } = STEPS[stepIdx];

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
  const pages = useMemo(() => chunk(allItems, ITEMS_PER_PAGE), [allItems]);
  const items = pages[Math.min(pageIdx, pages.length - 1)] ?? [];

  const goToStep = (idx: number, dir: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, idx));
    if (next === stepIdx) return;
    setDirection(dir);
    setStepIdx(next);
    setPageIdx(0);
    const newSub = MENU.find((c) => c.id === STEPS[next].catId)?.subs.find(
      (s) => s.id === STEPS[next].subId,
    );
    if (newSub?.groups?.[0]) setActiveGroup(newSub.groups[0].id);
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

  // Idle reset
  useEffect(() => {
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setStepIdx(0);
        setActiveGroup("all-star");
        setPageIdx(0);
        setOpenItem(null);
      }, 90_000);
    };
    reset();
    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleCatSelect = (catId: string, subId: string) => {
    const idx = STEPS.findIndex((s) => s.catId === catId && s.subId === subId);
    if (idx >= 0) goToStep(idx, idx > stepIdx ? 1 : -1);
  };
  const handleSubSelect = (subId: string) => {
    const idx = STEPS.findIndex((s) => s.catId === activeCat && s.subId === subId);
    if (idx >= 0) goToStep(idx, idx > stepIdx ? 1 : -1);
  };
  const handleGroupSelect = (gid: string) => {
    setActiveGroup(gid);
    setPageIdx(0);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold || info.velocity.x < -400) next();
    else if (info.offset.x > threshold || info.velocity.x > 400) prev();
  };

  return (
    <main className="flex h-screen flex-col bg-background talavera-bg overflow-hidden">
      <TopNav
        activeCat={activeCat}
        activeSub={activeSub}
        onSelect={handleCatSelect}
      />
      <SubTabs
        category={category}
        activeSub={activeSub}
        onSelect={handleSubSelect}
      />

      <section className="relative flex flex-1 overflow-hidden">
        {/* Left rail: cocktail group selector (moved from right to left) */}
        {sub.groups && (
          <aside className="hidden md:flex w-44 shrink-0 flex-col gap-1 border-r border-border/50 px-3 py-6">
            <div className="mb-3 px-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Cocktails
            </div>
            {sub.groups.map((g) => {
              const active = g.id === activeGroup;
              return (
              <button
                  key={g.id}
                  onClick={() => handleGroupSelect(g.id)}
                  className={`rounded-xl px-3 py-3 text-left transition-colors min-h-[44px] ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <div className="font-display text-base leading-tight">
                    {g.nameEn}
                  </div>
                  <div className="zh text-[11px] opacity-70">{g.nameZh}</div>
                </button>
              );
            })}
          </aside>
        )}

        <div className="relative flex-1 overflow-hidden">
          {/* Prev/Next arrows */}
          <button
            onClick={prev}
            disabled={stepIdx === 0 && pageIdx === 0}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur p-3 shadow-lg border border-border/60 disabled:opacity-30 hover:bg-background transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={stepIdx === STEPS.length - 1 && pageIdx === pages.length - 1}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur p-3 shadow-lg border border-border/60 disabled:opacity-30 hover:bg-background transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${activeCat}-${activeSub}-${activeGroup}-${pageIdx}`}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
              className="absolute inset-0 px-4 sm:px-8 py-6 pb-10 cursor-grab active:cursor-grabbing"
            >
              <div className="grid h-full w-full grid-cols-4 grid-rows-2 gap-3 sm:gap-4">
                {items.map((item, i) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={setOpenItem}
                    featured={i === 0 && items.length > 2}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Page indicator within current sub */}
          {pages.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 flex gap-1.5">
              {pages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === pageIdx ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-border/60 px-4 sm:px-8 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span>La Lupita Taqueria</span>
        <span>Revolucion Cocktail Bar</span>
      </footer>

      <ItemModal item={openItem} onClose={() => setOpenItem(null)} />
    </main>
  );
}
