import styles from "./NonOperated.module.css";

export const NonOperated = (p: {
  operatedTurnOn: () => void;
}) => {

  return (
    <button class={styles.NonOperated}
      type="button"
      onClick={() => p.operatedTurnOn()}
    >
      "Tap the screen to start."
    </button>
  );
};
