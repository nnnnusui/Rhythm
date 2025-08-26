import { Judge } from "../Judge";

import styles from "./LatestJudge.module.css";

export const LatestJudge = (p: {
  judge: Judge;
}) => {

  return (
    <div class={styles.LatestJudge}>
      <span class={styles.JudgeKind}>{p.judge.kind}</span>
      <span class={styles.Until}>{p.judge.untilSecond.toFixed(3)}s</span>
    </div>
  );
};
