import { Modal } from "~/component/ui/Modal";
import { StyledProps } from "~/type/component/StyledProps";
import { Wve } from "~/type/struct/Wve";

export const useAlert = () => {
  type ModalProps = StyledProps<typeof Modal>;
  const state = Wve.create({
    open: false,
    children: (() => ("")) satisfies ModalProps["children"],
  });
  const open = state.partial("open");
  const children = state.partial("children");

  return {
    props: {
      open,
      get children() { return children(); },
    } satisfies ModalProps,
    show: (p: { children: ModalProps["children"] }) => {
      children.set(p.children);
      open.set(true);
    },
  };
};
