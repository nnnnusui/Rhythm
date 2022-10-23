import {
  Component,
} from "solid-js";

import Type from "../../context/game/Note";
import styles from "./Note.module.styl";

const Note: Component<Type> = (props) => {
  const duration = () => 1;

  const progress = () =>
    props.progress();

  const delay = () =>
    progress() - duration();

  return (
    <div
      class={styles.Note}
      style={{
        "animation-duration": `${duration() * 2}s`,
        "animation-delay": `${delay()}s`,
      }}
    >
      {props.time}
      _ {progress()}
    </div>
  );
};

export default Note;
