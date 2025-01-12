import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "./Action";
import { Beats } from "./Beats";
import { Beat } from "../Beat";
import { Keyframe } from "./Keyframe";
import { LaneContainer } from "./LaneContainer";
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
  const timelineHeightPx = () => maxScrollPx();

  return (
    <div class={styles.Timeline}
      style={{
        "--height": `${timelineHeightPx()}px`,
        "--offset": `${timelineOffsetPx()}px`,
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Beats
        beats={p.beats}
        currentBeat={p.currentBeat}
        getProgressPxFromTime={getProgressPxFromTime}
      />
      <LaneContainer
        keyframeMap={p.keyframeMap}
        judgeAreaMap={p.judgeAreaMap}
        editAction={p.action}
        beats={p.beats}
        maxScrollPx={maxScrollPx()}
        maxTime={p.maxTime}
        getProgressPxFromTime={getProgressPxFromTime}
      />
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
