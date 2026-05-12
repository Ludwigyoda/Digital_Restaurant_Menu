import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MENU, type Item } from "@/data/menu";
import { TopNav } from "@/components/menu/TopNav";
import { SubTabs } from "@/components/menu/SubTabs";
import { ItemCard } from "@/components/menu/ItemCard";
import { ItemModal } from "@/components/menu/ItemModal";
import { UpdateButton } from "@/components/menu/UpdateButton";

export const Route = createFileRoute("/")({
  component: MenuPage,
});

// Flat sequence of (catId, subId, groupId?) so swipe traverses every group.
type Step = { catId: string; subId: string; groupId?: string };
const STEPS: Step[] = MENU.flatMap((c) =>
  c.subs.flatMap((s) =>
    s.groups
      ? s.groups.map((g) => ({ catId: c.id, subId: s.id, groupId: g.id }))
      : [{ catId: c.id, subId: s.id }],
  ),
);

const chunk = <T,>(arr: T[], size: number): T[][] => {
  if (arr.length === 0) return [[]];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

function getGridLayout(count: number) {
  if (count <= 1) return { gridClass: "grid-cols-1 grid-rows-1", heroSpan: "" };
  if (count === 2) return { gridClass: "grid-cols-2 grid-rows-1", heroSpan: "" };
  if (count === 3) return { gridClass: "grid-cols-2 grid-rows-2", heroSpan: "row-span-2" };
  if (count === 4) return { gridClass: "grid-cols-2 grid-rows-2", heroSpan: "" };
  return { gridClass: "grid-cols-4 grid-rows-2", heroSpan: "col-span-2 row-span-2" };
}

const IDLE_WARNING_MS = 100_000;
const IDLE_RESET_MS = 120_000;
const WARNING_WINDOW_S = 20;
const SWIPE_THRESHOLD_PX = 60;
const SWIPE_VELOCITY_PX_PER_S = 400;

function MenuPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const [direction, setDirection] = useState(0);
  const [warningSecondsLeft, setWarningSecondsLeft] = useState<number | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragState = useRef<{ startX: number; startTime: number; deltaX: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

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
  const itemsPerPage = allItems.length <= 6 ? Math.max(allItems.length, 1) : 7;
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

  // Idle reset with 20s countdown warning at 100s, hard reset at 120s.
  useEffect(() => {
    const clearAll = () => {
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };

    const performReset = () => {
      setStepIdx(0);
      setPageIdx(0);
      setOpenItem(null);
      setWarningSecondsLeft(null);
    };

    const startWarning = () => {
      setWarningSecondsLeft(WARNING_WINDOW_S);
      countdownInterval.current = setInterval(() => {
        setWarningSecondsLeft((s) => (s !== null && s > 0 ? s - 1 : 0));
      }, 1000);
      resetTimer.current = setTimeout(() => {
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        performReset();
      }, IDLE_RESET_MS - IDLE_WARNING_MS);
    };

    const armTimers = () => {
      clearAll();
      setWarningSecondsLeft(null);
      warningTimer.current = setTimeout(startWarning, IDLE_WARNING_MS);
    };

    armTimers();
    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, armTimers));
    return () => {
      events.forEach((e) => window.removeEventListener(e, armTimers));
      clearAll();
    };
  }, []);

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
    const idx = STEPS.findIndex(
      (s) => s.catId === activeCat && s.subId === activeSub && s.groupId === gid,
    );
    if (idx >= 0) goToStep(idx, idx > stepIdx ? 1 : -1);
  };

  // Custom swipe handlers (replaces Framer Motion drag).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragState.current = { startX: e.clientX, startTime: Date.now(), deltaX: 0 };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    dragState.current.deltaX = e.clientX - dragState.current.startX;
    if (canvasRef.current) {
      // Subtle elastic drag follow
      canvasRef.current.style.transform = `translateX(${dragState.current.deltaX * 0.4}px)`;
    }
  };
  const onPointerUp = () => {
    if (!dragState.current) return;
    const { deltaX, startTime } = dragState.current;
    const elapsed = Math.max((Date.now() - startTime) / 1000, 0.01);
    const velocity = Math.abs(deltaX) / elapsed;
    dragState.current = null;
    if (canvasRef.current) canvasRef.current.style.transform = "";
    if (deltaX < -SWIPE_THRESHOLD_PX || (deltaX < 0 && velocity > SWIPE_VELOCITY_PX_PER_S)) next();
    else if (deltaX > SWIPE_THRESHOLD_PX || (deltaX > 0 && velocity > SWIPE_VELOCITY_PX_PER_S)) prev();
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

      {/* Breadcrumb of progression */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 border-b border-border/30">
        <span>
          <span className="en-text">{sub.nameEn}</span>
          {group && (
            <>
              <span className="opacity-50"> · </span>
              <span className="en-text">{group.nameEn}</span>
            </>
          )}
        </span>
        <span className="tabular">
          {stepIdx + 1} / {STEPS.length}
        </span>
      </div>

      <section className="relative flex flex-1 overflow-hidden">
        {/* Left rail — always visible */}
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
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={canvasRef}
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

          {/* Page indicator within current group */}
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
