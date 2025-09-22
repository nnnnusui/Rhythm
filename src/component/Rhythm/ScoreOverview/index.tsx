import { ResourcePlayerPortal } from "~/component/embed/ResourcePlayerPortal";
import { downloadJson } from "~/fn/downloadJson";
import { Score } from "../type/Score";

import styles from "./ScoreOverview.module.css";

export const ScoreOverview = (p: {
  score: Score;
  onDelete: () => void;
}) => {
  const score = () => p.score;
  const exportJson = () => {
    const version = new Date(score().version.current)
      .toISOString()
      .replaceAll("-", "")
      .replaceAll(":", "")
      .replace(/\.[0-9]{3}Z$/, "");
    const title = score().title || score().id;
    const filename = `${title}_${version}.json`;
    downloadJson({
      data: score(),
      filename,
    });
  };

  return (
    <div class={styles.ScoreOverview}>
      <ResourcePlayerPortal
        class={styles.DetailsThumbnail}
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
