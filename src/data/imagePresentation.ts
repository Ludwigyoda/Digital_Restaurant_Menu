export type ImageFraming = {
  objectPosition: string;
  scale: number;
  translateY: number;
  transformOrigin: string;
};

const CENTERED: ImageFraming = {
  objectPosition: "50% 50%",
  scale: 1,
  translateY: 0,
  transformOrigin: "50% 50%",
};

const DRINK: ImageFraming = {
  objectPosition: "50% 62%",
  scale: 1,
  translateY: 0,
  transformOrigin: "50% 100%",
};

const WIDE_FOOD: ImageFraming = {
  objectPosition: "50% 50%",
  scale: 1,
  translateY: 0,
  transformOrigin: "50% 50%",
};

const drinkPrefixes = new Set([
  "as", "be", "cl", "en", "hh", "lc", "li", "mt", "sd", "sg", "sh", "wn",
]);

const wideFoodPrefixes = new Set(["bg", "br", "bw", "cv", "mn", "qa", "tc"]);

const ITEM_FRAMING: Record<string, Partial<ImageFraming>> = {
  "as-cuban": { objectPosition: "50% 100%", scale: 1.07, transformOrigin: "50% 100%" },
  "as-bull-kiss": { objectPosition: "50% 100%", scale: 1.16, transformOrigin: "50% 100%" },
  "as-asian-colada": { objectPosition: "50% 100%", scale: 1, translateY: 2.5, transformOrigin: "50% 100%" },
  "sg-mrs-xiaomeisha": { objectPosition: "50% 50%", scale: 1.06, transformOrigin: "50% 76%" },
  "sh-blowjob": { objectPosition: "50% 50%", scale: 1.4, translateY: 8, transformOrigin: "50% 70%" },
  "sh-jager-bomb": { objectPosition: "50% 50%", scale: 1.55, translateY: 10, transformOrigin: "50% 72%" },
  "sh-b52": { objectPosition: "50% 62%", translateY: 0, transformOrigin: "50% 100%" },
  "li-lemonade-tea": { objectPosition: "50% 68%" },
  "li-jamaica": { objectPosition: "50% 68%" },
  "be-blanche-bruges": { objectPosition: "50% 68%" },
  "be-coronarita": { objectPosition: "50% 68%" },
  "be-rose-bruges": { objectPosition: "50% 68%" },

  // Photos très panoramiques : garder le sujet au centre du cadre.
  "bs-peanuts": { objectPosition: "50% 50%" },
  "bs-cucumber": { objectPosition: "50% 50%" },
};

export function getImageFraming(itemId: string): ImageFraming {
  const prefix = itemId.split("-", 1)[0];
  const family = drinkPrefixes.has(prefix)
    ? DRINK
    : wideFoodPrefixes.has(prefix)
      ? WIDE_FOOD
      : CENTERED;

  return { ...family, ...ITEM_FRAMING[itemId] };
}
