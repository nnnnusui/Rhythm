import {
  Component,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./NowPlayingInteraction.module.styl";

const NowPlayingInteraction: Component = () => {
  const [game, { setNowPlaying }] = useGame();

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = () => {
      setNowPlaying((prev) => !prev);
    };

  const indicatePressAction
    = () => game.nowPlaying() ? "Pause" : "Play";

  return (
    <div
      class={styles.NowPlayingInteraction}
      draggable={false}
      onPointerDown={onPointerDown}
    >
      <p class={styles.Name}>{indicatePressAction()}</p>
    </div>
  );
};

export default NowPlayingInteraction;
