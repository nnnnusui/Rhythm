import { createSignal, Show } from "solid-js";

import { DragDetector, OnDrag } from "~/component/detect/DragDetector";
import { Pos } from "~/type/struct/2d/Pos";
import { Wve } from "~/type/struct/Wve";
import { Action } from "../Action";
import { Keyframe } from "../Keyframe";

import styles from "./KeyframeInteraction.module.css";

export const KeyframeInteraction = (p: {
  keyframe: Wve<Keyframe>;
  action: Wve<Action>;
  dragContainer: HTMLElement | undefined;
  getProgressPxFromTime: (time: number) => number;
  getTimeFromPxDelta: (pxDeltaPos: Pos) => number;
  getAdjustedTime: (raw: number) => number;
  selected: boolean;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const action = Wve.from(() => p.action);

  const [dragged, setDragged] = createSignal<Keyframe | undefined>(undefined);
  const onDrag: OnDrag<Keyframe> = (event) => {
    if (action().kind !== "move") return;
    const dragged = event.start;
    const id = dragged.id;
    const timeDelta = p.getTimeFromPxDelta(event.delta);
    const rawTime = dragged.time + timeDelta;
    const nextTime = event.event.ctrlKey
      ? rawTime
      : p.getAdjustedTime(rawTime);
    if (event.phase !== "confirmed") {
      setDragged(({
        ...dragged,
        time: nextTime,
      }));
      return;
    }
    action.when((it) => it.kind === "move")
      ?.partial("keyframeId")
      .set(id);
    keyframe.set("time", nextTime);
    setDragged(undefined);
  };

  return (
    <>
      <DragDetector class={styles.KeyframeInteraction}
        classList={{
          [styles.InAction]: dragged()?.id === keyframe().id,
          [styles.Selected]: p.selected,
        }}
        style={{
          "--progress": `${p.getProgressPxFromTime(keyframe().time)}px`,
        }}
        dragContainer={p.dragContainer}
        onDrag={onDrag}
        startState={() => keyframe()}
        onDblClick={() => keyframe.set(undefined!)}
      >
        <span>{JSON.stringify(keyframe().kind)}</span>
      </DragDetector>
      <Show when={dragged()}>{(dragged) => (
        <div class={styles.KeyframeInteraction}
          style={{
            "--progress": `${p.getProgressPxFromTime(dragged().time)}px`,
          }}
        >
          <span>{JSON.stringify(keyframe().kind)}</span>
        </div>
      )}</Show>
    </>
  );
};
