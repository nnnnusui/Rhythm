import { createElementSize } from "@solid-primitives/resize-observer";
import { throttle } from "@solid-primitives/scheduled";
import { createSignal } from "solid-js";

import { ScrollBar } from "~/component/render/ScrollBar";
import { ScrollBarTo } from "~/component/render/ScrollBarTo";
import { Timer } from "~/fn/signal/createTimer";
import { Id } from "~/type/struct/Id";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";
import { Action } from "./Action";
import { Beat } from "../Beat";
import { Beats } from "./Beats";
import { createPxFns } from "./createPxFns";
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
  duration: Wve<number>;
  beats: Beat[];
  currentBeat: Beat | undefined;
  auxiliaryBeat: NoteValue;
}) => {
  const duration = Wve.from(() => p.duration);
  const [container, setContainer] = createSignal<HTMLElement>();
  const size = createElementSize(container);
  const viewLength = () => (size.height ?? 0);
  const maxScrollPx = () => (viewLength() * p.maxTime) / duration();
  const syncToScroll = createSyncTimerToScroll({
    get timer() { return p.timer; },
    get maxTime() { return p.maxTime; },
    get maxScrollPx() { return maxScrollPx(); },
    applyScroll: (scrollPx) => container()?.scrollTo({ top: scrollPx }),
  });
  const gameProgessPercentage = () => syncToScroll.gameProgessPercentage;
  const viewRatio = () => duration() / p.maxTime;
  const setDurationByViewRatio = throttle((viewRatio: number) => duration.set(Math.max(0.1, p.maxTime * viewRatio)), 50);

  const [timelineOffsetRatio] = createSignal(0.5);
  const timelineOffsetPx = () => viewLength() * timelineOffsetRatio();

  const keyframeMap = Wve.from(() => p.keyframeMap);
  const tempoKeyframeMap = keyframeMap.filter((it) => it.kind === "tempo");
  const tempoNodes = () => Keyframe.getTempoNodes([
    Keyframe.defaultTempoKeyframe,
    ...Object.values(tempoKeyframeMap()),
  ]);

  const Px = createPxFns({
    get tempoNodes() { return tempoNodes(); },
    get maxTime() { return p.maxTime; },
    get maxScrollPx() { return maxScrollPx(); },
    get auxiliaryBeat() { return p.auxiliaryBeat; },
  });

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
          pxFns={Px}
        />
        <LaneContainer
          keyframeMap={p.keyframeMap}
          judgeAreaMap={p.judgeAreaMap}
          editAction={p.action}
          pxFns={Px}
        />
      </ScrollBarTo>
      <ScrollBar
        progress={gameProgessPercentage()}
        viewRatio={viewRatio()}
        reverse
        onScroll={syncToScroll.onScrollInScrollBar}
        onScale={setDurationByViewRatio}
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
