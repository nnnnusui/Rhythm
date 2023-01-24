import {
  Component,
  createEffect,
  For,
} from "solid-js";
import { createStore } from "solid-js/store";

import Note from "../Note";
import styles from "./index.module.styl";

import { createNoteStore, NoteStore } from "@/state/createNoteStore";
import Score from "@/type/Score";

type Props = {
  time: number
  duration: number
  score: Score
}
const This: Component<Props> = (props) => {
  const [notes, setNotes] = createStore<NoteStore[]>([]);
  createEffect(() => {
    setNotes(props.score.notes.map((it) => createNoteStore(it)));
  });

  return (
    <div
      class={styles.Root}
    >
      <For each={notes}>{(note) =>
        <Note
          game={{
            duration: props.duration,
            time: props.time,
          }}
          {...note.state}
        />
      }</For>
    </div>
  );
};

export default This;
