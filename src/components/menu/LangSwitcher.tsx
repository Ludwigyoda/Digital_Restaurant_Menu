import { useEffect, useState } from "react";

type Lang = "en" | "zh" | "both";
const OPTIONS: { id: Lang; label: string }[] = [
  { id: "both", label: "EN+中" },
  { id: "en", label: "EN" },
  { id: "zh", label: "中" },
];

const STORAGE_KEY = "lang";

function applyLangClass(lang: Lang) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("lang-en", "lang-zh", "lang-both");
  html.classList.add(`lang-${lang}`);
}

export function LangSwitcher() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "both";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "zh" ? stored : "both";
  });

  useEffect(() => {
    applyLangClass(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore (private mode)
    }
  }, [lang]);

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border/60 p-0.5 text-[10px] uppercase tracking-[0.15em]"
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLang(opt.id)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
