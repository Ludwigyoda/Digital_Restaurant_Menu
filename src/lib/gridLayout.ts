/**
 * Computes the CSS Grid layout (cols/rows + hero span) based on item count.
 * Ensures every page fills the canvas cleanly without overflow or empty cells.
 */
export function getGridLayout(count: number) {
  if (count <= 1) return { gridClass: "grid-cols-1 grid-rows-1", heroSpan: "" };
  if (count === 2) return { gridClass: "grid-cols-2 grid-rows-1", heroSpan: "" };
  if (count === 3) return { gridClass: "grid-cols-2 grid-rows-2", heroSpan: "row-span-2" };
  if (count === 4) return { gridClass: "grid-cols-2 grid-rows-2", heroSpan: "" };
  if (count === 5) return { gridClass: "grid-cols-4 grid-rows-2", heroSpan: "col-span-2 row-span-2" };
  if (count === 6) return { gridClass: "grid-cols-3 grid-rows-2", heroSpan: "" };
  // 7+ never reached (itemsPerPage capped at 5 for paginated groups in routes/index.tsx)
  return { gridClass: "grid-cols-4 grid-rows-2", heroSpan: "col-span-2 row-span-2" };
}

export const chunk = <T,>(arr: T[], size: number): T[][] => {
  if (arr.length === 0) return [[]];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
