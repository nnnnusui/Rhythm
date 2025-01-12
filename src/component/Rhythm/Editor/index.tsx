import { createElementSize } from "@solid-primitives/resize-observer";
import { children, createMemo, createSignal, JSX } from "solid-js";

import { TimerInteraction } from "~/component/interaction/TimerInteraction";
import { Objects } from "~/fn/objects";
import { Timer } from "~/fn/signal/createTimer";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";
import { createBeatBeepPlayer } from "./createBeatBeepPlayer";
import { EditAuxiliaryBeat } from "./EditAuxiliaryBeat";
import { EditScoreInfo } from "./EditScoreInfo";
import { PreviewOverlay } from "./PreviewOverlay";
import { Game } from "../Game";
import { Beat } from "./Beat";
import { EditJudgeAreaMap } from "./EditJudgeAreaMap";
import { EditKeyframe } from "./EditKeyframe";
import { EditViewState } from "./EditViewState";
import { Timeline, TimelineAction, TimelineKeyframe } from "./Timeline";
import { Score } from "../type/Score";

import styles from "./Editor.module.css";

export const Editor = (p: {
  children: JSX.Element;
  timer: Timer;
  maxTime: number;
  score: Wve<Score>;
}) => {
  const child = children(() => p.children);
  const timer = Timer.from(() => p.timer);

  const maxTime = () => p.maxTime;
  const [view, setView] = createSignal<HTMLElement>();
  const viewSize = createElementSize(view);
  const viewLength = () => (viewSize.height ?? 0);
  const [timelineOffsetRatio] = createSignal(0.5);

  const score = Wve.from(() => p.score);
  const sourceMap = score.partial("sourceMap");
  const timeline = score.partial("timeline");
  const keyframeMap = timeline.partial("keyframeMap");
  const judgeAreaMap = score.partial("judgeAreaMap");

  const viewModes = ["edit", "play", "sourceControl"] as const;
  type ViewMode = typeof viewModes[number];
  const ViewMode = { init: (): ViewMode => viewModes[0] };
  const local = Wve.create({
    viewMode: ViewMode.init(),
    duration: 3,
    auxiliaryBeat: NoteValue.from(4),
    playBeatBeep: true,
    timelineAction: TimelineAction.init(),
  });
  const viewMode = local.partial("viewMode");
  const duration = local.partial("duration");
  const auxiliaryBeat = local.partial("auxiliaryBeat");
  const playBeatBeep = local.partial("playBeatBeep");
  const timelineAction = local.partial("timelineAction");

  const tempoKeyframeMap = keyframeMap.filter((it) => it.kind === "tempo");
  const tempoNodes = () => TimelineKeyframe.getTempoNodes(Objects.values(tempoKeyframeMap()));
  const beats = createMemo(() => Beat.fromTempos(tempoNodes(), maxTime(), auxiliaryBeat()));
  const { currentBeat } = createBeatBeepPlayer({
    timer,
    get beats() { return beats(); },
    get play() { return playBeatBeep(); },
  });

  return (
    <div class={styles.Editor}>
      <div class={styles.View}
        ref={setView}
      >
        {child()}
        <div class={styles.ViewBackground}
          classList={{ [styles.Hidden]: viewMode() !== "play" }}
        />
        <Game
          timeline={timeline()}
          time={timer.current / 1000}
          duration={duration()}
          ghost={viewMode() === "sourceControl"}
        />
        <div class={styles.ViewBackground}
          classList={{ [styles.Hidden]: viewMode() !== "edit" }}
        />
        <PreviewOverlay
          timer={timer}
          scoreLength={maxTime()}
          gameDuration={duration()}
          ghost={viewMode() !== "edit"}
        >
          <Timeline
            keyframeMap={keyframeMap}
            judgeAreaMap={judgeAreaMap}
            action={timelineAction}
            time={timer.current}
            maxTime={maxTime()}
            duration={duration()}
            viewLengthPx={viewLength()}
            timelineOffsetRatio={timelineOffsetRatio()}
            beats={beats()}
            currentBeat={currentBeat()}
          />
        </PreviewOverlay>
        {/* <InteractOverlay /> */}
      </div>
      <div class={styles.Detail}>
        details.
      </div>
      <div class={styles.Interactions}>
        <EditScoreInfo score={score} />
        <TimerInteraction timer={timer} />
        <EditViewState
          mode={viewMode}
          duration={duration}
        />
        <EditAuxiliaryBeat
          auxiliaryBeat={auxiliaryBeat}
          playBeatBeep={playBeatBeep}
        />
        <EditJudgeAreaMap
          judgeAreaMap={judgeAreaMap}
        />
        <EditKeyframe
          action={timelineAction}
          keyframeMap={keyframeMap}
          sourceMap={sourceMap}
        />
        {/* <InteractEditor /> */}
      </div>
    </div>
  );
};
