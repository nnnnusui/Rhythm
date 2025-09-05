import { StyledProps } from "~/type/component/StyledProps";
import { Modal } from "../Modal";

import styles from "./ModalStyled.module.css";

/**
 * Modal element with application default styles.
 *
 * This component provides a Modal UI with the default styling of the application.
 * Use this when you want a ready-to-use modal with standard appearance.
 *
 * @public
 */
export const ModalStyled = (p: StyledProps<
  typeof Modal
>) => {

  return (
    <Modal {...p}
      class={styles.ModalStyled}
    >{p.children}</Modal>
  );
};
