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

  return (
    <div
      ref={element}
      class={styles.RecentJudge}
    >
      {game.recentJudge()}
    </div>
  );
};

export default RecentJudge;
