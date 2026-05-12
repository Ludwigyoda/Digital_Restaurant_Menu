import { motion } from "framer-motion";
import type { Item } from "@/data/menu";
import { PriceTag } from "./PriceTag";
import { ITEM_IMAGES } from "@/data/itemImages";
import { hasCJK } from "@/lib/i18n";

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
}: {
  item: Item;
  index: number;
  onOpen?: (item: Item) => void;
  spanClass?: string;
}) {
  const accent = item.accent ? accentMap[item.accent] : "var(--terracotta)";
  const image = ITEM_IMAGES[item.id];
  const showZh = hasCJK(item.nameZh);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen?.(item)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-card text-left transition-all duration-300 hover:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${spanClass}`}
    >
      <div className="relative h-full w-full overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={item.nameEn}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-secondary to-card" />
        )}

        {/* Bottom opaque overlay with name + short desc + price */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 pt-10">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-lg leading-tight text-white truncate">
                {item.nameEn}
              </h3>
              {showZh && (
                <p className="zh mt-0.5 text-xs text-white/70 truncate">
                  {item.nameZh}
                </p>
              )}
              {item.descEn && (
                <p className="mt-1 line-clamp-2 text-[11px] text-white/60">
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

        <span
          aria-hidden
          className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
      </div>
    </motion.button>
  );
}
