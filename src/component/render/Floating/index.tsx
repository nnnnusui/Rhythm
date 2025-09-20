import clsx from "clsx";
import { ComponentProps, onCleanup, onMount, splitProps, ValidComponent } from "solid-js";
import { Dynamic, isServer } from "solid-js/web";

import { Override } from "~/type/Override";
import { Wve } from "~/type/struct/Wve";

import styles from "./Floating.module.css";

/** @public */
export const Floating = <
  Parent extends ValidComponent = "div",
>(_p: Override<
  Omit<ComponentProps<typeof Dynamic<Parent>>, "component">,
  {
    as?: ComponentProps<typeof Dynamic<Parent>>["component"];
    anchorTarget: HTMLElement | null | undefined;
  }
>) => {
  const [p, wrappedParentProps] = splitProps(_p, ["as", "anchorTarget"]);

  const suggestPos = Wve.create<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  }>({});

  const updatePosition = () => {
    const target = p.anchorTarget;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const topHasALongerMargin = window.innerHeight / 2 < rect.top;
    const anchorBottom = topHasALongerMargin;
    const leftHasALongerMargin = window.innerWidth / 2 < rect.left;
    const anchorRight = leftHasALongerMargin;
    const maxHeight = anchorBottom
      ? rect.top
      : window.innerHeight - rect.bottom;
    const maxWidth = anchorRight
      ? rect.width + rect.left
      : window.innerWidth - rect.left;
    suggestPos.set({
      top: !anchorBottom ? Math.max(0, rect.top + rect.height) : undefined,
      bottom: anchorBottom ? Math.max(0, window.innerHeight - rect.top) : undefined,
      left: !anchorRight ? Math.max(0, rect.left) : undefined,
      right: anchorRight ? Math.max(0, window.innerWidth - rect.right) : undefined,
      minWidth: rect.width,
      maxWidth: Math.min(maxWidth, window.innerWidth) - 20,
      minHeight: 0,
      maxHeight: Math.min(maxHeight, window.innerHeight) - 20,
    });
  };

  onMount(() => updatePosition());
  if (!isServer) {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { capture: true });
    onCleanup(() => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, { capture: true });
    });
  }

  const cssVariables = () => ({
    "--top": suggestPos().top,
    "--left": suggestPos().left,
    "--right": suggestPos().right,
    "--bottom": suggestPos().bottom,
    "--min-width": suggestPos().minWidth,
    "--max-width": suggestPos().maxWidth,
    "--min-height": suggestPos().minHeight,
    "--max-height": suggestPos().maxHeight,
  });

  return (
    <Dynamic {...wrappedParentProps}
      component={p.as ?? "div"}
      class={clsx(
        styles.Floating,
        wrappedParentProps.class,
      )}
      style={{
        ...cssVariables(),
        ...wrappedParentProps.style,
      }}
      ref={(it: any) => {
        wrappedParentProps.ref?.(it);
      }}
    />
  );
};
