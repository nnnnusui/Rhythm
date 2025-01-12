import { debounce } from "@solid-primitives/scheduled";
import { ComponentProps, createEffect, JSX } from "solid-js";

import { ScrollBar } from "~/component/render/ScrollBar";
import { Timer } from "~/fn/signal/createTimer";

/**
 * Synchronize the timer time with the scrolling progress.
 */
export const createSyncTimerToScroll = (p: {
  timer: Timer;
  maxTime: number;
  maxScrollPx: number;
  applyScroll: (scrollPx: number) => void;
}) => {
  const gameProgessPercentage = () => p.timer.current / (p.maxTime * 1000);

  let scrolledBy: "effect" | "event" | undefined;
  let prevPlayed: boolean = false;
  const startEvent = () => {
    scrolledBy = "event";
    prevPlayed = p.timer.measuring;
    p.timer.pause();
  };
  const setTimeByScrollTop = (scrollTop: number) => {
    const nextProgress = scrollTop / p.maxScrollPx;
    const nextTime = p.maxTime * nextProgress;
    const nextTimeMs = nextTime * 1000;
    p.timer.set(nextTimeMs);
  };
  const endEvent = () => {
    scrolledBy = undefined;
    if (prevPlayed) p.timer.start();
  };
  const wheelEnd = debounce(endEvent, 250);

  createEffect(() => { // Apply current progress to scroll.
    const scrollPx = p.maxScrollPx * gameProgessPercentage();
    // Does not affect user-initiated scrolling.
    if (scrolledBy === "event") return;
    scrolledBy = "effect";
    p.applyScroll(scrollPx);
  });

  const onWheel: JSX.EventHandler<HTMLElement, WheelEvent> = (event) => {
    if (scrolledBy !== "event") return startEvent();
    setTimeByScrollTop(event.currentTarget.scrollTop);
    wheelEnd();
  };
  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    startEvent();
  };
  const onScroll: JSX.EventHandler<HTMLDivElement, Event> = (event) => {
    // Does not react to effect.
    if (scrolledBy !== "event") return;
    setTimeByScrollTop(event.currentTarget.scrollTop);
  };
  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent> = () => {
    endEvent();
  };

  const onScrollInScrollBar: ComponentProps<typeof ScrollBar>["onScroll"] = (
    { phase, progress },
  ) => {
    if (phase === "start") return startEvent();
    const nextProgress = Math.max(0, Math.min(progress, 1));
    const nextScrollTop = p.maxScrollPx * nextProgress;
    setTimeByScrollTop(nextScrollTop);
    p.applyScroll(nextScrollTop);
    if (phase === "confirmed") return endEvent();
  };

  return {
    props: {
      onWheel,
      onPointerDown,
      onScroll,
      onPointerUp,
    },
    get gameProgessPercentage() { return gameProgessPercentage(); },
    get inEvent() { return scrolledBy === "event"; },
    onScrollInScrollBar,
  };
};
