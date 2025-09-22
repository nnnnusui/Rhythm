import { JSX } from "solid-js";

import styles from "./Lane.module.css";

export const Lane = (p: {
  children?: JSX.Element;
  judgeLineMarginBottomPx: number;
  active: undefined | boolean;
}) => {

  return (
    <div class={styles.Lane}
      classList={{
        [styles.Active]: p.active,
      }}
    >
      {p.children}
      <div
        class={styles.ActiveIndicator}
        classList={{
          [styles.Active]: p.active,
        }}
        style={{ "--marginBottom": `${p.judgeLineMarginBottomPx}px` }}
      />
    </div>
  );
};
