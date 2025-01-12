import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal } from "solid-js";

import { ScrollBar } from "~/component/render/ScrollBar";
import { ScrollBarTo } from "~/component/render/ScrollBarTo";
import { Timer } from "~/fn/signal/createTimer";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "./Action";
import { Beats } from "./Beats";
import { Beat } from "../Beat";
import { createSyncTimerToScroll } from "./createSyncTimerToScroll";
import { Keyframe } from "./Keyframe";
import { LaneContainer } from "./LaneContainer";
import { JudgeArea } from "../../type/JudgeArea";

import styles from "./Timeline.module.css";

export const Timeline = (p: {
  keyframeMap: Wve<Record<Keyframe["id"], Keyframe>>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
  action: Wve<Action>;
  timer: Timer;
  ghost: boolean;
  maxTime: number;
  duration: number;
  beats: Beat[];
  currentBeat: Beat | undefined;
}) => {
  const [container, setContainer] = createSignal<HTMLElement>();
  const size = createElementSize(container);
  const viewLength = () => (size.height ?? 0);
  const maxScrollPx = () => (viewLength() * p.maxTime) / p.duration;
  const syncToScroll = createSyncTimerToScroll({
    get timer() { return p.timer; },
    get maxTime() { return p.maxTime; },
    get maxScrollPx() { return maxScrollPx(); },
    applyScroll: (scrollPx) => container()?.scrollTo({ top: scrollPx }),
  });
  const gameProgessPercentage = () => syncToScroll.gameProgessPercentage;
  const viewRatio = () => p.duration / p.maxTime;

  const [timelineOffsetRatio] = createSignal(0.5);
  const timelineOffsetPx = () => viewLength() * timelineOffsetRatio();
  const getProgressPxFromTime = (time: number) => time / p.maxTime * maxScrollPx();

  return (
    <div class={styles.Timeline}
      classList={{ [styles.Ghost]: p.ghost }}
    >
      <ScrollBarTo ref={setContainer}
        flipVertical
        hideDefaultScrollBar
        {...syncToScroll.props}
        childProps={{
          class: styles.Inner,
          style: {
            "--length": `${maxScrollPx()}px`,
            "--offset": `${timelineOffsetPx()}px`,
            "--remain": `${viewLength() - timelineOffsetPx()}px`,
          },
        }}
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
