import { For, Show } from "solid-js";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { ScoreOverview } from "../ScoreOverview";
import { Score } from "../type/Score";

import styles from "./ScoreSelector.module.css";

/** @public */
export const ScoreSelector = (p: {
  scoreEntries: () => [Id, Score][];
  selectedScoreId: Wve<Id | undefined>;
  onNewScore: () => void;
  onImport: () => void;
  onDelete: (id: Id) => void;
}) => {
  const selectedScore = () => p.scoreEntries().find(([id]) => id === p.selectedScoreId())?.[1];

  return (
    <div class={styles.ScoreSelector}>
      <div class={styles.ScoreList}>
        <For each={p.scoreEntries()}>{([id, score]) => (
          <div
            class={`${styles.ScoreCard} ${id === p.selectedScoreId() ? styles.Selected : ""}`}
            onClick={() => {
              p.selectedScoreId.set(id);
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
          <button class={styles.ImportButton}
            type="button"
            onClick={() => p.onImport()}
          >Import</button>
          <button class={styles.NewButton}
            type="button"
            onClick={() => p.onNewScore()}
          >New</button>
        </div>
      </div>
      <Show when={selectedScore()}>{(score) => (
        <ScoreOverview score={score()}
          onDelete={() => p.onDelete(score().id)}
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
