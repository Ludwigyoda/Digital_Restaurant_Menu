import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MENU } from "@/data/menu";
import logo from "@/assets/lalupita-logo2.png";
import revoLogo from "@/assets/revo-clean.png";
import halal from "@/assets/halal.png";

type Props = {
  activeCat: string;
  activeSub: string;
  onSelect: (catId: string, subId: string) => void;
};

export function TopNav({ activeCat, activeSub, onSelect }: Props) {
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
    <nav
      ref={ref}
      className="flex items-center gap-4 px-4 sm:px-8 py-3 border-b border-border/60"
    >
      <div className="shrink-0 flex items-center gap-4">
        <img
          src={logo}
          alt="La Lupita Taqueria"
          className="h-12 w-auto object-contain"
        />
        <img
          src={revoLogo}
          alt="Revolucion Cocktail"
          className="h-12 w-auto object-contain"
        />
      </div>
      <ul className="flex items-center gap-1 flex-wrap">
        {MENU.map((cat) => {
          const isActive = cat.id === activeCat;
          const isOpen = openCat === cat.id;
          return (
            <li key={cat.id} className="relative shrink-0">
              <button
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors min-h-[44px] ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <span>{cat.nameEn}</span>
                <span className="zh text-xs opacity-70">{cat.nameZh}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full z-50 mt-2 min-w-[260px] rounded-2xl border border-border bg-popover p-2 shadow-2xl"
                  >
                    {cat.subs.map((sub) => {
                      const selected = activeCat === cat.id && activeSub === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelect(cat.id, sub.id);
                            setOpenCat(null);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors min-h-[44px] ${
                            selected
                              ? "bg-secondary"
                              : "hover:bg-secondary/60"
                          }`}
                        >
                          <span className="font-medium text-foreground">{sub.nameEn}</span>
                          <span className="zh text-sm text-muted-foreground">{sub.nameZh}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <img
        src={halal}
        alt="Mexican Halal Food 100%"
        className="ml-auto h-12 w-12 object-contain shrink-0"
      />
    </nav>
  );
}

