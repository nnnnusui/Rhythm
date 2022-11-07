import { Component, createEffect, createSignal } from "solid-js";

import { useGame } from "../../context/game";
import Note from "../../context/game/Note";
import DurationInteraction from "../interaction/DurationInteraction";
import NowPlayingInteraction from "../interaction/NowPlayingInteraction";
import PutNoteInteraction from "../interaction/PutNoteInteraction";
import TimeInteraction from "../interaction/TimeInteraction";
import ObjectView from "../view/ObjectView";
import styles from "./index.module.styl";

const Editor: Component = () => {
  const [game] = useGame();
  const [nearestNote, setNearestNote] = createSignal<Note>();

  createEffect(() => {
    setNearestNote((prev) => {
      prev?.setSelected(false);
      const current
        = game
          .notes()
          .sort((prev, it) => Math.abs(prev.untilJudge()) - Math.abs(it.untilJudge()))
          .find(() => true);
      current?.setSelected(true);
      return current;
    });
  });

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
      <ObjectView object={nearestNote()?.time()} />
    </section>
  );
};

export default Editor;
