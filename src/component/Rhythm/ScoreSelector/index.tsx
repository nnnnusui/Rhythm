import { For, Show } from "solid-js";

import { Button } from "~/component/ui/Button";
import { Objects } from "~/fn/objects";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { ScoreImportButton } from "./ScoreImportButton";
import { ScoreOverview } from "../ScoreOverview";
import { Score } from "../type/Score";

import styles from "./ScoreSelector.module.css";

/** @public */
export const ScoreSelector = (p: {
  scoreMap: Wve<Record<Id, Score>>;
  selectedScoreId: Wve<Id | undefined>;
}) => {
  const scoreMap = Wve.from(() => p.scoreMap);
  const selectedScoreId = Wve.from(() => p.selectedScoreId);
  const scoreEntries = () => Objects.entries(scoreMap());
  const selectedScore = () => scoreMap()[selectedScoreId() || ""];

  return (
    <div class={styles.ScoreSelector}>
      <div class={styles.ScoreList}>
        <For each={scoreEntries()}>{([id, score]) => (
          <div
            class={`${styles.ScoreCard} ${id === selectedScoreId() ? styles.Selected : ""}`}
            onClick={() => {
              selectedScoreId.set(id);
            }}
          >
            <img class={styles.Thumbnail}
              src={getThumbnail(score)}
              alt="thumbnail"
            />
            <div class={styles.ScoreTitle}>{score.title || id}</div>
          </div>
        )}</For>
        <div class={styles.PerScoreActions}>
          <ScoreImportButton scoreMap={scoreMap} />
          <Button class={styles.NewButton}
            onAction={() => {
              const score = Score.init();
              scoreMap.set(score.id, score);
            }}
          >New</Button>
        </div>
      </div>
      <Show when={selectedScore()}>{(score) => (
        <ScoreOverview score={score()}
          onDelete={() => {
            scoreMap.set(score().id, undefined!);
          }}
        />
      )}</Show>
    </div>
  );
};

// TODO: サムネイル取得のダミー関数（本来はScoreにサムネイルURL等を持たせる）
const getThumbnail = (score: Score | undefined) => {
  // @ts-ignore
  return (score && (score.thumbnailUrl || score.thumbnail || score.imageUrl)) || "/icon/note-flick.svg";
};
