import { Component, createEffect, createSignal } from "solid-js";

import { useGame } from "../../context/game";
import Note from "../../context/game/Note";
import DurationInteraction from "../interaction/DurationInteraction";
import NowPlayingInteraction from "../interaction/NowPlayingInteraction";
import TimeInteraction from "../interaction/TimeInteraction";
import ObjectView from "../view/ObjectView";
import styles from "./index.module.styl";
import PutNoteOnLane from "./PutNoteOnLane";

const Editor: Component = () => {
  const [game] = useGame();
  const [nearestNote, setNearestNote] = createSignal<Note>();

  createEffect(() => {
    setNearestNote((prev) => {
      prev?.setState("selected", false);
      const current
        = game
          .notes()
          .sort((prev, it) => Math.abs(prev.untilJudge()) - Math.abs(it.untilJudge()))
          .find(() => true);
      current?.setState("selected", true);
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
        <PutNoteOnLane />
      </div>
      <section
        class={styles.NoteState}
      >
        <h1>NoteState</h1>
        <ObjectView
          object={nearestNote()?.state}
        />
      </section>
    </section>
  );
};

export default Editor;
