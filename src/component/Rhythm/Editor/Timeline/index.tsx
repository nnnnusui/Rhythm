import { createSignal, For } from "solid-js";

import { Arrays } from "~/fn/arrays";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "./Action";
import { Beats } from "./Beats";
import { Beat } from "../Beat";
import { Keyframe } from "./Keyframe";
import { KeyframeInteraction } from "./KeyframeInteraction";

import styles from "./Timeline.module.css";

export const Timeline = (p: {
  keyframeMap: Wve<Record<Keyframe["id"], Keyframe>>;
  action: Wve<Action>;
  time: number;
  maxTime: number;
  duration: number;
  viewLengthPx: number;
  timelineOffsetRatio: number;
  beats: Beat[];
  currentBeat: Beat | undefined;
}) => {
  const [container, setContainer] = createSignal<HTMLElement>();
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

  const getTimeFromPxDelta = (pxDeltaPos: Pos) =>
    (pxDeltaPos.y * -1 / maxScrollPx()) * p.maxTime;

  const keyframeMap = Wve.from(() => p.keyframeMap);
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

  return (
    <div class={styles.Timeline}
      ref={setContainer}
      style={{
        "--height": `${timelineHeightPx()}px`,
        "--offset": `${timelineOffsetPx()}px`,
      }}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        const action = editAction();
        if (action.kind !== "insert") return;
        const pos = Pos.fromEvent(event);
        const timeRaw = getTimeFromPx(pos);
        const time = getAdjustedTime(timeRaw);
        const id = Id.new();
        const keyframe = {
          ...action.keyframe,
          time,
          id,
        };
        keyframeMap.set(id, keyframe);
        editAction.set(Action.init());
      }}
    >
      <Beats
        beats={beats()}
        currentBeat={currentBeat()}
        getProgressPxFromTime={getProgressPxFromTime}
      />
      <div class={styles.Lanes} />
      <div class={styles.Keyframes}>
        <For each={Object.keys(keyframeMap())}>{(keyframeId) => (
          <KeyframeInteraction
            keyframe={keyframeMap.partial(keyframeId)}
            action={editAction}
            dragContainer={container()}
            getProgressPxFromTime={getProgressPxFromTime}
            getTimeFromPxDelta={getTimeFromPxDelta}
            getAdjustedTime={getAdjustedTime}
            selected={isSelected(keyframeId)}
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
