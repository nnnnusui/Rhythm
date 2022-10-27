import {
  Component, createEffect,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./RecentJudge.module.styl";

const RecentJudge: Component = () => {
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

  const offset = () => {
    const value = game.recentJudge()?.offset();
    if (!value) return "";
    const rounded = Math.round(value * 100) / 100;
    return `${rounded}`;
  };

  return (
    <div
      ref={element}
      class={styles.RecentJudge}
    >
      {offset()}
    </div>
  );
};

export default RecentJudge;
