import { For, Show } from "solid-js";

import { downloadJson } from "~/fn/downloadJson";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Score } from "../type/Score";

import styles from "./ScoreSelector.module.css";

// サムネイル取得のダミー関数（本来はScoreにサムネイルURL等を持たせる）
const getThumbnail = (score: Score | undefined) => {
  // @ts-ignore
  return (score && (score.thumbnailUrl || score.thumbnail || score.imageUrl)) || "/icon/note-flick.svg";
};

/** @public */
export const ScoreSelector = (p: {
  scoreEntries: () => [Id, Score][];
  selectedScoreId: Wve<Id | undefined>;
  onNewScore: () => void;
  onImport: () => void;
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
        <div class={styles.ScoreDetails}>
          <img class={styles.DetailsThumbnail}
            src={getThumbnail(score())}
            alt="thumbnail"
          />
          <div class={styles.Description}>
            <div class={styles.DetailsTitle}>{score().title || score().id}</div>
            <div class={styles.DetailsMeta}>ID: {score().id}</div>
            <div class={styles.DetailsDesc}>{
              score().description || "No description."
            }</div>
          </div>
          <div class={styles.DetailsActions}>
            <a
              class={styles.ActionButton}
              href={`/play/${score().id}`}
            >Play</a>
            <a
              class={styles.ActionButton}
              href={`/edit/${score().id}`}
            >Edit</a>
            <button
              onClick={() => {
                downloadJson({
                  data: score(),
                  filename: `${score().title || score().id}.json`,
                });
              }}
            >Export</button>
          </div>
        </div>
      )}</Show>
    </div>
  );
};
