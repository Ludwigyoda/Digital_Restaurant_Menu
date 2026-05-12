import type { Item } from "@/data/menu";

export type AllergenId =
  | "peanuts"
  | "shellfish"
  | "fish"
  | "eggs"
  | "dairy"
  | "gluten"
  | "nuts"
  | "spicy"
  | "vegetarian";

export const ALLERGEN_META: Record<
  AllergenId,
  { emoji: string; en: string; zh: string }
> = {
  peanuts: { emoji: "🥜", en: "Peanuts", zh: "花生" },
  shellfish: { emoji: "🦐", en: "Shellfish", zh: "海鲜" },
  fish: { emoji: "🐟", en: "Fish", zh: "鱼" },
  eggs: { emoji: "🥚", en: "Eggs", zh: "蛋类" },
  dairy: { emoji: "🧀", en: "Dairy", zh: "乳制品" },
  gluten: { emoji: "🌾", en: "Gluten", zh: "麸质" },
  nuts: { emoji: "🌰", en: "Nuts", zh: "坚果" },
  spicy: { emoji: "🌶️", en: "Spicy", zh: "辣" },
  vegetarian: { emoji: "🌱", en: "Vegetarian", zh: "素食" },
};

// Word-boundary regex lookup so "bell pepper" doesn't match "spicy pepper".
const RULES: { id: AllergenId; pattern: RegExp }[] = [
  { id: "peanuts", pattern: /\bpeanut/i },
  { id: "shellfish", pattern: /\b(shrimp|prawn|calamari|squid|lobster|crab)/i },
  { id: "fish", pattern: /\b(fish|tilapia|tuna|salmon)\b/i },
  { id: "eggs", pattern: /\b(egg|eggs|mayonnaise|mayo|aioli)\b/i },
  {
    id: "dairy",
    pattern: /\b(cheese|cream|milk|butter|crema|chantilly|baileys|yoghurt|yogurt)\b/i,
  },
  {
    id: "gluten",
    pattern: /\b(flour|bread|tortilla|tortillas|bun|brioche|fries|pasta)\b/i,
  },
  {
    id: "nuts",
    pattern: /\b(almond|pecan|walnut|cashew|hazelnut|disaronno|amaretto|orgeat)\b/i,
  },
  {
    id: "spicy",
    pattern: /\b(chili|chipotle|jalape[ñn]o|spicy|picante|hot sauce)\b/i,
  },
];

export function detectAllergens(item: Item): AllergenId[] {
  const out: AllergenId[] = [];
  // Vegetarian: convention — flagged via nameEn
  if (/vegetarian/i.test(item.nameEn)) out.push("vegetarian");

  const haystack = `${item.descEn ?? ""} ${item.nameEn}`;
  for (const { id, pattern } of RULES) {
    if (pattern.test(haystack)) out.push(id);
  }
  return out;
}
