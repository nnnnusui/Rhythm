import { createElementSize } from "@solid-primitives/resize-observer";
import { children, createSignal, JSX } from "solid-js";

import { DragDetector, DragEventPhase, OnDrag } from "~/component/detect/DragDetector";
import { Resizable } from "../Resizable";

import styles from "./ScrollBar.module.css";

/** @public */
export const ScrollBar = (p: {
  children?: JSX.Element;
  progress: number;
  viewRatio: number;
  onScroll: (event: {
    phase: DragEventPhase;
    progress: number;
  }) => void;
  onScale: (viewRatio: number) => void;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
}) => {
  const child = children(() => p.children);
  const [container, setContainer] = createSignal<HTMLElement>();
  const containerSize = createElementSize(container);
  const [thumb, setThumb] = createSignal<HTMLElement>();
  const thumbSize = createElementSize(thumb);

  const maxScrollPx = () => (containerSize.height ?? 0) - (thumbSize.height ?? 0);
  const progressPx = () => maxScrollPx() * p.progress;
  const viewRatioPx = () => p.viewRatio * (containerSize.height ?? 0);
  const direction = () => p.direction ?? "vertical";
  const reverse = () => p.reverse ?? false;

  const onDrag: OnDrag<number> = (event) => {
    const delta = (
      direction() === "vertical"
        ? event.delta.y
        : event.delta.x
    ) * (reverse() ? -1 : 1);
    const nextProgressPx = event.start + delta;
    const nextProgress = nextProgressPx / maxScrollPx();
    p.onScroll({
      phase: event.phase,
      progress: nextProgress,
    });
  };

  return (
    <div class={styles.ScrollBar}
      classList={{
        [styles.Vertical]: direction() === "vertical",
        [styles.Horizontal]: direction() === "horizontal",
        [styles.Reverse]: reverse(),
      }}
      ref={setContainer}
    >
      <Resizable
        as={DragDetector}
        class={styles.Thumb}
        ref={setThumb}
        style={{
          "--progress": `${progressPx()}px`,
          "--viewRatio": `${viewRatioPx()}px`,
        }}
        dragContainer={container()}
        startState={progressPx}
        onDrag={onDrag}
        resizable={direction() === "vertical" ? ["top", "bottom"] : ["left", "right"]}
        onResize={(event) => p.onScale(direction() === "vertical" ? event.result.height / (containerSize.height ?? 1) : event.result.width / (containerSize.width ?? 1))}
      />
      {child()}
    </div>
  );
};
