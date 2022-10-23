import {
  Component,
  For,
  Show,
} from "solid-js";

import * as Game from "../../context/game";
import styles from "./Game.module.styl";
import Note from "./Note";

const Element: Component = () => {
  const [game] = Game.useGame();

  const onScreen = (note: Game.Note) => {
    const progress = game.time() - note.time;
    const beforeScreen =  progress < -1;
    const afterScreen = 1 < progress;
    const offScreen = beforeScreen || afterScreen;
    return !offScreen;
  };

  return (
    <div
      class={styles.Game}
    >
      <For each={game.notes()}>{(note) =>
        <Show when={onScreen(note)}>
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
