import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  JSX,
  on,
  Setter,
} from "solid-js";
import { createStore } from "solid-js/store";

import { useTimer } from "../../signal/useTimer";

type PointerEventHandler = JSX.EventHandler<HTMLElement, PointerEvent>
type EventArg = Parameters<PointerEventHandler>[0]

type GlobalState<T> = {
  input: {
    ref: Accessor<HTMLInputElement | undefined>
    disabled: Accessor<boolean>
    setDisabled: Setter<boolean>
  }
  moved: Accessor<boolean>
  onTap: Accessor<T | undefined>
}

type TapState = {
  event: EventArg
  intervalMs: number
}
type OnTap<T> = (state: TapState) => T | undefined

type LongTapState<T> = {
  intervalMs: number
} & GlobalState<T>
type OnLongTap<T> = (state: LongTapState<T>) => void

type ReleaseState<T> = {
  event: EventArg
  intervalMs: number
} & GlobalState<T>
type OnRelease<T> = (state: ReleaseState<T>) => void

type DragState<T> = {
  start: EventArg
  before: EventArg
  current: EventArg
} & GlobalState<T>
type OnDrag<T> = (state: DragState<T>) => void

type ChildrenArgs = {
  Input: Component<JSX.InputHTMLAttributes<HTMLInputElement>>
  events: {
    onPointerDown: PointerEventHandler
    onPointerMove: PointerEventHandler
    onPointerUp: PointerEventHandler
  }
}

type Props<T> = {
  onTap?: OnTap<T>
  onLongTap?: OnLongTap<T>
  onRelease?: OnRelease<T>
  onDrag?: OnDrag<T>
  children: (args: ChildrenArgs) => JSX.Element;
}
const Interaction = <T,>(props: Props<T>): () => JSX.Element => {
  const onTap: OnTap<T>
    = (v) => props.onTap ? props.onTap(v) : undefined;
  const onLongTap: OnLongTap<T>
    = (v) => props.onLongTap ? props.onLongTap(v) : () => {};
  const onRelease: OnRelease<T>
    = (v) => props.onRelease ? props.onRelease(v) : () => {};
  const onDrag: OnDrag<T>
    = (v) => props.onDrag ? props.onDrag(v) : () => {};

  const tapIntervalTimer = useTimer();
  const longTapTimer = useTimer();
  const [drag, setDrag] = createStore({} as DragState<T>);
  const [onInteract, setOnInteract] = createSignal(false);
  const [start, setStart] = createSignal<T>();

  const [ref, setRef] = createSignal<HTMLInputElement>();
  const [moved, setMoved] = createSignal(true);
  const [disabled, setDisabled] = createSignal(true);
  const globalState: GlobalState<T> = {
    input: {
      ref,
      disabled,
      setDisabled,
    },
    moved,
    onTap: start,
  };

  createEffect(on(
    () => longTapTimer.state,
    (state) =>
      onLongTap({
        ...globalState,
        intervalMs: state,
      }),
    { defer: true }
  ));

  const onPointerDown: PointerEventHandler
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setOnInteract(true);
      setMoved(false);
      longTapTimer.start();
      tapIntervalTimer.stop();

      setStart(() =>
        onTap({
          ...globalState,
          event,
          intervalMs: tapIntervalTimer.state,
        })
      );
      setDrag({
        ...globalState,
        start: event,
        before: event,
        current: event,
      });
    };
  const onPointerMove: PointerEventHandler
    = (event) => {
      if (!onInteract()) return;
      setDrag((prev) => ({
        ...globalState,
        before: prev.current,
        current: event,
      }));
      onDrag(drag);
      setMoved(true);
    };
  const onPointerUp: PointerEventHandler
    = (event) => {
      onRelease({
        ...globalState,
        event,
        intervalMs: longTapTimer.state,
      });
      ref()?.focus();

      setOnInteract(false);
      longTapTimer.stop();
      tapIntervalTimer.start();
    };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent>
    = (event) => {
      if (event.key !== "Enter") return;
      setDisabled(true);
      ref()?.blur();
    };

  const args: ChildrenArgs = {
    Input: (props) => (
      <input
        ref={setRef}
        disabled={disabled()}
        onFocusOut={() => setDisabled(true)}
        onKeyDown={onKeyDown}
        {...props}
      />
    ),
    events: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
  return () => props.children(args);
};

type Interaction<T> = Props<T>;
export default Interaction;
