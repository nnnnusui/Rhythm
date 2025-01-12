import styles from "./Lane.module.css";

export const Lane = (p: {
  judgeLineMarginBottomPx: number;
  active: undefined | boolean;
}) => {

  return (
    <div class={styles.Lane}
      classList={{
        [styles.Active]: p.active,
      }}
    >
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
