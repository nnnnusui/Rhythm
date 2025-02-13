import { Accessor, createEffect, onCleanup, onMount, untrack } from "solid-js";
import { isServer } from "solid-js/web";

import { Timer } from "~/fn/signal/createTimer";
import { Wve } from "~/type/struct/Wve";

/**
 * Creates a time-based cache that efficiently tracks and updates values based on a timer's progress.
 *
 * This hook is designed to handle sequential time-based data, where values need to be processed
 * exactly once as time progresses. It maintains an internal cache to minimize recalculations
 * and provides callbacks for value transitions.
 *
 * Features:
 * - Efficient caching of time-based values
 * - Handles visibility changes (tab switching)
 * - Processes each value exactly once
 * - Type-safe with generics
 *
 * @typeParam T - Type of the time-based value, must include a `time` property
 * @param p Configuration object
 * @param p.timer Timer instance that drives the progression
 * @param p.values Array of time-based values to track
 * @returns A accessor that returns the current value based on the timer's progress
 *
 * @public
 */
export const createTimeBasedCache = <T extends { time: number }>(p: {
  timer: Timer;
  values: T[];
}): Accessor<T | undefined> => {
  const values = () => p.values;

  let hided = true;
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") return;
    hided = true;
  };
  onMount(() => !isServer && document.addEventListener("visibilitychange", onVisibilityChange));
  onCleanup(() => !isServer && document.removeEventListener("visibilitychange", onVisibilityChange));

  const cache = Wve.create<{
    measured: boolean;
    length: number;
    index: number;
    nextMs?: number;
    nextValue?: T;
  }>({
    measured: false,
    length: 0,
    index: -1,
  });

  const cacheNext = (index: number) => {
    const nextValue = values()[index + 1];
    cache.set({
      measured: true,
      length: values().length,
      index,
      nextMs: nextValue?.time == null
        ? undefined
        : Math.floor(nextValue.time * 1000),
      nextValue: nextValue,
    });
  };

  createEffect(() => {
    if (!p.timer.measuring) return cache.set("measured", false);
    const prev = untrack(cache);

    if (hided || !prev.measured || prev.length !== values().length) {
      hided = false;
      const index = values().findIndex((it) => p.timer.current < Math.floor(it.time * 1000));
      cacheNext(index - 1);
      return;
    }

    if (prev.length !== values().length) return;
    if (prev.nextMs == null) return;
    if (prev.nextValue == null) return;
    if (p.timer.current < prev.nextMs) return;

    cacheNext(prev.index + 1);
  });

  const currentValue = () => values()[cache().index];
  return currentValue;
};
