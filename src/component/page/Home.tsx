import {
  Component,
} from "solid-js";

import Game from "../entity/Game";
import NowPlayingInteraction from "../interaction/NowPlayingInteraction";
import PutNoteInteraction from "../interaction/PutNoteInteraction";
import TimeInteraction from "../interaction/TimeInteraction";
import styles from "./Home.module.styl";

const Home: Component = () => {

  return (
    <div
      class={styles.Home}
    >
      <Game />
      <div
        class={styles.Interactions}
      >
        <TimeInteraction />
        <NowPlayingInteraction />
        <div style={{ height: "5em" }} />
        <PutNoteInteraction />
      </div>
    </div>
  );
};

export default Home;
