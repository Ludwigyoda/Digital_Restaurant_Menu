import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MENU } from "@/data/menu";
import { LangSwitcher } from "./LangSwitcher";
import logo from "@/assets/lalupita-logo2.png";
import revoLogo from "@/assets/revo-clean.png";
import halal from "@/assets/halal.png";

type Props = {
  activeCat: string;
  activeSub: string;
  onSelect: (catId: string, subId: string) => void;
  onLogoTap?: (id: "lalupita" | "revo" | "halal") => void;
  onSubtitleTap?: () => void;
};

export function TopNav({ activeCat, activeSub, onSelect, onLogoTap, onSubtitleTap }: Props) {
  const [openCat, setOpenCat] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpenCat(null);
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, []);

  return (
    <nav ref={ref} className="border-b border-border/60">
      <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
        <div className="shrink-0 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onLogoTap?.("lalupita")}
            aria-label="La Lupita"
            className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={logo}
              alt="La Lupita Taqueria"
              width={120}
              height={48}
              className="h-12 w-auto object-contain pointer-events-none"
            />
          </button>
          <button
            type="button"
            onClick={() => onLogoTap?.("revo")}
            aria-label="Revolución"
            className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={revoLogo}
              alt="Revolucion Cocktail"
              width={120}
              height={48}
              className="h-12 w-auto object-contain pointer-events-none"
            />
          </button>
        </div>
        <ul className="flex items-center gap-1 flex-wrap">
          {MENU.map((cat) => {
            const isActive = cat.id === activeCat;
            const isOpen = openCat === cat.id;
            return (
              <li key={cat.id} className="relative shrink-0">
                <button
                  onClick={() => setOpenCat(isOpen ? null : cat.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2 transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <span className="flex flex-col items-start leading-tight text-left">
                    <span className="font-display text-base sm:text-lg tracking-wide">
                      {cat.displayEn ?? cat.nameEn}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] opacity-80">
                      <span className="en-text">{cat.subEn ?? cat.nameEn} · </span>
                      <span className="zh">{cat.nameZh}</span>
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="anim-drop-up absolute left-0 top-full z-50 mt-2 min-w-[260px] rounded-2xl border border-border bg-popover p-2 shadow-2xl">
                    {cat.subs.map((sub) => {
                      const selected = activeCat === cat.id && activeSub === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelect(cat.id, sub.id);
                            setOpenCat(null);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            selected ? "bg-secondary" : "hover:bg-secondary/60"
                          }`}
                        >
                          <span className="en-text font-medium text-foreground">{sub.nameEn}</span>
                          <span className="zh text-sm text-muted-foreground">{sub.nameZh}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onLogoTap?.("halal")}
            aria-label="Halal certified"
            className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={halal}
              alt="Mexican Halal Food 100%"
              width={48}
              height={48}
              className="h-12 w-12 object-contain pointer-events-none"
            />
          </button>
          <LangSwitcher />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSubtitleTap?.()}
        aria-label="La Lupita × Revolución"
        className="w-full border-t border-border/30 px-4 sm:px-8 py-1 text-center text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 focus:outline-none"
      >
        <span className="en-text">La Lupita × Revolución · Taqueria & Cocktail Bar · </span>
        <span className="zh">塔可餐厅 & 鸡尾酒吧</span>
      </button>
    </nav>
  );
}
