import {
  Component,
} from "solid-js";

import Game from "../entity/Game";
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
      </div>
    </div>
  );
};

export default Home;
