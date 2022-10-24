import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  JSX,
  Setter,
} from "solid-js";

import doubleTapInteraction from "../function/doubleTapInteraction";
import dragInteraction from "../function/dragInteraction";
import longTapInteraction from "../function/longTapInteraction";
import styles from "./NumberInteraction.module.styl";

type Props = {
  label: Accessor<string>
  state: Accessor<number>
  setState: Setter<number>
}
const NumberInteraction: Component<Props> = (props) => {
  const [disabled, setDisabled] = createSignal(true);
  let input!: HTMLInputElement;

  type DragState = {
    state: number,
    position: {
      x: number,
      y: number
    }
  }
  const drag = dragInteraction<DragState>({
    defaultState: {
      state: 0,
      position: {
        x: 0,
        y: 0,
      },
    },
    startStateFromEvent: (event) => ({
      state: props.state(),
      position: event,
    }),
    currentStateFromEvent: (start) => (event) => ({
      state: start().state - 0.1 * (start().position.y - event.y),
      position: event,
    }),
  });
  const doubleTap = doubleTapInteraction({
    intervalMs: () => 250,
    action: () => props.setState(0),
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
    props.setState(drag.current().state);
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
      props.setState((prev) => prev - event.deltaY * 0.001);
    };

  const inputed: JSX.EventHandler<HTMLInputElement, Event>
    = (event) => {
      const element = event.currentTarget;
      props.setState(Number(element.value));
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
      class={styles.NumberInteraction}
      draggable={false}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={byWheel}
    >
      <p class={styles.Name}>props.label()</p>
      <input
        class={styles.Value}
        value={props.state().toFixed(1)}
        type="number"
        disabled={disabled()}
        ref={input}
        onFocusOut={onFocusOut}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default NumberInteraction;
