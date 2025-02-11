import { Show, Switch, Match } from "solid-js";

import { DragDetector, OnDrag } from "~/component/detect/DragDetector";
import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "../Action";
import { TimeFns } from "../createTimeFns";
import { Keyframe } from "../Keyframe";
import { NoteKeyframe } from "./NoteKeyframe";

import styles from "./KeyframeInteraction.module.css";

export const KeyframeInteraction = (p: {
  keyframe: Wve<Keyframe>;
  action: Wve<Action>;
  timeFns: TimeFns;
  dragContainer: HTMLElement | undefined;
  getLaneOrder: (judgeAreaId: Id) => undefined | number;
  getJudgeAreaFromPx: (pxPos: Pos) => JudgeArea | undefined;
  selected: boolean;
  mayBe?: boolean;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const action = Wve.from(() => p.action);
  const Time = TimeFns.from(() => p.timeFns);
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
      const rawTime = start.time + Time.fromDeltaPxPos(event.delta);
      const nextTime = event.raw.ctrlKey
        ? rawTime
        : Time.toAdjusted(Time.validate(rawTime));
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
      ?.partial("keyframeIds")
      .set([id]);
    dragged.set("keyframe", undefined);
  };

  const renderKeyframe = () => (
    <Switch>
      <Match when={keyframe.when((it) => it.kind === "source")}>
        <div>source</div>
      </Match>
      <Match when={keyframe.when((it) => it.kind === "tempo")}>
        <div>tempo</div>
      </Match>
      <Match when={keyframe.when((it) => it.kind === "note")}>{(note) => (
        <NoteKeyframe keyframe={note()} />
      )}</Match>
    </Switch>
  );

  return (
    <>
      <DragDetector class={styles.KeyframeInteraction}
        classList={{
          [styles.InAction]: draggedKeyframe()?.id === keyframe().id,
          [styles.Selected]: p.selected,
          [styles.MayBe]: p.mayBe,
        }}
        style={{
          "--progress": `${Time.toProgressPx(Time.validate(keyframe().time))}px`,
          "--gridOrder": getGridOrderFromKeyframe(keyframe()),
          "--gridWidth": 1,
        }}
        dragContainer={p.dragContainer}
        onDrag={onDrag}
        startState={() => keyframe()}
        onDblClick={() => keyframe.set(undefined!)}
      >
        {renderKeyframe()}
      </DragDetector>
      <Show when={draggedKeyframe()}>{(keyframe) => (
        <div class={styles.KeyframeInteraction}
          style={{
            "--progress": `${Time.toProgressPx(Time.validate(keyframe().time))}px`,
            "--gridOrder": getGridOrderFromKeyframe(keyframe()),
            "--gridWidth": 1,
          }}
        >
          {renderKeyframe()}
        </div>
      )}</Show>
    </>
  );
};
