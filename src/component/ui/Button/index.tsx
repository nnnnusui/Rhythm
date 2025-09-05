import { JSX } from "solid-js";

import { HeadlessProps } from "~/type/component/HeadlessProps";

/** @public */
export const Button = (p: HeadlessProps<{
  children: JSX.Element;
  onAction: () => void;
}>) => {

  return (
    <button {...HeadlessProps.getStyles(p)}
      type="button"
      onClick={() => p.onAction()}
    >
      {p.children}
    </button>
  );
};
