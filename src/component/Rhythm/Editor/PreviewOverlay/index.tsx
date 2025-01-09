import { createElementSize } from "@solid-primitives/resize-observer";
import { children, createSignal, JSX } from "solid-js";

import { ScrollBar } from "~/component/render/ScrollBar";
import { ScrollBarTo } from "~/component/render/ScrollBarTo";
import { Timer } from "~/fn/signal/createTimer";
import { createSyncTimerToScroll } from "./createSyncTimerToScroll";

import styles from "./PreviewOverlay.module.css";

export const PreviewOverlay = (p: {
  children: JSX.Element;
  timer: Timer;
  scoreLength: number;
  gameDuration: number;
  ghost: boolean;
}) => {
  const child = children(() => p.children);
  const [container, setContainer] = createSignal<HTMLElement>();
  const size = createElementSize(container);
  const viewLength = () => (size.height ?? 0);
  const maxScrollPx = () => (viewLength() * p.scoreLength) / p.gameDuration;
  const fullLengthPx = () => viewLength() + maxScrollPx();

  const syncToScroll = createSyncTimerToScroll({
    get timer() { return p.timer; },
    get maxTime() { return p.scoreLength; },
    get maxScrollPx() { return maxScrollPx(); },
    applyScroll: (scrollPx) => container()?.scrollTo({ top: scrollPx }),
  });
  const gameProgessPercentage = () => syncToScroll.gameProgessPercentage;

  // const [viewDuration, setViewDuration] = createSignal(untrack(() => p.gameDuration));
  const viewRatio = () => p.gameDuration / p.scoreLength;

  return (
    <div class={styles.PreviewOverlay}
      classList={{ [styles.Ghost]: p.ghost }}
    >
      <ScrollBarTo ref={setContainer}
        childProps={{
          class: styles.Inner,
          style: { "--length": `${fullLengthPx()}px` },
        }}
        flipVertical
        hideDefaultScrollBar
        {...syncToScroll.props}
      >
        {child()}
      </ScrollBarTo>
      <ScrollBar
        progress={gameProgessPercentage()}
        viewRatio={viewRatio()}
        reverse
        onScroll={syncToScroll.onScrollInScrollBar}
      />
    </div>
  );
};
