import {
  Component,
  For,
  JSX,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import Judgement from "../../context/game/Judgement";
import styles from "./index.module.styl";
import Note from "./Note";
import RecentJudge from "./RecentJudge";

const Element: Component = () => {
  const [game, { judge }] = useGame();

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      const screen = event.currentTarget;
      const rect = screen.getBoundingClientRect();
      const point: Judgement.Point
        = {
          x: (event.pageX - rect.left) / rect.width,
          y: (event.pageY - rect.top) / rect.height,
        };
      judge(point);
    };

  return (
    <div
      class={styles.Game}
      onPointerDown={onPointerDown}
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
