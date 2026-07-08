import { useEffect } from "react";
import { X } from "lucide-react";
import type { Item } from "@/data/menu";
import { ITEM_IMAGES } from "@/data/itemImages";
import { hasCJK } from "@/lib/i18n";
import { ALLERGEN_META, detectAllergens } from "@/lib/allergens";
import { PriceTag } from "./PriceTag";

export function ItemModal({
  item,
  isDrink = false,
  onClose,
}: {
  item: Item | null;
  isDrink?: boolean;
  onClose: () => void;
}) {
  // ESC closes
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const allergens = detectAllergens(item);

  return (
    <div
      className="anim-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
    >
      <div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="anim-scale-in relative grid w-full max-w-3xl grid-cols-1 max-h-[90vh] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl portrait:grid-rows-[auto_1fr] landscape:md:grid-cols-2"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-secondary portrait:h-[40vh] landscape:md:h-full landscape:md:aspect-auto aspect-[4/3]">
          {ITEM_IMAGES[item.id] && (
            <img
              src={ITEM_IMAGES[item.id]}
              alt={item.nameEn}
              width={1024}
              height={768}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col space-y-4 p-8 overflow-y-auto">
          <div>
            <h2 className="en-text font-display text-3xl text-foreground">
              {item.nameEn}
            </h2>
            {hasCJK(item.nameZh) && (
              <p className="zh mt-1 text-lg text-muted-foreground">
                {item.nameZh}
              </p>
            )}
          </div>

          {(item.descEn || item.descZh) && (
            <div className="space-y-2 text-sm leading-relaxed">
              {isDrink && (
                <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="en-text">Ingredients · </span>
                  <span className="zh">配料</span>
                </span>
              )}
              {item.descEn && (
                <p className="en-text text-foreground/80">{item.descEn}</p>
              )}
              {hasCJK(item.descZh) && (
                <p className="zh text-base text-muted-foreground">{item.descZh}</p>
              )}
            </div>
          )}

          {allergens.length > 0 && (
            <div className="space-y-1.5">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="en-text">Allergens · </span>
                <span className="zh">过敏原</span>
              </span>
              <div className="flex flex-wrap -m-1">
                {allergens.map((id) => (
                  <span
                    key={id}
                    className="m-1 inline-flex items-center space-x-1 rounded-full border border-border/50 px-2.5 py-1 text-xs"
                  >
                    <span aria-hidden>{ALLERGEN_META[id].emoji}</span>
                    <span className="en-text text-foreground/80">{ALLERGEN_META[id].en}</span>
                    <span className="zh text-muted-foreground">{ALLERGEN_META[id].zh}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto border-t border-border/60 pt-4">
            {item.priceAlt ? (
              <div className="flex flex-wrap -m-3">
                {item.priceAlt.map((p) => (
                  <div key={p.label} className="m-3 flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {p.label}
                    </span>
                    <PriceTag value={p.value} />
                  </div>
                ))}
              </div>
            ) : (
              <PriceTag value={item.price} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
