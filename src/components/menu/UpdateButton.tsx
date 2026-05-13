import { Check, RefreshCw, WifiOff } from "lucide-react";
import { applyUpdateNow } from "@/lib/pwa";
import { useUpdateState } from "@/lib/useUpdateState";

export function UpdateButton() {
  const { online, needRefresh, offlineReady } = useUpdateState();

  if (needRefresh) {
    return (
      <button
        type="button"
        onClick={applyUpdateNow}
        aria-label="Apply menu update"
        data-update-status
        className="flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Update ready</span>
      </button>
    );
  }

  if (!online) {
    return (
      <span
        role="status"
        aria-label="Working offline"
        data-update-status
        className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 min-h-[36px]"
      >
        <WifiOff className="h-3 w-3" />
        <span>Offline</span>
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={offlineReady ? "Menu cached for offline" : "Menu up to date"}
      data-update-status
      className="flex items-center gap-2 rounded-full border border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground/60 min-h-[36px]"
    >
      <Check className="h-3 w-3" />
      <span>{offlineReady ? "Cached" : "Up to date"}</span>
    </span>
  );
}
