import { children, createMemo, createSignal, For, JSX } from "solid-js";

import { Fps } from "~/component/indicate/Fps";
import { TimerInteraction } from "~/component/interaction/TimerInteraction";
import { Objects } from "~/fn/objects";
import { Timer } from "~/fn/signal/createTimer";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";
import { createBeatBeepPlayer } from "./createBeatBeepPlayer";
import { EditAuxiliaryBeat } from "./EditAuxiliaryBeat";
import { EditScoreInfo } from "./EditScoreInfo";
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
  const maxTime = () => p.maxTime;
  const child = children(() => p.children);
  const timer = Timer.from(() => p.timer);
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

  const [gameKey, setGameKey] = createSignal([{}]);
  const resetGame = () => setGameKey([{}]);

  return (
    <div class={styles.Editor}>
      <div class={styles.View}>
        {child()}
        <div class={styles.ViewBackground}
          classList={{ [styles.Hidden]: viewMode() !== "play" }}
        />
        <For each={gameKey()}>{() => (
          <Game
            score={score()}
            time={timer.current / 1000}
            duration={duration()}
            ghost={viewMode() === "sourceControl"}
          />
        )}</For>
        <div class={styles.ViewBackground}
          classList={{ [styles.Hidden]: viewMode() !== "edit" }}
        />
        <Timeline
          keyframeMap={keyframeMap}
          judgeAreaMap={judgeAreaMap}
          action={timelineAction}
          timer={timer}
          ghost={viewMode() !== "edit"}
          maxTime={maxTime()}
          duration={duration()}
          beats={beats()}
          currentBeat={currentBeat()}
        />
        {/* <InteractOverlay /> */}
      </div>
      <div class={styles.Detail}>
        details.
      </div>
      <div class={styles.Interactions}>
        <Fps />
        <EditScoreInfo score={score} />
        <TimerInteraction timer={timer} />
        <EditViewState
          mode={viewMode}
          duration={duration}
          resetGame={resetGame}
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
