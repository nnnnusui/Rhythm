import {
  Component,
  createEffect,
  createSignal,
  JSX,
} from "solid-js";

import { useGame } from "../../context/game";
import doubleTapInteraction from "./function/doubleTapInteraction";
import dragInteraction from "./function/dragInteraction";
import longTapInteraction from "./function/longTapInteraction";
import styles from "./TimeInteraction.module.styl";

const TimeInteraction: Component = () => {
  const [game, { setTime }] = useGame();

  const [disabled, setDisabled] = createSignal(true);
  let input!: HTMLInputElement;

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
  const longTap = longTapInteraction({
    intervalMs: () => 100,
    onIntervalPassed: () => setDisabled(false),
    onCancel: () => setDisabled(true),
    onRelease: () => {
      input.focus();
      // Q: Why wait until `onRelease()` before executing `focus()`?
      //    (Why don't run on `intervalPassed()`?)
      // A: Mobile Safari limits where you can `focus()`.
      //    `focus()` can only be executed in TouchEvent-related event handlers.
      //    Since `onRelease()` runs in the "pointerdown" event, it meets this restriction.
    },
  });

  createEffect(() => {
    setTime(drag.current().time);
  });

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onPress(event);
      doubleTap.onPress(event);
      longTap.onPress(event);
    };
  const onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onMove(event);
      doubleTap.onMove(event);
      longTap.onMove(event);
    };
  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      drag.onRelease(event);
      doubleTap.onRelease(event);
      longTap.onRelease(event);
    };

  const byWheel: JSX.EventHandler<HTMLElement, WheelEvent>
    = (event) => {
      setTime((prev) => prev - event.deltaY * 0.001);
    };

  const inputed: JSX.EventHandler<HTMLInputElement, Event>
    = (event) => {
      const element = event.currentTarget;
      setTime(Number(element.value));
      element.blur();
      setDisabled(true);
    };
  const onFocusOut: JSX.EventHandler<HTMLInputElement, FocusEvent>
    = (event) => {
      inputed(event);
    };
  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent>
      = (event) => {
        if (event.key !== "Enter") return;
        inputed(event);
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
        disabled={disabled()}
        ref={input}
        onFocusOut={onFocusOut}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default TimeInteraction;
