import { children, createMemo, JSX } from "solid-js";

import { Fps } from "~/component/indicate/Fps";
import { TimerInteraction } from "~/component/interaction/TimerInteraction";
import { Resizable } from "~/component/render/Resizable";
import { action } from "~/fn/signal/createAction";
import { Timer } from "~/fn/signal/createTimer";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";
import { Beat } from "./Beat";
import { createBeatBeepPlayer } from "./createBeatBeepPlayer";
import { EditAuxiliaryBeat } from "./EditAuxiliaryBeat";
import { EditGameConfig } from "./EditGameConfig";
import { EditJudgeAreaMap } from "./EditJudgeAreaMap";
import { EditKeyframe } from "./EditKeyframe";
import { EditScoreInfo } from "./EditScoreInfo";
import { EditViewState } from "./EditViewState";
import { Timeline, TimelineAction, TimelineKeyframe } from "./Timeline";
import { GameConfig } from "../type/GameConfig";
import { Score } from "../type/Score";

import styles from "./Editor.module.css";

/** @public */
export const Editor = (p: {
  children: JSX.Element;
  timer: Timer;
  score: Wve<Score>;
  viewMode: Wve<ViewMode>;
  gameConfig: Wve<GameConfig>;
  resetGame: () => void;
}) => {
  const child = children(() => p.children);
  const timer = Timer.from(() => p.timer);
  const score = Wve.from(() => p.score);

  const sourceMap = score.partial("sourceMap");
  const timeline = score.partial("timeline");
  const keyframeMap = timeline.partial("keyframeMap");
  const judgeAreaMap = score.partial("judgeAreaMap");
  const maxTime = () => score().length;

  const local = Wve.create({
    duration: 3,
    auxiliaryBeat: NoteValue.from(4),
    playBeatBeep: true,
    timelineAction: TimelineAction.init(),
  });
  const viewMode = Wve.from(() => p.viewMode);
  const duration = local.partial("duration");
  const auxiliaryBeat = local.partial("auxiliaryBeat");
  const playBeatBeep = local.partial("playBeatBeep");
  const timelineAction = local.partial("timelineAction");

  const tempoKeyframeMap = keyframeMap.filter((it) => it.kind === "tempo");
  const tempoNodes = () => TimelineKeyframe.getTempoNodes([
    TimelineKeyframe.defaultTempoKeyframe,
    ...Object.values(tempoKeyframeMap()),
  ]);
  const beats = createMemo(() => Beat.fromTempos(tempoNodes(), maxTime(), auxiliaryBeat()));
  const { currentBeat } = createBeatBeepPlayer({
    timer,
    get beats() { return beats(); },
    get play() { return playBeatBeep(); },
  });

  const resetGame = () => p.resetGame();
  const playPause = () => {
    if (timer.measuring) {
      timer.pause();
      resetGame();
    } else {
      timer.start();
    }
  };
  const reset = () => {
    timer.stop();
    resetGame();
  };

  action;
  return (
    <div class={styles.Editor}
      use:action={{
        keyPrefix: "rhythm.editor",
        actionMap: {
          ["play/pause"]: {
            keyEvent: " ",
            action: playPause,
          },
          ["reset"]: {
            keyEvent: "Escape",
            action: reset,
          },
        },
      }}
    >
      <div class={styles.View}>
        {child()}
        <Timeline
          keyframeMap={keyframeMap}
          judgeAreaMap={judgeAreaMap}
          action={timelineAction}
          timer={timer}
          ghost={viewMode() !== "edit"}
          maxTime={maxTime()}
          duration={duration}
          beats={beats()}
          currentBeat={currentBeat()}
          auxiliaryBeat={auxiliaryBeat()}
        />
      </div>
      <div class={styles.Detail}>
        details.
      </div>
      <Resizable class={styles.Interactions}
        resizable={["left"]}
      >
        <Fps />
        <EditScoreInfo score={score} />
        <TimerInteraction timer={timer} />
        <EditGameConfig value={p.gameConfig} />
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
          judgeAreaMap={judgeAreaMap}
        />
        {/* <InteractEditor /> */}
        {/* <HistoryManager history={score.history}>{(it) => (
          <p>{it.delta[0]?.path ?? it.id}</p>
        )}</HistoryManager> */}
      </Resizable>
    </div>
  );
};

const viewModes = ["edit", "play", "sourceControl"] as const;
type ViewMode = typeof viewModes[number];
const ViewMode = { init: (): ViewMode => viewModes[0] };

/** @public */
export { ViewMode };
