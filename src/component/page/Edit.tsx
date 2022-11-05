import {
  Component,
} from "solid-js";

import { useGame } from "../../context/game";
import Game from "../Game";
import DurationInteraction from "../interaction/DurationInteraction";
import NowPlayingInteraction from "../interaction/NowPlayingInteraction";
import PutNoteInteraction from "../interaction/PutNoteInteraction";
import TimeInteraction from "../interaction/TimeInteraction";
import styles from "./Edit.module.styl";

const Page: Component = () => {
  const [game] = useGame();

  return (
    <div
      class={styles.Edit}
    >
      <Game />
      <div
        class={styles.Interactions}
      >
        fps:{Math.round(game.fps())}
        <DurationInteraction />
        <TimeInteraction />
        <NowPlayingInteraction />
        <div style={{ height: "5em" }} />
        <PutNoteInteraction />
      </div>
    </div>
  );
};

export default Page;
