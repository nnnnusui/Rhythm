import createRAF from "@solid-primitives/raf";
import { createSignal, untrack } from "solid-js";

/** @public */
export type Timer = ReturnType<typeof createTimer>;

/** @public */
export const Timer = (() => {
  return {
    from: <T extends Timer>(accessor: () => T): T => accessor(),
  };
})();

/** @public */
export const createTimer = () => {
  const [offset, setOffset] = createSignal(0);
  const [current, setCurrent] = createSignal(0);
  const [measuring, setMeasuring] = createSignal(false);

  let rafPlaybackOffset = 0;
  const [, _start] = createRAF((timestamp) => {
    if (!measuring()) {
      rafPlaybackOffset = timestamp;
      return;
    }
    const next = untrack(offset) + timestamp - rafPlaybackOffset;
    setCurrent(Math.floor(next));
  });
  _start();

  const start = () => {
    setMeasuring(true);
  };
  const pause = () => {
    setMeasuring(false);
    setOffset(untrack(current));
  };
  const stop = () => {
    setMeasuring(false);
    setOffset(0);
    setCurrent(0);
  };

  const set = (ms: number) => {
    setMeasuring(false);
    setOffset(ms);
    setCurrent(ms);
  };

  return {
    get current() { return current(); },
    get measuring() { return measuring(); },
    get offset() { return offset(); },
    start,
    pause,
    stop,
    set,
  };
};
