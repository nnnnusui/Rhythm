import {
  Component,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./NowPlayingInteraction.module.styl";

const PutNoteInteraction: Component = () => {
  const [game, { setNotes, Note }] = useGame();

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = () => {
      const time = game.time();
      if (time < 0 ) return;
      const note = Note().create({
        time,
      });
      setNotes((prev) => {
        const alreadyExists = prev.find((it) => it.time == note.time);
        if (alreadyExists) return prev;
        return [...prev, note].sort((it) => it.time);
      });
    };

  return (
    <div
      class={styles.NowPlayingInteraction}
      draggable={false}
      onPointerDown={onPointerDown}
    >
      <p class={styles.Name}>putNote</p>
    </div>
  );
};

export default PutNoteInteraction;
