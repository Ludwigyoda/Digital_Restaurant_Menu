import { useEffect } from "react";
import { X, Crown } from "lucide-react";

type VipItem = {
  id: string;
  nameEn: string;
  nameZh: string;
  descEn: string;
  descZh: string;
  price: number;
};

const VIP_ITEMS: VipItem[] = [
  {
    id: "vip-patron",
    nameEn: "El Patrón",
    nameZh: "教父",
    descEn: "Aged reserve tequila, mezcal smoke, ginger honey, fresh lime",
    descZh: "陈年龙舌兰、烟熏梅斯卡尔、姜蜜、新鲜青柠",
    price: 168,
  },
  {
    id: "vip-midnight",
    nameEn: "Midnight Lupita",
    nameZh: "午夜露佩塔",
    descEn: "Black truffle-infused mezcal, cacao bitters, blackberry coulis",
    descZh: "黑松露梅斯卡尔、可可苦精、黑莓酱汁",
    price: 188,
  },
  {
    id: "vip-royale",
    nameEn: "Revolución Royale",
    nameZh: "皇家革命",
    descEn: "Havana Club 15 yr, vintage Prosecco, edible gold leaf, citrus zest",
    descZh: "哈瓦那15年朗姆、年份普罗赛克、金箔、柑橘皮",
    price: 218,
  },
];

export function VipModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="anim-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="anim-scale-in relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-400/30 shadow-2xl"
        style={{
          background:
            "linear-gradient(155deg, #1a0f0a 0%, #2a1a08 50%, #1a0f0a 100%)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-amber-200 backdrop-blur transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pb-10 pt-12 sm:px-12">
          <div className="flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/50"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)",
                boxShadow: "0 0 24px rgba(212,175,55,0.35)",
              }}
            >
              <Crown className="h-6 w-6 text-amber-300" />
            </div>
            <h2 className="font-display text-3xl tracking-wide text-amber-100">
              <span className="en-text">Members Only</span>
              <span className="zh"> · 会员专属</span>
            </h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-amber-300/70">
              <span className="en-text">You unlocked the secret menu</span>
              <span className="zh"> · 您解锁了隐藏菜单</span>
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {VIP_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-amber-400/15 bg-black/30 p-5 transition-colors hover:border-amber-400/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="en-text font-display text-xl text-amber-100">
                      {item.nameEn}
                    </h3>
                    <p className="zh mt-0.5 text-sm text-amber-300/70">
                      {item.nameZh}
                    </p>
                    <p className="en-text mt-2 text-[12px] leading-relaxed text-amber-100/60">
                      {item.descEn}
                    </p>
                    <p className="zh mt-1 text-[12px] leading-relaxed text-amber-100/50">
                      {item.descZh}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className="font-display text-2xl text-amber-300"
                      style={{ textShadow: "0 0 12px rgba(212,175,55,0.4)" }}
                    >
                      ¥{item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-amber-400/20 pt-6 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-300/50">
              <span className="en-text">Order discreetly with your server</span>
              <span className="zh"> · 请向服务员低调点单</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
