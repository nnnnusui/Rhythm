import {
  Component,
  createSignal,
} from "solid-js";

import styles from "./Note.module.styl";

type Note = {
  time: number;
}
const Note: Component<Note> = (props) => {
  
  return (
    <div
      class={styles.Note}
      style={{
        bottom: `${props.time}cm`
      }}
    >
      {props.time}
    </div>
  );
};

export default Note;
