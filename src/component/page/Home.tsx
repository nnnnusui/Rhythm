import {
  Component,
  createSignal,
  For,
} from "solid-js";

import styles from "./Home.module.styl";

const Home: Component = () => {
  const currentTime = () => 0;

  type Note = {
    time: number
  }
  const [notes, setNotes] = createSignal<Note[]>([]);
  const addNoteOnCurrentTime = () => {
    const note: Note = {
      time: currentTime(),
    };
    setNotes((prev) => {
      const alreadyExists = prev.find((it) => it.time == note.time);
      if (alreadyExists) return prev;
      return [...prev, note];
    });
  };

  return (
    <div
      class={styles.Home}
      onPointerDown={addNoteOnCurrentTime}
    >
      <For each={notes()}>{(note) =>
        <div class={styles.Note}>{note.time}</div>
      }</For>
    </div>
  );
};

export default Home;
