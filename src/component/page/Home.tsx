import {
  Component,
  createSignal,
  For,
  JSX,
} from "solid-js";
import Note from "../entity/Note";

import styles from "./Home.module.styl";

const Home: Component = () => {
  const [time, setTime] = createSignal(0);
  const timeShiftByWheel: JSX.EventHandler<HTMLElement, WheelEvent> = (event) => {
    setTime(prev => prev - event.deltaY * 0.01)
  }

  type Note = {
    time: number
  }
  const [notes, setNotes] = createSignal<Note[]>([]);
  const addNoteOntime = () => {
    const note: Note = {
      time: time(),
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
      onPointerDown={addNoteOntime}
      onWheel={timeShiftByWheel}
    >
      <h1>time: {time()}</h1>
      <For each={notes()}>{(note) =>
        <Note {...note}/>
      }</For>
    </div>
  );
};

export default Home;
