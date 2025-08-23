import { For, Show } from "solid-js";

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
        <button class={styles.NewButton}
          type="button"
          onClick={() => p.onNewScore()}
        >New</button>
      </div>
      <Show when={(() => {
        const score = selectedScore();
        const id = p.selectedScoreId();
        return !!score && !!id;
      })()}
      >
        <div class={styles.ScoreDetails}>
          <img class={styles.DetailsThumbnail}
            src={getThumbnail(selectedScore())}
            alt="thumbnail"
          />
          <div class={styles.Description}>
            <div class={styles.DetailsTitle}>{selectedScore()?.title || p.selectedScoreId()}</div>
            <div class={styles.DetailsMeta}>ID: {p.selectedScoreId()}</div>
            <div class={styles.DetailsDesc}>{
              selectedScore()?.description || "No description."
            }</div>
          </div>
          <div class={styles.DetailsActions}>
            <a
              class={styles.ActionButton}
              href={`/play/${p.selectedScoreId()}`}
            >Play</a>
            <a
              class={styles.ActionButton}
              href={`/edit/${p.selectedScoreId()}`}
            >Edit</a>
          </div>
        </div>
      </Show>
    </div>
  );
};
