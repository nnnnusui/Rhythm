import { Component } from "solid-js";

import DurationInteraction from "../interaction/DurationInteraction";
import NowPlayingInteraction from "../interaction/NowPlayingInteraction";
import styles from "./Pause.module.styl";

const Pause: Component = () => {

  return (
    <div
      class={styles.Pause}
    >
      <div
        class={styles.Interactions}
      >
        <DurationInteraction />
        <NowPlayingInteraction />
      </div>
    </div>
  );
};

export default Pause;
