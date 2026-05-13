import { registerSW } from "virtual:pwa-register";

type UpdateState = {
  needRefresh: boolean;
  offlineReady: boolean;
  online: boolean;
};

type Listener = (state: UpdateState) => void;

const IDLE_MS_BEFORE_APPLY = 8_000;
const PERIODIC_CHECK_MS = 60 * 60 * 1000; // re-check every hour
const ONLINE_CHECK_DEBOUNCE_MS = 5_000;

const listeners = new Set<Listener>();
const state: UpdateState = {
  needRefresh: false,
  offlineReady: false,
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
};

function emit() {
  for (const fn of listeners) fn({ ...state });
}

let updateSWFn: ((reload?: boolean) => Promise<void>) | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let registered = false;

function armIdleApply() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (state.needRefresh && updateSWFn) {
      // Tell the waiting SW to take over. `controllerchange` fires next
      // and triggers a single silent reload into the fresh bundle.
      void updateSWFn(true);
    }
  }, IDLE_MS_BEFORE_APPLY);
}

function rearmOnActivity() {
  if (state.needRefresh) armIdleApply();
}

/**
 * Registers the service worker and wires up:
 * - silent self-update when a new build finished precaching AND the user is idle
 * - periodic SW.update() so a freshly online kiosk pulls the latest bundle
 * - online/offline broadcast for the UI badge
 */
export function registerKioskSW() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  updateSWFn = registerSW({
    immediate: true,
    onNeedRefresh() {
      state.needRefresh = true;
      emit();
      armIdleApply();
    },
    onOfflineReady() {
      state.offlineReady = true;
      emit();
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      const tryUpdate = () => {
        if (navigator.onLine) registration.update().catch(() => {});
      };

      setInterval(tryUpdate, PERIODIC_CHECK_MS);

      let onlineTimer: ReturnType<typeof setTimeout> | null = null;
      window.addEventListener("online", () => {
        state.online = true;
        emit();
        if (onlineTimer) clearTimeout(onlineTimer);
        onlineTimer = setTimeout(tryUpdate, ONLINE_CHECK_DEBOUNCE_MS);
      });
      window.addEventListener("offline", () => {
        state.online = false;
        emit();
      });
      window.addEventListener("focus", tryUpdate);
    },
    onRegisterError(err) {
      console.warn("[pwa] SW registration failed", err);
    },
  });

  ["pointerdown", "keydown", "touchstart"].forEach((evt) =>
    window.addEventListener(evt, rearmOnActivity, { passive: true }),
  );
}

export function subscribeUpdateState(fn: Listener): () => void {
  listeners.add(fn);
  fn({ ...state });
  return () => {
    listeners.delete(fn);
  };
}

export function applyUpdateNow() {
  if (updateSWFn) void updateSWFn(true);
}

export function getUpdateState(): UpdateState {
  return { ...state };
}
