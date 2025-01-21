import { Show } from "solid-js";

import { DragDetector, OnDrag } from "~/component/detect/DragDetector";
import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "../Action";
import { Keyframe } from "../Keyframe";

import styles from "./KeyframeInteraction.module.css";

export const KeyframeInteraction = (p: {
  keyframe: Wve<Keyframe>;
  action: Wve<Action>;
  getLaneOrder: (judgeAreaId: Id) => undefined | number;
  dragContainer: HTMLElement | undefined;
  getProgressPxFromTime: (time: number) => number;
  getTimeDeltaFromPx: (pxDeltaPos: Pos) => number;
  getAdjustedTime: (raw: number) => number;
  getJudgeAreaFromPx: (pxPos: Pos) => JudgeArea | undefined;
  selected: boolean;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const action = Wve.from(() => p.action);
  const getGridOrderFromKeyframe = (keyframe?: Keyframe) => {
    if (!keyframe) return;
    if (keyframe.kind !== "note") return;
    const laneOrder = p.getLaneOrder(keyframe.judgeAreaId);
    if (laneOrder == null) return;
    return laneOrder + 1;
  };

  const dragged = Wve.create<{ keyframe?: Keyframe }>({});
  const draggedKeyframe = dragged.partial("keyframe");
  const onDrag: OnDrag<Keyframe> = (event) => {
    if (action().kind !== "move") return;
    const start = event.start;
    const id = start.id;
    if (event.phase === "preview") {
      const rawTime = start.time + p.getTimeDeltaFromPx(event.delta);
      const nextTime = event.raw.ctrlKey
        ? rawTime
        : p.getAdjustedTime(rawTime);
      draggedKeyframe.set(({
        ...start,
        time: nextTime,
      }));
    }
    const draggedNote = draggedKeyframe.when((it) => it?.kind === "note");
    if (draggedNote) {
      const pos = Pos.fromEvent(event.raw, { relativeTo: p.dragContainer });
      const judgeArea = p.getJudgeAreaFromPx(pos);
      if (judgeArea) draggedNote.set("judgeAreaId", judgeArea.id);
    }

    if (event.phase !== "confirmed") return;
    const resultKeyframe = draggedKeyframe();
    if (resultKeyframe) keyframe.set(resultKeyframe);
    action.when((it) => it.kind === "move")
      ?.partial("keyframeId")
      .set(id);
    dragged.set("keyframe", undefined);
  };

  return (
    <>
      <DragDetector class={styles.KeyframeInteraction}
        classList={{
          [styles.InAction]: draggedKeyframe()?.id === keyframe().id,
          [styles.Selected]: p.selected,
        }}
        style={{
          "--progress": `${p.getProgressPxFromTime(keyframe().time)}px`,
          "--gridOrder": getGridOrderFromKeyframe(keyframe()),
        }}
        dragContainer={p.dragContainer}
        onDrag={onDrag}
        startState={() => keyframe()}
        onDblClick={() => keyframe.set(undefined!)}
      >
        <span>{JSON.stringify(keyframe().kind)}</span>
      </DragDetector>
      <Show when={draggedKeyframe()}>{(keyframe) => (
        <div class={styles.KeyframeInteraction}
          style={{
            "--progress": `${p.getProgressPxFromTime(keyframe().time)}px`,
            "--gridOrder": getGridOrderFromKeyframe(keyframe()),
          }}
        >
          <span>{JSON.stringify(keyframe().kind)}</span>
        </div>
      )}</Show>
    </>
  );
};
