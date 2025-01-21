import { createElementBounds } from "@solid-primitives/bounds";
import { createWindowSize } from "@solid-primitives/resize-observer";
import clsx from "clsx";
import { ValidComponent, ComponentProps, JSX, children, splitProps, createSignal, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { DragDetector, OnDrag } from "~/component/detect/DragDetector";
import { Objects } from "~/fn/objects";
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
  }
>) => {
  const [p, wrappedParentProps] = splitProps(_p, ["children", "as", "resizable", "disabled"]);
  const child = children(() => p.children);

  const [ref, setRef] = createSignal<HTMLElement>();
  const windowSize = createWindowSize();
  const bound = createElementBounds(ref);
  type MayBeSize = {
    width?: number;
    height?: number;
  };
  const size = Wve.create<MayBeSize>({});
  const inActionDelta = Wve.create<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }>({});
  const inAction = () => Objects.keys(inActionDelta()).length !== 0;

  const previewBounds = () => ({
    top: (bound.top ?? 0) + (inActionDelta().top ?? 0),
    left: (bound.left ?? 0) + (inActionDelta().left ?? 0),
    right: windowSize.width - (bound.right ?? 0) + (inActionDelta().right ?? 0),
    bottom: windowSize.height - (bound.bottom ?? 0) + (inActionDelta().bottom ?? 0),
  });

  const getOnDrag = (
    direction: "top" | "left" | "right" | "bottom",
  ): OnDrag<MayBeSize> => (event) => {
    const delta = () => {
      switch (direction) {
        case "top": return event.delta.y;
        case "bottom": return -event.delta.y;
        case "left": return event.delta.x;
        case "right": return -event.delta.x;
      }
    };
    const getNextSize = (prev: MayBeSize) => {
      const size = {
        width: prev.width ?? bound.width ?? 0,
        height: prev.height ?? bound.height ?? 0,
      };
      switch (direction) {
        case "top": return { ...size, height: size.height + -event.delta.y };
        case "bottom": return { ...size, height: size.height + event.delta.y };
        case "left": return { ...size, width: size.width + -event.delta.x };
        case "right": return { ...size, width: size.width + event.delta.x };
      }
    };
    switch (event.phase) {
      case "confirmed":
        size.set(getNextSize);
        inActionDelta.set(direction, undefined);
        break;
      case "start":
        inActionDelta.set(direction, 0);
        break;
      case "preview":
        inActionDelta.set(direction, delta());
        break;
    }
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
              dragContainer={ref()}
              startState={size}
              onDrag={getOnDrag("left")}
            />
          </Show>
          <Show when={!p.resizable || p.resizable.includes("right")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Right)}
              dragContainer={ref()}
              startState={size}
              onDrag={getOnDrag("right")}
            />
          </Show>
          <Show when={!p.resizable || p.resizable.includes("top")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Top)}
              dragContainer={ref()}
              startState={size}
              onDrag={getOnDrag("top")}
            />
          </Show>
          <Show when={!p.resizable || p.resizable.includes("bottom")}>
            <DragDetector
              class={clsx(styles.Resizer, styles.Bottom)}
              dragContainer={ref()}
              startState={size}
              onDrag={getOnDrag("bottom")}
            />
          </Show>
        </div>
      </Show>
      {child()}
    </Dynamic>
  );
};
