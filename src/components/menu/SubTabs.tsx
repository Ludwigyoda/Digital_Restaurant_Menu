import type { Category } from "@/data/menu";

type Props = {
  category: Category;
  activeSub: string;
  onSelect: (subId: string) => void;
};

export function SubTabs({ category, activeSub, onSelect }: Props) {
  return (
    <div className="no-scrollbar flex space-x-2 overflow-x-auto px-8 py-4 border-b border-border/40">
      {category.subs.map((sub) => {
        const active = sub.id === activeSub;
        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm transition-all min-h-[44px] flex items-center space-x-2 ${
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="en-text font-display text-base">{sub.nameEn}</span>
            <span className="zh text-sm opacity-90">{sub.nameZh}</span>
          </button>
        );
      })}
    </div>
  );
}
