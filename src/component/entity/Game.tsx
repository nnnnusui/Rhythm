import {
  Component,
  For,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./Game.module.styl";
import Note from "./Note";

const Game: Component = () => {
  const [game] = useGame();

  return (
    <div
      class={styles.Game}
    >
      <For each={game.notes()}>{(note) =>
        <Note {...note} />
      }</For>
      <div
        class={styles.JudgeLine}
      />
    </div>
  );
};

export default Game;
