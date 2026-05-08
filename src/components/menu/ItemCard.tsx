import { motion } from "framer-motion";
import type { Item } from "@/data/menu";
import { PriceTag } from "./PriceTag";
import { ITEM_IMAGES } from "@/data/itemImages";

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
  featured = false,
}: {
  item: Item;
  index: number;
  onOpen?: (item: Item) => void;
  featured?: boolean;
}) {
  const accent = item.accent ? accentMap[item.accent] : "var(--terracotta)";
  const image = ITEM_IMAGES[item.id];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen?.(item)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-card text-left transition-all duration-300 hover:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
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
              <p className="zh mt-0.5 text-xs text-white/70 truncate">
                {item.nameZh}
              </p>
              {item.descEn && (
                <p className="mt-1 line-clamp-1 text-[11px] text-white/60">
                  {item.descEn}
                </p>
              )}
            </div>
            <div className="shrink-0 text-white">
              {item.priceAlt ? (
                <PriceTag value={item.priceAlt[0].value} />
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
