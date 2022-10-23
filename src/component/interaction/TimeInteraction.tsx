import {
  Component,
  createEffect,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import dragInteraction from "./function/dragInteraction";
import styles from "./TimeInteraction.module.styl";

const TimeInteraction: Component = () => {
  const [game, { setTime }] = useGame();

  type DragState = {
    time: number,
    position: {
      x: number,
      y: number
    }
  }
  const drag = dragInteraction<DragState>({
    defaultState: {
      time: 0,
      position: {
        x: 0,
        y: 0,
      },
    },
    startStateFromEvent: (event) => ({
      time: game.time(),
      position: event,
    }),
    currentStateFromEvent: (start) => (event) => ({
      time: start().time - 0.1 * (start().position.y - event.y),
      position: event,
    }),
  });

  createEffect(() => {
    setTime(drag.current().time);
  });

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onPress(event);
    };
  const onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onMove(event);
    };
  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onRelease(event);
    };

  const byWheel: JSX.EventHandler<HTMLElement, WheelEvent>
    = (event) => {
      setTime((prev) => prev - event.deltaY * 0.001);
    };

  return (
    <div
      class={styles.TimeInteraction}
      draggable={false}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={byWheel}
    >
      <p class={styles.Name}>Time</p>
      <p class={styles.Value}>{game.time().toFixed(1)}</p>
    </div>
  );
};

export default TimeInteraction;
