import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For, JSX } from "solid-js";

import { Arrays } from "~/fn/arrays";
import { Objects } from "~/fn/objects";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "./Action";
import { Beats } from "./Beats";
import { Beat } from "../Beat";
import { Keyframe } from "./Keyframe";
import { KeyframeInteraction } from "./KeyframeInteraction";
import { JudgeArea } from "../../type/JudgeArea";

import styles from "./Timeline.module.css";

export const Timeline = (p: {
  keyframeMap: Wve<Record<Keyframe["id"], Keyframe>>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
  action: Wve<Action>;
  time: number;
  maxTime: number;
  duration: number;
  viewLengthPx: number;
  timelineOffsetRatio: number;
  beats: Beat[];
  currentBeat: Beat | undefined;
}) => {
  const maxScrollPx = () => (p.viewLengthPx * p.maxTime) / p.duration;
  const getProgressPxFromTime = (time: number) => time / p.maxTime * maxScrollPx();
  const timelineOffsetPx = () => p.viewLengthPx * p.timelineOffsetRatio;
  const timelineHeightPx = () => maxScrollPx() + timelineOffsetPx();

  const getTimeFromPx = (timelinePxPos: Pos) => {
    const placeableLength = timelinePxPos.y - timelineOffsetPx();
    const pxFromStart = maxScrollPx() - placeableLength;
    const progress = pxFromStart / maxScrollPx();
    return progress * p.maxTime;
  };

  const [laneContainer, setLaneContainer] = createSignal<HTMLElement>();
  const laneContainerSize = createElementSize(laneContainer);
  const keyframeMap = Wve.from(() => p.keyframeMap);
  const judgeAreaMap = Wve.from(() => p.judgeAreaMap);
  const judgeAreaOrderMap = () => Objects.modify(judgeAreaMap(), (entries) => entries.map(([key], index) => ([key, index])));
  const laneCount = () => Objects.keys(judgeAreaOrderMap()).length;
  const getJudgeAreaFromPx = (pos: Pos) => {
    if (!laneContainerSize.width) return;
    if (!laneCount()) return;
    const getLaneOffsetPx = (laneIndex: number) =>
      laneIndex * laneContainerSize.width / laneCount();
    const laneIndex = [...Array(laneCount())].map((_, index) => index)
      .findLast((index) => getLaneOffsetPx(index) <= pos.x);
    if (laneIndex == null) return;
    const judgeArea = Objects.values(judgeAreaMap())[laneIndex];
    return judgeArea;
  };
  const beats = () => p.beats;
  const currentBeat = () => p.currentBeat;
  const getAdjustedTime = (raw: number) => {
    const getByBeat = (rawNextTime: number) => {
      const nextBeatIndex = beats().findIndex((it) => rawNextTime < it.time);
      const nextBeat = beats()[nextBeatIndex];
      const prevBeat = beats()[nextBeatIndex - 1];
      if (!prevBeat) return rawNextTime;
      if (!nextBeat) return rawNextTime;
      return Arrays.closest([nextBeat.time, prevBeat.time])(rawNextTime);
    };
    return Math.max(0, Math.min(getByBeat(raw), p.maxTime));
  };

  const editAction = Wve.from(() => p.action);
  const isSelected = (keyframeId: Id) =>
    editAction.when((it) => it.kind === "move")?.().keyframeId === keyframeId;

  const addNote: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    const action = editAction();
    if (action.kind !== "insert") return;
    const pos = Pos.fromEvent(event);
    const timeRaw = getTimeFromPx(pos);
    const time = getAdjustedTime(timeRaw);
    const id = Id.new();
    if (action.keyframe.kind === "note") {
      const judgeArea = getJudgeAreaFromPx(pos);
      if (!judgeArea) return;
      const keyframe = {
        ...action.keyframe,
        judgeAreaId: judgeArea.id,
        time,
        id,
      };
      keyframeMap.set(id, keyframe);
    } else {
      const keyframe = {
        ...action.keyframe,
        time,
        id,
      };
      keyframeMap.set(id, keyframe);
    }
    editAction.set(event.pointerType === "mouse" ? { kind: "move" } : Action.init());
  };

  return (
    <div class={styles.Timeline}
      style={{
        "--height": `${timelineHeightPx()}px`,
        "--offset": `${timelineOffsetPx()}px`,
        "--laneCount": `${laneCount()}`,
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Beats
        beats={beats()}
        currentBeat={currentBeat()}
        getProgressPxFromTime={getProgressPxFromTime}
      />
      <div class={styles.Lanes}
        ref={setLaneContainer}
        onPointerDown={addNote}
      >
        <For each={Objects.entries(judgeAreaMap())}>{() => (
          <div />
        )}</For>
      </div>
      <div class={styles.Keyframes}>
        <For each={Objects.entries(keyframeMap())}>{([keyframeId]) => (
          <KeyframeInteraction
            keyframe={keyframeMap.partial(keyframeId)}
            action={editAction}
            dragContainer={laneContainer()}
            getProgressPxFromTime={getProgressPxFromTime}
            getTimeFromPx={getTimeFromPx}
            getAdjustedTime={getAdjustedTime}
            getJudgeAreaFromPx={getJudgeAreaFromPx}
            selected={isSelected(keyframeId)}
            getLaneOrder={(judgeAreaId?: Id) => judgeAreaOrderMap()[judgeAreaId ?? -1]}
          />
        )}</For>
      </div>
    </div>
  );
};

type ActionMode = "none" | "insert" | "move";
const ActionMode = (() => {
  return {
    from: (value: ActionMode): ActionMode => value,
  };
})();

/** @public */
export {
  Keyframe as TimelineKeyframe,
  Action as TimelineAction,
};
