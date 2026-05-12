import { useEffect, useRef } from "react";

/**
 * Captures a sequence of taps over time (e.g. "lalupita lalupita revo revo halal")
 * and fires `onMatch` when the latest taps line up with `expected`.
 * Any pause > resetMs clears the in-progress sequence.
 */
export function useSecretSequence(
  expected: readonly string[],
  onMatch: () => void,
  resetMs = 3000,
) {
  const sequence = useRef<string[]>([]);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  return (id: string) => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    sequence.current.push(id);
    if (sequence.current.length > expected.length) {
      sequence.current = sequence.current.slice(-expected.length);
    }
    if (
      sequence.current.length === expected.length &&
      sequence.current.every((v, i) => v === expected[i])
    ) {
      sequence.current = [];
      onMatch();
      return;
    }
    resetTimer.current = setTimeout(() => {
      sequence.current = [];
    }, resetMs);
  };
}
