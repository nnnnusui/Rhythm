import {
  Component,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import Type from "../../context/game/Note";
import styles from "./Note.module.styl";

const Note: Component<Type> = (props) => {
  const [game] = useGame();
  const duration = () => game.duration();
  const progress = () => props.progress();

  const delay = () =>
    progress() - duration();

  return (
    <Show when={!props.judgement()}>
      <div
        class={styles.Note}
        style={{
          "animation-duration": `${duration() * 2}s`,
          "animation-delay": `${delay()}s`,
        }}
      >
        {props.time().toFixed(1)}
      _ {progress().toFixed(1)}
      </div>
    </Show>
  );
};

export default Note;
