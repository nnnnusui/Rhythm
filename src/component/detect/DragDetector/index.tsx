import clsx from "clsx";
import { ValidComponent, ComponentProps, JSX, splitProps, children, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic } from "solid-js/web";

import { Override } from "~/type/Override";
import { Pos } from "~/type/struct/2d/Pos";

import styles from "./DragDetector.module.css";

/** @public */
export const DragDetector = <
  StartState,
  Component extends ValidComponent = "div",
>(_p: Override<
  Omit<ComponentProps<typeof Dynamic<Component>>, "component">,
  {
    children?: JSX.Element;
    as?: ComponentProps<typeof Dynamic<Component>>["component"];
    startState: () => StartState;
    onDrag: OnDrag<StartState>;
    dragContainer?: HTMLElement;
  }
>) => {
  const [p, wrappedProps] = splitProps(_p, ["children", "as", "startState", "onDrag", "dragContainer"]);
  const child = children(() => p.children);

  type Start = {
    pos: Pos;
    state?: StartState;
  };
  const [start, setStart] = createStore<Start>({ pos: { x: 0, y: 0 } });
  const [dragging, setDragging] = createSignal(false);

  const onDrag: OnDrag<StartState> = (event) => p.onDrag(event);

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    wrappedProps.onPointerDown?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    const start: Start = {
      pos: Pos.fromEvent(event, { relativeTo: p.dragContainer }),
      state: p.startState(),
    };
    setStart(start);
    if (start.state == null) return;
    onDrag({
      phase: "start",
      delta: Pos.init(),
      start: start.state,
      raw: event,
    });
  };
  const onPointerMove: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    wrappedProps.onPointerMove?.(event);
    if (event.defaultPrevented) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    event.stopPropagation();
    if (start.state == null) return;
    const movedPos = Pos.fromEvent(event, { relativeTo: p.dragContainer });
    onDrag({
      phase: "preview",
      delta: {
        x: movedPos.x - start.pos.x,
        y: movedPos.y - start.pos.y,
      },
      start: start.state,
      raw: event,
    });
  };
  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    wrappedProps.onPointerUp?.(event);
    if (event.defaultPrevented) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    if (start.state == null) return;
    const movedPos = Pos.fromEvent(event, { relativeTo: p.dragContainer });
    onDrag({
      phase: "confirmed",
      delta: {
        x: movedPos.x - start.pos.x,
        y: movedPos.y - start.pos.y,
      },
      start: start.state,
      raw: event,
    });
  };

  return (
    <Dynamic {...wrappedProps}
      component={p.as ?? "div"}
      class={clsx(styles.DragDetector, wrappedProps.class)}
      classList={{
        [styles.Dragging]: dragging(),
        ...wrappedProps.classList,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {child()}
    </Dynamic>
  );
};

/** @public */
export type OnDrag<StartState> = (event: DragEvent<StartState>) => void;

type DragEvent<StartState> = {
  phase: DragEventPhase;
  delta: Pos;
  start: StartState;
  raw: PointerEvent & { currentTarget: Element };
};

/** @public */
export type DragEventPhase = "start" | "preview" | "confirmed";
