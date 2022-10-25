import {
  Component, createEffect, createSignal,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./RecentJudge.module.styl";

const getElementByJudge
  = (judge: string) => (
    <div
      class={styles.RecentJudge}
    >
      {judge}
    </div>
  );

const RecentJudge: Component = () => {
  const [game] = useGame();
  const [element, setElement] = createSignal(getElementByJudge(game.recentJudge()), { equals: false });

  createEffect(() => {
    setElement(getElementByJudge(game.recentJudge()));
  });

  return (
    <>{element()}</>
  );
};

export default RecentJudge;
