import type { Item } from "@/data/menu";
import { PriceTag } from "./PriceTag";
import shishaImg from "@/assets/shisha.jpg";

type Group = { id: string; nameEn: string; nameZh: string; items: Item[] };

// La page Shisha ne montre pas une carte par parfum (trop de vignettes quasi
// identiques). On affiche une seule photo de narguilé + la liste des parfums
// disponibles à côté ; le détail complet s'ouvre au tap sur un parfum.
export function ShishaView({
  groups,
  onOpen,
}: {
  groups: Group[];
  onOpen: (item: Item) => void;
}) {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-[2fr_3fr]">
      <div className="relative hidden overflow-hidden rounded-2xl border border-border/50 bg-secondary md:block">
        <img src={shishaImg} alt="Shisha" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-14">
          <h2 className="en-text font-display text-2xl text-white">Shisha</h2>
          <p className="zh text-lg text-white/85">水烟</p>
        </div>
      </div>

      <div className="h-full overflow-auto pr-1">
        {groups.map((g) => (
          <div key={g.id} className="mb-5">
            <div className="mb-2 flex items-baseline justify-between border-b border-border/50 pb-1.5">
              <h3 className="en-text font-display text-xl text-foreground">{g.nameEn}</h3>
              <span className="zh text-sm text-muted-foreground">{g.nameZh}</span>
            </div>
            <div className="space-y-1">
              {g.items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onOpen(it)}
                  className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-baseline">
                      <span className="en-text font-display text-lg leading-tight text-foreground">
                        {it.nameEn}
                      </span>
                      <span className="zh ml-2 text-sm text-muted-foreground">
                        {it.nameZh}
                      </span>
                    </div>
                    {it.descEn && (
                      <p className="en-text mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {it.descEn}
                      </p>
                    )}
                    {it.descZh && (
                      <p className="zh mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {it.descZh}
                      </p>
                    )}
                  </div>
                  <PriceTag value={it.price} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
