import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export function UpdateButton() {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const handleUpdate = () => {
    if (!online) return;
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleUpdate}
      disabled={!online}
      aria-label={online ? "Refresh menu" : "No network connection"}
      className={`flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        online
          ? "text-foreground/80 hover:bg-secondary cursor-pointer"
          : "text-muted-foreground/60 cursor-not-allowed opacity-70"
      }`}
    >
      {online ? (
        <>
          <RefreshCw className="h-3 w-3" />
          <span>Update</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </button>
  );
}
