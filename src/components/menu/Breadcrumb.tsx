import type { SubCategory, SubGroup } from "@/data/menu";

type Props = {
  sub: SubCategory;
  group: SubGroup | null;
  stepIdx: number;
  total: number;
};

export function Breadcrumb({ sub, group, stepIdx, total }: Props) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 border-b border-border/30">
      <span>
        <span className="en-text">{sub.nameEn}</span>
        <span className="zh">{" "}{sub.nameZh}</span>
        {group && (
          <>
            <span className="opacity-50"> · </span>
            <span className="en-text">{group.nameEn}</span>
            <span className="zh">{" "}{group.nameZh}</span>
          </>
        )}
      </span>
      <span className="tabular">
        {stepIdx + 1} / {total}
      </span>
    </div>
  );
}
