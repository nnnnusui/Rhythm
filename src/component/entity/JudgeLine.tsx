import {
  Component,
  createEffect,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./JudgeLine.module.styl";

const JudgeLine: Component = () => {
  const [game] = useGame();

  let judgeTriedGlowElement!: HTMLDivElement;
  createEffect(() => {
    game.judgeTried();
    window.requestAnimationFrame(() => {
      judgeTriedGlowElement.classList.add(styles.Suppress);
      window.requestAnimationFrame(() => {
        judgeTriedGlowElement.classList.remove(styles.Suppress);
      });
    });
  });

  let judgeGlowElement!: HTMLDivElement;
  createEffect(() => {
    game.recentJudge();
    window.requestAnimationFrame(() => {
      judgeGlowElement.classList.add(styles.Suppress);
      window.requestAnimationFrame(() => {
        judgeGlowElement.classList.remove(styles.Suppress);
      });
    });
  });

  return (
    <div
      class={styles.JudgeLine}
    >
      <div
        ref={judgeTriedGlowElement}
        class={styles.JudgeTriedGlow}
      />
      <div
        ref={judgeGlowElement}
        class={styles.JudgeGlow}
      />
    </div>
  );
};

export default JudgeLine;
