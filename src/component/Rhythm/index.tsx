import { createSignal, For, Show, untrack } from "solid-js";

import { AudioContextProvider } from "~/fn/context/AudioContext";
import { OperatedProvider } from "~/fn/context/OperatedContext";
import { SoundEffectProvider } from "~/fn/context/SoundEffectContext";
import { getNestedComponent } from "~/fn/getNestedComponent";
import { Objects } from "~/fn/objects";
import { createTimer } from "~/fn/signal/createTimer";
import { makePersisted } from "~/fn/signal/makePersisted";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Editor, ViewMode } from "./Editor";
import { TimelineKeyframe } from "./Editor/Timeline";
import { Game } from "./Game";
import { PerUserStatus } from "./PerUserStatus";
import { ResourcePlayer } from "../embed/ResourcePlayer";
import { Score } from "./type/Score";

import styles from "./Rhythm.module.css";

/** @public */
export const Rhythm = () => {
  const Providers = getNestedComponent(
    OperatedProvider,
    AudioContextProvider,
    SoundEffectProvider,
  );

  return (
    <Providers>
      <WithContext />
    </Providers>
  );
};

const WithContext = () => {
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.init }));

  const scoreMap = status.partial("editingScoreMap");
  const selectedScoreId = status.partial("editingScoreId");
  const scoreEntries = () => Objects.entries(scoreMap());
  const score = Wve.mayBe(() => {
    const id = selectedScoreId();
    if (!id) return;
    return untrack(() => scoreMap).partial(id);
  });

  const gameConfig = status.partial("gameConfig");

  return (
    <div class={styles.Rhythm}>
      <div class={styles.Controls}>
        <select
          value={selectedScoreId()}
          onChange={(event) => selectedScoreId.set(event.currentTarget.value)}
        >
          <For each={scoreEntries()}>{([id, score]) => (
            <option value={id}
              selected={id === selectedScoreId()}
            >
              {!score.title ? id : score.title}
            </option>
          )}</For>
        </select>
        <button
          type="button"
          onClick={() => {
            const id = Id.new();
            scoreMap.set(id, Score.init());
          }}
        >new</button>
      </div>
      <Show when={score.when((it) => !!it)}>{(score) => (
        <WithScore
          score={score()}
          gameConfig={gameConfig}
        />
      )}</Show>
    </div>
  );
};

const WithScore = (p: {
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
        playing={timer.measuring}
        offset={timer.offset}
        time={timer.current}
        sourceMap={score().sourceMap}
        timeline={playerTimeline()}
        preload
      />
      <div class={styles.ViewBackground}
        classList={{ [styles.Hidden]: viewMode() !== "play" }}
      />
      <For each={gameKey()}>{() => (
        <Game
          score={score()}
          time={timer.current / 1000}
          duration={gameConfig().duration}
          judgeDelay={gameConfig().judgeDelay}
          ghost={viewMode() === "sourceControl"}
        />
      )}</For>
      <div class={styles.ViewBackground}
        classList={{ [styles.Hidden]: viewMode() !== "edit" }}
      />
    </Editor>
  );
};
