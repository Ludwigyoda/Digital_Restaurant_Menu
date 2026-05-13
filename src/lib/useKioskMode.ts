import { useEffect } from "react";

const BLOCKED_KEYS = new Set([
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
  "F9", "F10", "F11", "F12",
]);

/**
 * Locks the document into a kiosk-friendly state:
 *  - no context menu, no drag-and-drop, no text selection callouts
 *  - blocks dev/browser shortcut keys that a customer could trigger by accident
 *  - keeps the screen awake via the Wake Lock API when available
 *  - intercepts any stray external link so it can never escape the kiosk
 *
 * Fullscreen is NOT forced here — staff toggles it manually via the 4-tap
 * gesture on the "Taqueria & Cocktail Bar" subtitle (see MenuPage).
 */
export function useKioskMode() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (BLOCKED_KEYS.has(e.key)) {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd combos that open dev tools, save, print, find, history.
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "f", "g", "h", "j", "u", "r"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const isExternal =
        anchor instanceof HTMLAnchorElement &&
        anchor.target === "_blank";
      const isHashOrSame =
        href.startsWith("#") || href.startsWith("/") || href === "" || href.startsWith(window.location.origin);
      if (!isHashOrSame || isExternal) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", stop);
    document.addEventListener("dragstart", stop);
    document.addEventListener("selectstart", stop);
    document.addEventListener("gesturestart", stop as EventListener);
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("click", onClick, true);

    document.documentElement.classList.add("kiosk-mode");

    let wakeLock: WakeLockSentinel | null = null;
    const wakeLockApi = (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> } }).wakeLock;
    const requestWakeLock = async () => {
      try {
        if (wakeLockApi && document.visibilityState === "visible") {
          wakeLock = await wakeLockApi.request("screen");
        }
      } catch {
        // ignored — wake lock is best-effort
      }
    };
    void requestWakeLock();
    const onVisibility = () => {
      if (document.visibilityState === "visible" && !wakeLock) {
        void requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("contextmenu", stop);
      document.removeEventListener("dragstart", stop);
      document.removeEventListener("selectstart", stop);
      document.removeEventListener("gesturestart", stop as EventListener);
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.classList.remove("kiosk-mode");
      wakeLock?.release().catch(() => {});
      wakeLock = null;
    };
  }, []);
}
