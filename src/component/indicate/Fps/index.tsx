import createRAF from "@solid-primitives/raf";
import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For } from "solid-js";

import { range } from "~/fn/range";
import { Wve } from "~/type/struct/Wve";

import styles from "./Fps.module.css";

/** @public */
export const Fps = () => {
  const initFps = (): {
    histories: number[];
    current: number;
    max: number | undefined;
    min: number | undefined;
  } => ({
    histories: [] as number[],
    current: 0,
    max: undefined,
    min: undefined,
  });
  const fps = Wve.create(initFps());

  const [historiesView, setHistoriesView] = createSignal<HTMLElement>();
  const historiesViewSize = createElementSize(historiesView);
  let prevTimestampRef: number | undefined = undefined;
  const [, _start] = createRAF((now) => {
    const prev = prevTimestampRef ?? now;
    const elapsed = now - prev;
    if (elapsed !== 0) {
      const delta = elapsed / 1000;
      const next = 1 / delta;
      const historiesLength = historiesViewSize.width ?? 75;
      fps.set((prev) => ({
        histories: [
          ...range(historiesLength).map(() => 0),
          ...prev.histories,
          next,
        ].slice(-historiesLength),
        current: next,
        max: Math.max(next, prev.max ?? Number.MIN_VALUE),
        min: Math.min(next, prev.min ?? Number.MAX_VALUE),
      }));
    }
    prevTimestampRef = now;
  });
  _start();

  const init = () => fps.set(initFps());
  const min = () => fps().min ?? 0;
  const max = () => fps().max ?? 1;
  const view = () => ({
    current: Math.round(fps().current),
    min: Math.floor(min()),
    max: Math.floor(max()),
  });
  const getRatio = (fps: number) => (fps - min()) / (max() - min());

  return (
    <div class={styles.Fps}>
      <div class={styles.Header}>
        <div class={styles.Text}>
          fps: {view().current} ({view().min} - {view().max})
        </div>
        <button class={styles.Reset}
          type="button"
          onClick={init}
        >↻</button>
      </div>
      <div class={styles.Histories}
        ref={setHistoriesView}
      >
        <For each={fps().histories}>{(history) => (
          <div class={styles.History}
            style={{ height: `${Math.floor(getRatio(history) * 100)}%` }}
          />
        )}</For>
      </div>
    </div>
  );
};
