import { createElementBounds } from "@solid-primitives/bounds";
import { JSX, createEffect } from "solid-js";

import { usePlaybackState } from "~/fn/signal/root/usePlaybackState";
import { HeadlessProps } from "~/type/component/HeadlessProps";

import styles from "./ResourcePlayerPortal.module.css";

/**
 * Portal component for rendering a ResourcePlayer at a specific element position.
 *
 * - Measures its own bounding box and updates global playback state (resourcePosition).
 * - Can be used to overlay or background ResourcePlayer at arbitrary positions in the UI.
 * - Use `asBackground` to control whether the player is rendered behind or in front of other elements.
 *
 * @public
 */
export const ResourcePlayerPortal = (p: HeadlessProps<{
  asBackground?: boolean;
  children?: JSX.Element;
}>) => {
  const { resourcePosition } = usePlaybackState();

  let ref!: HTMLDivElement;
  const bounds = createElementBounds(() => ref);
  createEffect(() => {
    if (bounds.top == null) return;
    if (bounds.left == null) return;
    if (bounds.width == null) return;
    if (bounds.height == null) return;
    resourcePosition.set({
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
      inFront: !p.asBackground,
      borderRadius: 14,
    });
  });

  return (
    <div {...HeadlessProps.getStyles(p)}
      classList={{
        [styles.ResourcePlayerPortal]: true,
        ...p.classList,
      }}
      ref={ref}
    >
      {p.children}
    </div>
  );
};
