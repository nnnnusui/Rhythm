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

  const judge = () => {
    if (!game.nowPlaying()) return;
    const slowestLimit = -0.1;
    const fastestLimit =  0.1;
    const judgeTarget
      = game
        .notes()
        .find((it) =>
          slowestLimit < it.progress()
          && it.progress() < fastestLimit
        )
        ;
    judgeTarget?.setJudgement("judged");
  };

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
      <div
        class={styles.JudgeLine}
      />
    </div>
  );
};

export default Element;
