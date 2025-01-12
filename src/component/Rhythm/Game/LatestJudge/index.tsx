import styles from "./LatestJudge.module.css";

export const LatestJudge = (p: {
  judge: string | undefined;
}) => {

  return (
    <div class={styles.LatestJudge}>
      {p.judge}
    </div>
  );
};
