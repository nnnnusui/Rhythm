import { For, JSX } from "solid-js";

import { Objects } from "~/fn/objects";
import { GameResultEvent } from "../../Game";

import styles from "./ResultScreen.module.css";

/** @public */
export const ResultScreen = (p: {
  gameResult: GameResultEvent;
  children?: JSX.Element;
}) => {
  const judgeKindMap = () => Objects.groupBy(Objects.values(p.gameResult.judgedMap), (it) => it.kind);

  return (
    <div class={styles.ResultScreen}>
      <h1>RESULT</h1>
      <div class={styles.JudgeCountsContainer}>
        <For each={Objects.entries(judgeKindMap())}>{([kind, judges]) => (
          <>
            <span class={styles.JudgeKind}>{kind}</span>
            <span class={styles.JudgeCount}>{judges.length}</span>
          </>
        )}</For>
      </div>
      {p.children}
    </div>
  );
};
