import { useParams } from "@solidjs/router";
import { createSignal, For, Show, untrack } from "solid-js";

import { ResourcePlayer } from "~/component/embed/ResourcePlayer";
import { Editor, ViewMode } from "~/component/Rhythm/Editor";
import { TimelineKeyframe } from "~/component/Rhythm/Editor/Timeline";
import { Game } from "~/component/Rhythm/Game";
import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
import { VolumeConfig } from "~/component/Rhythm/type/GameConfig";
import { Score } from "~/component/Rhythm/type/Score";
import { Objects } from "~/fn/objects";
import { createTimer } from "~/fn/signal/createTimer";
import { makePersisted } from "~/fn/signal/makePersisted";
import { Wve } from "~/type/struct/Wve";

import styles from "./index.module.css";

export default function EditPage() {
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
    <div class={styles.EditPage}>
      <div class={styles.Header}>
        <a href="..">back to prev</a>
      </div>
      <Show when={score.when((it) => !!it)}>{(score) => (
        <EditorScreen
          score={score()}
          gameConfig={gameConfig}
        />
      )}</Show>
    </div>
  );
}

const EditorScreen = (p: {
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
  const state = Wve.create({ viewMode: ViewMode.init() });
  const viewMode = state.partial("viewMode");

  return (
    <Editor
      timer={timer}
      score={score}
      viewMode={viewMode}
      gameConfig={gameConfig}
      resetGame={resetGame}
    >
      <ResourcePlayer
        sourceMap={score().sourceMap}
        timeline={playerTimeline()}
        playing={timer.measuring}
        offset={timer.offset}
        time={timer.current}
        volume={VolumeConfig.getDecimal(gameConfig().volume, "music")}
        preload
      />
      <div class={styles.ViewBackground}
        classList={{ [styles.Hidden]: viewMode() !== "play" }}
      />
      <div class={styles.GameContainer}
        classList={{ [styles.Hidden]: viewMode() === "sourceControl" }}
      >
        <For each={gameKey()}>{() => (
          <Game
            score={score()}
            time={timer.current / 1000}
            duration={gameConfig().duration}
            judgeDelay={gameConfig().judgeDelay}
            volume={VolumeConfig.getDecimal(gameConfig().volume, "effect")}
          />
        )}</For>
      </div>
      <div class={styles.ViewBackground}
        classList={{ [styles.Hidden]: viewMode() !== "edit" }}
      />
    </Editor>
  );
};
