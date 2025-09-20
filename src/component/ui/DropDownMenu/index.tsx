import { JSX } from "solid-js";

import { Floating } from "~/component/render/Floating";
import { HeadlessProps } from "~/type/component/HeadlessProps";
import { Wve } from "~/type/struct/Wve";
import { Modal } from "../Modal";

import styles from "./DropDownMenu.module.css";

/** @public */
export const DropDownMenu = (p: HeadlessProps<{
  label: JSX.Element;
  children: JSX.Element;
}>) => {
  let ref!: HTMLButtonElement;
  const opened = Wve.create(false);

  return (
    <div {...HeadlessProps.getStyles(p)}>
      <button
        ref={ref}
        type="button"
        onClick={() => opened.set((prev) => !prev)}
      >
        <span>{p.label}</span>
        <span>{opened() ? "▲" : "▼"}</span>
      </button>
      <Floating
        class={styles.Menu}
        as={Modal}
        anchorTarget={ref}
        open={opened}
      >
        {p.children}
      </Floating>
    </div>
  );
};
