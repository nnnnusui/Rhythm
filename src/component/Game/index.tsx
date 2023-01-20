import {
  Component,
  For,
} from "solid-js";

import Note from "../Note";
import styles from "./index.module.styl";

import Score from "@/type/Score";

type Props = {
  time: number
  duration: number
  notes: Score["notes"]
}
const This: Component<Props> = (props) => {

  return (
    <div
      class={styles.Root}
    >
      <For each={props.notes}>{(note) =>
        <Note
          game={{
            duration: props.duration,
            time: props.time,
          }}
          {...note}
        />
      }</For>
    </div>
  );
};

export default This;
