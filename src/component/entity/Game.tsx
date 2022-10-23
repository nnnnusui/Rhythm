import {
  Component,
  For,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./Game.module.styl";
import Note from "./Note";

const Element: Component = () => {
  const [game] = useGame();

  return (
    <div
      class={styles.Game}
    >
      <For each={game.notes()}>{(note) =>
        <Show when={note.onScreen()}>
          <Note {...note} />
        </Show>
      }</For>
      <div
        class={styles.JudgeLine}
      />
    </div>
  );
};

export default Element;
