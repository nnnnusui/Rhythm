import {
  batch,
  Component,
  For,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./Game.module.styl";
import JudgeLine from "./JudgeLine";
import Note from "./Note";
import RecentJudge from "./RecentJudge";

const Element: Component = () => {
  const [game, { setRecentJudge }] = useGame();

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
    if (!judgeTarget) return;
    const judge = "judged";
    batch(() => {
      judgeTarget.setJudgement(judge);
      setRecentJudge(judge);
    });
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
      <JudgeLine />
      <RecentJudge />
    </div>
  );
};

export default Element;
