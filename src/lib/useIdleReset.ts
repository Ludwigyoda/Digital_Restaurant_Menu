import { useEffect, useRef, useState } from "react";

const IDLE_WARNING_MS = 100_000;
const IDLE_RESET_MS = 120_000;
const WARNING_WINDOW_S = 20;

/**
 * Tablet kiosk idle behavior: at 100s of inactivity, surface a 20s countdown.
 * Any tap/keypress cancels the countdown and rearms. At 120s, fire onReset.
 */
export function useIdleReset(onReset: () => void) {
  const [warningSecondsLeft, setWarningSecondsLeft] = useState<number | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const clearAll = () => {
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };

    const performReset = () => {
      onReset();
      setWarningSecondsLeft(null);
    };

    const startWarning = () => {
      setWarningSecondsLeft(WARNING_WINDOW_S);
      countdownInterval.current = setInterval(() => {
        setWarningSecondsLeft((s) => (s !== null && s > 0 ? s - 1 : 0));
      }, 1000);
      resetTimer.current = setTimeout(() => {
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        performReset();
      }, IDLE_RESET_MS - IDLE_WARNING_MS);
    };

    const armTimers = () => {
      clearAll();
      setWarningSecondsLeft(null);
      warningTimer.current = setTimeout(startWarning, IDLE_WARNING_MS);
    };

    armTimers();
    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, armTimers));
    return () => {
      events.forEach((e) => window.removeEventListener(e, armTimers));
      clearAll();
    };
  }, [onReset]);

  return { warningSecondsLeft };
}
