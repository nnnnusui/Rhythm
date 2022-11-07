import {
  Component,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./NowPlayingInteraction.module.styl";

const PutNoteInteraction: Component = () => {
  const [game, { setNotes, Note }] = useGame();

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.currentTarget.getBoundingClientRect().left;
      const time = game.time();
      if (time < 0 ) return;
      const note = Note().create({
        time,
        judgeRect: {
          left: 0,
          top: 0,
          width: 1,
          height: 1,
        },
        styles: {
          onStart: {
            top: "0%",
          },
          onJudge: {
            top: "80%",
          },
          onEnd: {
            top: "160%",
          },
          note: {
            width: "100%",
            height: "1em",
          },
          judgePoint: {
            height: ".4em",
          },
        },
      });
      setNotes((prev) => {
        const alreadyExists = prev.find((it) => it.state.time == note.state.time);
        if (alreadyExists) return prev;
        return [...prev, note].sort((it) => it.state.time);
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
