import {
  Component,
  For,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./Game.module.styl";
import Note from "./Note";
import RecentJudge from "./RecentJudge";

const Element: Component = () => {
  const [game, { judge }] = useGame();

  return (
    <div
      class={styles.Game}
      onPointerDown={judge}
    >
      <For each={game.notes()}>{(note) =>
        <Show when={note.onScreen()}>
          <Note {...note} />
        </Show>
      }</For>
      <RecentJudge />
    </div>
  );
};

export default Element;
