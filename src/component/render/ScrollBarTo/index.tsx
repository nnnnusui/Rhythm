import clsx from "clsx";
import { children, ComponentProps, JSX, splitProps, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Override } from "~/type/Override";

import styles from "./ScrollBarTo.module.css";

/** @public */
export const ScrollBarTo = <
  Parent extends ValidComponent = "div",
>(_p: Override<
  Omit<ComponentProps<typeof Dynamic<Parent>>, "component">,
  {
    children: JSX.Element;
    as?: ComponentProps<typeof Dynamic<Parent>>["component"];
    rotate?: number;
    flipVertical?: boolean;
    flipHorizontal?: boolean;
    hideDefaultScrollBar?: boolean;
    childProps?: ComponentProps<typeof Child>;
  }
>) => {
  const [p, wrappedParentProps] = splitProps(_p, ["children", "as", "rotate", "flipVertical", "flipHorizontal", "hideDefaultScrollBar", "childProps"]);
  const child = children(() => p.children);

  return (
    <Dynamic {...wrappedParentProps}
      component={p.as ?? "div"}
      class={clsx(styles.ScrollBarTo, wrappedParentProps.class)}
      classList={{
        ...wrappedParentProps.classList,
        [styles.HideDefaultScrollBar]: p.hideDefaultScrollBar,
      }}
      style={{
        ...wrappedParentProps.style,
        "--rotate": p.rotate ?? 0,
        "--scale": `${p.flipHorizontal ? "-1" : "1"} ${p.flipVertical ? "-1" : "1"}`,
      }}
    >
      <Child {...p.childProps}>
        {child()}
      </Child>
    </Dynamic>
  );
};

const Child = <
  Child extends ValidComponent = "div",
>(_p: Override<
  Omit<ComponentProps<typeof Dynamic<Child>>, "component">,
  {
    children: JSX.Element;
    as?: ComponentProps<typeof Dynamic<Child>>["component"];
  }
>) => {
  const [p, wrappedProps] = splitProps(_p, ["children", "as"]);
  const child = children(() => p.children);

  return (
    <Dynamic {...wrappedProps}
      component={p.as ?? "div"}
      class={clsx(styles.ContentWrapper, wrappedProps.class)}
    >
      {child()}
    </Dynamic>
  );
};
