import {
  Component,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./Note.module.styl";

type Note = {
  time: number;
}
const Note: Component<Note> = (props) => {
  const [game] = useGame();

  const duration = () => 1;

  const progress = () =>
    (props.time - duration()) - game.time();

  const delay = () =>
    duration() * progress();

  return (
    <div
      class={styles.Note}
      style={{
        "animation-duration": `${duration() * 2}s`,
        "animation-delay": `${delay()}s`,
      }}
    >
      {props.time}
    </div>
  );
};

export default Note;
