import {
  Component,
  createSignal, For,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./Game.module.styl";
import Note from "./Note";

const Game: Component = () => {
  const [game] = useGame();

  const [notes, setNotes] = createSignal<Note[]>([]);
  const addNoteToCurrentTime = () => {
    const time = game.time();
    if (time < 0 ) return;
    const note: Note = {
      time: time,
    };
    setNotes((prev) => {
      const alreadyExists = prev.find((it) => it.time == note.time);
      if (alreadyExists) return prev;
      return [...prev, note].sort((it) => it.time);
    });
  };

  return (
    <div
      class={styles.Game}
      onPointerDown={addNoteToCurrentTime}
    >
      <For each={notes()}>{(note) =>
        <Note {...note} />
      }</For>
      <div
        class={styles.JudgeLine}
      />
    </div>
  );
};

export default Game;
