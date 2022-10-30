import {
  Component, createEffect, createSignal,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./RecentJudge.module.styl";

const RecentJudge: Component = () => {
  const [game] = useGame();
  const [text, setText] = createSignal("", { equals: false });

  let element!: HTMLDivElement;
  createEffect(() => {
    const judge = game.recentJudge();
    if (judge === undefined) return;
    const offset = judge.offset();
    if (offset === undefined) return;
    setText(offset.toFixed(3));
  });
  createEffect(() => {
    text();
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
      {text()}
    </div>
  );
};

export default RecentJudge;
