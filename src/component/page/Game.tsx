import { Component, Show } from "solid-js";

import { useGame } from "../../context/game";
import Game from "../entity/Game";
import Pause from "../menu/Pause";
import styles from "./Game.module.styl";

const Page: Component = () => {
  const [game, { setNowPlaying }] = useGame();
  const pause = () => {
    setNowPlaying(false);
  };

  return (
    <div
      class={styles.Game}
    >
      <Game />
      <button
        class={styles.PauseButton}
        onPointerUp={pause}
      >
        ||
      </button>
      <Show when={!game.nowPlaying()}>
        <Pause />
      </Show>
    </div>
  );
};

export default Page;
