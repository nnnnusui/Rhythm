import { JSX, createEffect } from "solid-js";

import { HeadlessProps } from "~/type/component/HeadlessProps";
import { OrFn } from "~/type/OrFn";
import { Wve } from "~/type/struct/Wve";

/**
 * Headless Modal component.
 *
 * Provides modal dialog logic and accessibility without any default styling.
 * Use this component when you want to control the appearance and transitions yourself.
 *
 * @public
 */
export const Modal = (p: HeadlessProps<{
  open: Wve<boolean>;
  children: OrFn<JSX.Element, [ModalControls]>;
}>) => {
  const open = Wve.from(() => p.open);
  let ref: HTMLDialogElement | undefined;

  const closeIfBackdropClicked: JSX.EventHandler<HTMLDialogElement, MouseEvent> = (event) => {
    const target = event.currentTarget;
    if (target !== event.target) return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const { top, left, width, height } = target.getBoundingClientRect();
    const inDialog = top <= clientY
      && clientY <= top + height
      && left <= clientX
      && clientX <= left + width;

    if (!inDialog) target.close();
  };

  const close = () => ref?.close();

  createEffect(() => {
    if (!open()) return ref?.close();
    ref?.showModal();
  });

  return (
    <dialog {...HeadlessProps.getStyles(p)}
      ref={ref}
      onClick={closeIfBackdropClicked}
      onClose={(event) => {
        event.preventDefault();
        open.set(false);
      }}
    >
      {OrFn.resolve(p.children, { close })}
    </dialog>
  );
};

type ModalControls = {
  close: () => void;
};
