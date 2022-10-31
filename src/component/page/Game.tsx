import { Component, onMount } from "solid-js";

import { useGame } from "../../context/game";
import Game from "../entity/Game";
import styles from "./Game.module.styl";

const Page: Component = () => {
  const [, { setNowPlaying }] = useGame();
  onMount(() => {
    setNowPlaying(true);
  });
  return (
    <div
      class={styles.Game}
    >
      <Game />
    </div>
  );
};

export default Page;
