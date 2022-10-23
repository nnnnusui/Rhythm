import {
  Component,
  createEffect,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import doubleTapInteraction from "./function/doubleTapInteraction";
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
  const doubleTap = doubleTapInteraction({
    intervalMs: () => 250,
    action: () => setTime(0),
  });

  createEffect(() => {
    setTime(drag.current().time);
  });

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onPress(event);
      doubleTap.onPress(event);
    };
  const onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onMove(event);
      doubleTap.onMove(event);
    };
  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onRelease(event);
      doubleTap.onRelease(event);
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
      <input
        class={styles.Value}
        value={game.time().toFixed(1)}
        type="number"
        disabled={true}
      />
    </div>
  );
};

export default TimeInteraction;
