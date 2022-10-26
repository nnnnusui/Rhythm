import {
  Component,
  createEffect,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./JudgeLine.module.styl";

const JudgeLine: Component = () => {
  const [game] = useGame();

  let element!: HTMLDivElement;
  createEffect(() => {
    game.recentJudge();
    window.requestAnimationFrame(() => {
      element.classList.add(styles.Suppress);
      window.requestAnimationFrame(() => {
        element.classList.remove(styles.Suppress);
      });
    });
  });

  return (
    <div
      class={styles.JudgeLine}
    >
      <div
        ref={element}
        class={styles.JudgeGlow}
      />
    </div>
  );
};

export default JudgeLine;
