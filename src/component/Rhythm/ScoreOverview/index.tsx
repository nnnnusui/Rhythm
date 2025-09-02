import { downloadJson } from "~/fn/downloadJson";
import { Score } from "../type/Score";

import styles from "./ScoreOverview.module.css";

export const ScoreOverview = (p: {
  score: Score;
  onDelete: () => void;
}) => {
  const score = () => p.score;
  const exportJson = () => {
    downloadJson({
      data: score(),
      filename: `${score().title || score().id}.json`,
    });
  };

  return (
    <div class={styles.ScoreOverview}>
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
          onClick={() => exportJson()}
        >Export</button>
        <button
          onClick={() => {
            exportJson();
            p.onDelete();
          }}
        >Delete</button>
      </div>
    </div>
  );
};

// TODO: サムネイル取得のダミー関数（本来はScoreにサムネイルURL等を持たせる）
const getThumbnail = (score: Score | undefined) => {
  // @ts-ignore
  return (score && (score.thumbnailUrl || score.thumbnail || score.imageUrl)) || "/icon/note-flick.svg";
};
