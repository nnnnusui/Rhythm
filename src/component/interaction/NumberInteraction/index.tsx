import { Wve } from "~/type/struct/Wve";

import styles from "./NumberInteraction.module.css";

export const NumberInteraction = (p: {
  value: Wve<number>;
}) => {
  const applied = Wve.from(() => p.value);

  return (
    <fieldset class={styles.NumberInteraction}>
      <input
        type="number"
        onChange={(event) => applied.set(event.currentTarget.valueAsNumber)}
      />
    </fieldset>
  );
};
