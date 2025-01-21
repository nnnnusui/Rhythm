import { createElementBounds } from "@solid-primitives/bounds";
import { createWindowSize } from "@solid-primitives/resize-observer";
import clsx from "clsx";
import { ValidComponent, ComponentProps, JSX, children, splitProps, createSignal, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { DragDetector, DragEvent } from "~/component/detect/DragDetector";
import { Override } from "~/type/Override";
import { Wve } from "~/type/struct/Wve";

import styles from "./Resizable.module.css";

/** @public */
export const Resizable = <
  Parent extends ValidComponent = "div",
>(_p: Override<
  Omit<ComponentProps<typeof Dynamic<Parent>>, "component">,
  {
    children?: JSX.Element;
    as?: ComponentProps<typeof Dynamic<Parent>>["component"];
    resizable?: ("top" | "left" | "right" | "bottom")[];
    disabled?: boolean;
    onResize?: OnResize;
  }
>) => {
  const [p, wrappedParentProps] = splitProps(_p, ["children", "as", "resizable", "disabled", "onResize"]);
  const child = children(() => p.children);
  const onResize: OnResize = (e) => p.onResize?.(e);

  const [ref, setRef] = createSignal<HTMLElement>();
  const windowSize = createWindowSize();
  const bound = createElementBounds(ref);
  const size = Wve.create<Partial<Size>>({});

  const state = Wve.create({
    inAction: false,
  });
  const inAction = state.partial("inAction");

  const previewBounds = () => ({
    top: (bound.top ?? 0),
    left: (bound.left ?? 0),
    right: windowSize.width - (bound.right ?? 0),
    bottom: windowSize.height - (bound.bottom ?? 0),
  });

  const getStartSize = () => ({
    width: size().width ?? bound.width ?? 0,
    height: size().height ?? bound.height ?? 0,
  });
  const onDrag = (
    direction: "top" | "left" | "right" | "bottom",
    event: DragEvent<Size>,
  ) => {
    const getNextSize = (size: Size) => {
      switch (direction) {
        case "top": return { ...size, height: size.height + -event.delta.y };
        case "bottom": return { ...size, height: size.height + event.delta.y };
        case "left": return { ...size, width: size.width + -event.delta.x };
        case "right": return { ...size, width: size.width + event.delta.x };
      }
    };

    const prev = event.start;
    const next = getNextSize(prev);
    size.set(next);
    onResize({
      phase: event.phase,
      result: next,
      ratio: { width: next.width / prev.width, height: next.height / prev.height },
    });
    inAction.set(event.phase !== "confirmed");
  };

  const style = () => {
    const raw = size();
    const width = raw.width == null ? {} : { "--width": `${raw.width}px` };
    const height = raw.height == null ? {} : { "--height": `${raw.height}px` };
    return {
      ...width,
      ...height,
    };
  };

  return (
    <Dynamic {...wrappedParentProps}
      component={p.as ?? "div"}
      class={clsx(styles.Resizable, wrappedParentProps.class)}
      style={{
        ...wrappedParentProps.style,
        ...style(),
      }}
      ref={(ref: any) => {
        setRef(ref);
        wrappedParentProps.ref?.(ref);
      }}
    >
      <Show when={p.disabled !== true}>
        <div class={styles.Resizers}
          classList={{ [styles.InAction]: inAction() }}
          style={{
            top: `${previewBounds().top}px`,
            left: `${previewBounds().left}px`,
            right: `${previewBounds().right}px`,
            bottom: `${previewBounds().bottom}px`,
          }}
        >
          <Show when={!p.resizable || p.resizable.includes("left")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Left)}
              dragContainer={document.body}
              startState={getStartSize}
              onDrag={(event) => onDrag("left", event)}
            />
          </Show>
          <Show when={!p.resizable || p.resizable.includes("right")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Right)}
              dragContainer={document.body}
              startState={getStartSize}
              onDrag={(event) => onDrag("right", event)}
            />
          </Show>
          <Show when={!p.resizable || p.resizable.includes("top")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Top)}
              dragContainer={document.body}
              startState={getStartSize}
              onDrag={(event) => onDrag("top", event)}
            />
          </Show>
          <Show when={!p.resizable || p.resizable.includes("bottom")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Bottom)}
              dragContainer={document.body}
              startState={getStartSize}
              onDrag={(event) => onDrag("bottom", event)}
            />
          </Show>
        </div>
      </Show>
      {child()}
    </Dynamic>
  );
};

/** @public */
export type OnResize = (event: ResizeEvent) => void;

type ResizeEvent = {
  phase: "start" | "confirmed" | "preview";
  result: Size;
  ratio: {
    width: number;
    height: number;
  };
};

type Size = {
  width: number;
  height: number;
};
