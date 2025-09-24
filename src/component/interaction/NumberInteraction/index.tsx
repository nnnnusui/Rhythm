import { Wve } from "~/type/struct/Wve";

import styles from "./NumberInteraction.module.css";

export const NumberInteraction = (p: {
  value: Wve<number | undefined>;
}) => {
  const applied = Wve.from(() => p.value);

  return (
    <fieldset class={styles.NumberInteraction}>
      <input
        type="number"
        value={applied()}
        onChange={(event) => {
          const rawValue = event.currentTarget.valueAsNumber;
          const next = Number.isNaN(rawValue) ? undefined : rawValue;
          applied.set(next);
        }}
      />
    </fieldset>
  );
};
