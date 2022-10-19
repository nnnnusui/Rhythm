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
  const progress = () =>
    props.time - game.time();

  return (
    <div
      class={styles.Note}
      style={{
        bottom: `${progress()}cm`,
      }}
    >
      {props.time}
    </div>
  );
};

export default Note;
