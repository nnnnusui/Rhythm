import { Component } from "solid-js";

import { useGame } from "../../context/game";
import DurationInteraction from "../interaction/DurationInteraction";
import NowPlayingInteraction from "../interaction/NowPlayingInteraction";
import PutNoteInteraction from "../interaction/PutNoteInteraction";
import TimeInteraction from "../interaction/TimeInteraction";
import ObjectView from "../view/ObjectView";
import styles from "./index.module.styl";

const Editor: Component = () => {
  const [game] = useGame();

  const selectedNote = () =>
    game.notes()
      .find((it) => it.selected())
      ?.time();

  return (
    <section
      class={styles.Editor}
    >
      <h1>Editor</h1>
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
      <ObjectView object={selectedNote()} />
    </section>
  );
};

export default Editor;
