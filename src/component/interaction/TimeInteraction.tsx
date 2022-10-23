import {
  batch,
  Component,
  createEffect,
  createSignal,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import styles from "./TimeInteraction.module.styl";

const TimeInteraction: Component = () => {
  const [game, { setTime }] = useGame();

  type State = {
    time: number,
    position: {
      x: number,
      y: number
    }
  }
  const defaultState = {
    time: 0,
    position: {
      x: 0,
      y: 0,
    },
  };
  const [onInteract, setOnInteract] = createSignal(false);
  const [start, setStart] = createSignal<State>(defaultState);
  const [current, setCurrent] = createSignal<State>(defaultState);

  createEffect(() => {
    setTime(current().time);
  });

  const currentState = (position: State["position"]) => ({
    time: start().time - 0.1 * (start().position.y - position.y),
    position,
  });

  const onPress: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.target.setPointerCapture(event.pointerId);
      batch(() => {
        setOnInteract(true);
        setStart({
          time: game.time(),
          position: event,
        });
      });
    };
  const onMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      if (!onInteract()) return;
      setCurrent(currentState(event));
    };
  const onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      batch(() => {
        setOnInteract(false);
        setCurrent(currentState(event));
      });
    };

  const byWheel: JSX.EventHandler<HTMLElement, WheelEvent>
    = (event) => {
      setTime((prev) => prev - event.deltaY * 0.001);
    };

  return (
    <div
      class={styles.TimeInteraction}
      draggable={false}
      onPointerDown={onPress}
      onPointerMove={onMove}
      onPointerUp={onRelease}
      onWheel={byWheel}
    >
      <p class={styles.Name}>Time</p>
      <p class={styles.Value}>{game.time().toFixed(1)}</p>
    </div>
  );
};

export default TimeInteraction;
