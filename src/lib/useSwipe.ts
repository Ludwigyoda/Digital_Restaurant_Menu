import { useRef } from "react";

const SWIPE_THRESHOLD_PX = 60;
const SWIPE_VELOCITY_PX_PER_S = 400;

export function useSwipe(onNext: () => void, onPrev: () => void) {
  const dragState = useRef<{ startX: number; startTime: number; deltaX: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragState.current = { startX: e.clientX, startTime: Date.now(), deltaX: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    dragState.current.deltaX = e.clientX - dragState.current.startX;
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translateX(${dragState.current.deltaX * 0.4}px)`;
    }
  };

  const onPointerUp = () => {
    if (!dragState.current) return;
    const { deltaX, startTime } = dragState.current;
    const elapsed = Math.max((Date.now() - startTime) / 1000, 0.01);
    const velocity = Math.abs(deltaX) / elapsed;
    dragState.current = null;
    if (canvasRef.current) canvasRef.current.style.transform = "";
    if (deltaX < -SWIPE_THRESHOLD_PX || (deltaX < 0 && velocity > SWIPE_VELOCITY_PX_PER_S)) onNext();
    else if (deltaX > SWIPE_THRESHOLD_PX || (deltaX > 0 && velocity > SWIPE_VELOCITY_PX_PER_S)) onPrev();
  };

  return {
    canvasRef,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
