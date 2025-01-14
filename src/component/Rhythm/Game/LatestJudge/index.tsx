import { Judge } from "../Judge";

import styles from "./LatestJudge.module.css";

export const LatestJudge = (p: {
  judge: Judge | undefined;
}) => {

  return (
    <div class={styles.LatestJudge}>
      {p.judge?.kind}
    </div>
  );
};
