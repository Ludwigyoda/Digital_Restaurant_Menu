import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Item } from "@/data/menu";
import { ITEM_IMAGES } from "@/data/itemImages";
import { PriceTag } from "./PriceTag";

export function ItemModal({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.25 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:grid-cols-2"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-md hover:bg-black/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-[4/3] md:aspect-auto md:h-full bg-secondary">
              {ITEM_IMAGES[item.id] && (
                <img
                  src={ITEM_IMAGES[item.id]}
                  alt={item.nameEn}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-4 p-8">
              <div>
                <h2 className="font-display text-3xl text-foreground">
                  {item.nameEn}
                </h2>
                <p className="zh mt-1 text-base text-muted-foreground">
                  {item.nameZh}
                </p>
              </div>

              {(item.descEn || item.descZh) && (
                <div className="space-y-2 text-sm leading-relaxed">
                  {item.descEn && (
                    <p className="text-foreground/80">{item.descEn}</p>
                  )}
                  {item.descZh && (
                    <p className="zh text-muted-foreground">{item.descZh}</p>
                  )}
                </div>
              )}

              <div className="mt-auto border-t border-border/60 pt-4">
                {item.priceAlt ? (
                  <div className="flex gap-6">
                    {item.priceAlt.map((p) => (
                      <div key={p.label} className="flex flex-col">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
