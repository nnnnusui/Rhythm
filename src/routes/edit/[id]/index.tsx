import { useParams } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";

import { Editor, ViewMode } from "~/component/domain/rhythm/Editor";
import { Game } from "~/component/domain/rhythm/Game";
import { PerUserStatus } from "~/component/domain/rhythm/PerUserStatus";
import { VolumeConfig } from "~/component/domain/rhythm/type/GameConfig";
import { Score } from "~/component/domain/rhythm/type/Score";
import { ResourcePlayerPortal } from "~/component/embed/ResourcePlayerPortal";
import { useLogger } from "~/fn/signal/root/useLogger";
import { usePerUserStatus } from "~/fn/signal/root/usePerUserStatus";
import { usePlaybackState } from "~/fn/signal/root/usePlaybackState";
import { Wve } from "~/type/struct/Wve";

import styles from "./index.module.css";

const logger = useLogger("EditPage");

export default function EditPage() {
  const params = useParams();
  const status = usePerUserStatus();
  const scoreMap = status.partial("editingScoreMap");
  const score = scoreMap.partial(params.id ?? "");
  const gameConfig = status.partial("gameConfig");
  logger.info(`Editing scoreId ${status().editingScoreId} -> ${params.id}`);
  status.set("editingScoreId", params.id);

  return (
    <div class={styles.EditPage}>
      <div class={styles.Header}>
        <a href="..">back to prev</a>
      </div>
      <Show when={score.whenPresent()}>{(score) => (
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
  const { timer } = usePlaybackState();
  const score = Wve.from(() => p.score);

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
      <ResourcePlayerPortal class={styles.Resource}
        asBackground={viewMode() !== "sourceControl"}
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
            disableAutoJudge
          />
        )}</For>
      </div>
      <div class={styles.ViewBackground}
        classList={{ [styles.Hidden]: viewMode() !== "edit" }}
      />
    </Editor>
  );
};
