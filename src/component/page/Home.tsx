import {
  Component,
} from "solid-js";

import TimeInteraction from "../interaction/TimeInteraction";
import styles from "./Home.module.styl";

const Home: Component = () => {

  return (
    <div
      class={styles.Home}
    >
      <div
        class={styles.Game}
      />
      <div
        class={styles.Interactions}
      >
        <TimeInteraction />
      </div>
    </div>
  );
};

export default Home;
