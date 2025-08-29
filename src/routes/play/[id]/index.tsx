import { useParams } from "@solidjs/router";
import { createSignal, For, Show, untrack } from "solid-js";

import { ResourcePlayer } from "~/component/embed/ResourcePlayer";
import { EditGameConfig } from "~/component/Rhythm/Editor/EditGameConfig";
import { TimelineKeyframe } from "~/component/Rhythm/Editor/Timeline";
import { Game, GameResultEvent } from "~/component/Rhythm/Game";
import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
import { ResultScreen } from "~/component/Rhythm/screen/ResultScreen";
import { VolumeConfig } from "~/component/Rhythm/type/GameConfig";
import { Score } from "~/component/Rhythm/type/Score";
import { Objects } from "~/fn/objects";
import { createTimer } from "~/fn/signal/createTimer";
import { makePersisted } from "~/fn/signal/makePersisted";
import { Wve } from "~/type/struct/Wve";

import styles from "./index.module.css";

export default function PlayPage() {
  const params = useParams();
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.init }));
  const scoreMap = status.partial("editingScoreMap");
  const score = Wve.mayBe(() => {
    const id = params.id;
    if (!id) return;
    return untrack(() => scoreMap).partial(id);
  });
  const gameConfig = status.partial("gameConfig");

  return (
    <Show when={score.when((it) => !!it)}>{(score) => (
      <PlayScreen
        score={score()}
        gameConfig={gameConfig}
      />
    )}</Show>
  );
}

const PlayScreen = (p: {
  score: Wve<Score>;
  gameConfig: Wve<PerUserStatus["gameConfig"]>;
}) => {
  const timer = createTimer();
  const score = Wve.from(() => p.score);
  const keyframeMap = score.partial("timeline", "keyframeMap");
  const playerTimeline = () => TimelineKeyframe
    .getNodes(Objects.values(keyframeMap()))
    .sourceNodes;

  const gameConfig = Wve.from(() => p.gameConfig);
  const [gameKey, setGameKey] = createSignal([{}]);
  const resetGame = () => setGameKey([{}]);

  type Mode = "source" | "ready" | "play" | "pause" | "result";
  const [mode, setMode] = createSignal<Mode>("ready");
  const viewSource = () => {
    setMode("source");
  };
  const resume = () => {
    setMode("play");
    timer.start();
  };
  const pause = () => {
    setMode("pause");
    timer.pause();
  };
  const reset = () => {
    timer.stop();
    resetGame();
    setMode("ready");
  };

  const [gameResult, setGameResult] = createSignal<GameResultEvent>();
  const result = (event: GameResultEvent) => {
    setMode("result");
    setGameResult(event);
  };

  return (
    <div class={styles.PlayScreen}>
      <ResourcePlayer
        sourceMap={score().sourceMap}
        timeline={playerTimeline()}
        playing={timer.measuring}
        offset={timer.offset}
        time={timer.current}
        volume={VolumeConfig.getDecimal(gameConfig().volume, "music")}
        preload
      />
      <Show when={mode() !== "source"}>
        <div class={styles.ViewBackground} />
        <div class={styles.GameContainer}>
          <For each={gameKey()}>{() => (
            <Game
              readOnly={mode() !== "play"}
              score={score()}
              time={timer.current / 1000}
              duration={gameConfig().duration}
              judgeDelay={gameConfig().judgeDelay}
              volume={VolumeConfig.getDecimal(gameConfig().volume, "effect")}
              onGameOver={(e) => result(e)}
            />
          )}</For>
        </div>
      </Show>
      <Show when={mode() === "ready"}>
        <div class={styles.ReadyScreen}
          tabIndex={0}
          onClick={() => resume()}
          onKeyDown={() => resume()}
        >
          <h2>Get Ready!</h2>
          <p>"Tap the screen to start."</p>
        </div>
      </Show>
      <Show when={mode() === "result"}>
        <Show when={gameResult()}>{(gameResult) => (
          <ResultScreen gameResult={gameResult()}>
            <button
              onClick={() => reset()}
            >Reset</button>
            <a href="..">exit</a>
          </ResultScreen>
        )}</Show>
      </Show>
      <Show when={mode() === "pause"}>
        <div class={styles.PauseScreen}>
          <div>
            <button
              onClick={() => resume()}
            >Resume</button>
            <button
              onClick={() => reset()}
            >Reset</button>
            <div class={styles.Header}>
              <a href="..">exit</a>
            </div>
          </div>
          <EditGameConfig value={gameConfig} />
        </div>
      </Show>
      <button class={styles.PauseButton}
        onClick={() => mode() === "play" ? pause() : resume()}
      >
        {mode() === "play" ? "Pause" : "Resume"}
      </button>
      <button class={styles.ViewSourceButton}
        onClick={() => mode() === "source" ? pause() : viewSource()}
      >
        {mode() === "source" ? "View Game" : "View Source"}
      </button>
    </div>
  );
};
