import { Plus } from "lucide-react";
import type { Item } from "@/data/menu";
import { PriceTag } from "./PriceTag";
import { ITEM_IMAGES } from "@/data/itemImages";
import { hasCJK } from "@/lib/i18n";
import { ALLERGEN_META, detectAllergens } from "@/lib/allergens";

const accentMap: Record<NonNullable<Item["accent"]>, string> = {
  terracotta: "var(--terracotta)",
  talavera: "var(--talavera)",
  saffron: "var(--saffron)",
  "fuchsia-mx": "var(--fuchsia-mx)",
  cactus: "var(--cactus)",
};

export function ItemCard({
  item,
  index,
  onOpen,
  spanClass = "",
  fallbackAccent,
  isHero = false,
}: {
  item: Item;
  index: number;
  onOpen?: (item: Item) => void;
  spanClass?: string;
  fallbackAccent?: NonNullable<Item["accent"]>;
  isHero?: boolean;
}) {
  const resolvedAccent = item.accent ?? fallbackAccent ?? "terracotta";
  const accent = accentMap[resolvedAccent];
  const image = ITEM_IMAGES[item.id];
  const showZh = hasCJK(item.nameZh);
  const allergens = detectAllergens(item);
  // Compact card shows max 3 emojis, hero up to 5
  const visibleAllergens = allergens.slice(0, isHero ? 5 : 3);

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      style={{ animationDelay: `${Math.min(index * 0.02, 0.12)}s` }}
      className={`anim-fade-up group relative block h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-card text-left transition-colors hover:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${spanClass}`}
    >
      <div className="relative h-full w-full overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={item.nameEn}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-secondary to-card" />
        )}

        {/* Bottom opaque overlay with name + short desc + price */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 pt-10">
          <div className="flex items-end justify-between space-x-3">
            <div className="min-w-0">
              {visibleAllergens.length > 0 && (
                <div
                  className="mb-1.5 flex items-center space-x-1 text-[12px]"
                  aria-label="Allergens"
                >
                  {visibleAllergens.map((id) => (
                    <span
                      key={id}
                      title={`${ALLERGEN_META[id].en} · ${ALLERGEN_META[id].zh}`}
                    >
                      {ALLERGEN_META[id].emoji}
                    </span>
                  ))}
                </div>
              )}
              <h3 className={`${showZh ? "en-text " : ""}font-display text-lg leading-tight text-white truncate`}>
                {item.nameEn}
              </h3>
              {showZh && (
                <p className="zh mt-0.5 text-sm text-white/90 truncate">
                  {item.nameZh}
                </p>
              )}
              {isHero && item.descEn && (
                <p className="en-text mt-1 line-clamp-2 text-[11px] text-white/60">
                  {item.descEn}
                </p>
              )}
            </div>
            <div className="shrink-0 text-white">
              {item.priceAlt ? (
                item.priceAlt.length === 2 ? (
                  <div className="flex flex-col items-end leading-tight">
                    <PriceTag value={item.priceAlt[0].value} />
                    <span className="text-[9px] uppercase tracking-wider text-white/70">
                      {item.priceAlt[0].label} · ¥{item.priceAlt[1].value} {item.priceAlt[1].label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end leading-tight">
                    <PriceTag value={`${item.priceAlt[0].value}+`} />
                    <span className="text-[9px] uppercase tracking-wider text-white/70">
                      {item.priceAlt.length} options
                    </span>
                  </div>
                )
              ) : (
                <PriceTag value={item.price} />
              )}
            </div>
          </div>
        </div>

        {/* Accent-ringed Plus affordance: signals tap-for-details + colors per category */}
        <span
          aria-hidden
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60"
          style={{
            border: `1.5px solid ${accent}`,
            boxShadow: `0 0 8px ${accent}`,
          }}
        >
          <Plus className="h-3.5 w-3.5 text-white/90" />
        </span>
      </div>
    </button>
  );
}
