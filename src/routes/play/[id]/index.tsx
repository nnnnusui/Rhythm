import { useParams } from "@solidjs/router";
import { createSignal, For, Show, untrack } from "solid-js";

import { ResourcePlayer } from "~/component/embed/ResourcePlayer";
import { TimelineKeyframe } from "~/component/Rhythm/Editor/Timeline";
import { Game } from "~/component/Rhythm/Game";
import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
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
  const sourceKeyframeMap = keyframeMap.filter((it) => it.kind === "source");
  const playerTimeline = () => TimelineKeyframe
    .getSourceNodes(Objects.values(sourceKeyframeMap()));

  const gameConfig = Wve.from(() => p.gameConfig);
  const [gameKey, setGameKey] = createSignal([{}]);
  const resetGame = () => setGameKey([{}]);

  const [mode, setMode] = createSignal<"play" | "pause">("play");
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
    setMode("play");
    timer.start();
  };

  timer.start();
  return (
    <div class={styles.PlayScreen}>
      <ResourcePlayer
        playing={timer.measuring}
        offset={timer.offset}
        time={timer.current}
        sourceMap={score().sourceMap}
        timeline={playerTimeline()}
        preload
      />
      <div class={styles.ViewBackground} />
      <div class={styles.GameContainer}>
        <For each={gameKey()}>{() => (
          <Game
            score={score()}
            time={timer.current / 1000}
            duration={gameConfig().duration}
            judgeDelay={gameConfig().judgeDelay}
          />
        )}</For>
      </div>
      <Show when={mode() === "pause"}>
        <div class={styles.PauseScreen}>
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
      </Show>
      <button class={styles.PauseButton}
        onClick={() => mode() === "play" ? pause() : resume()}
      >
        {mode() === "play" ? "Pause" : "Resume"}
      </button>
    </div>
  );
};
