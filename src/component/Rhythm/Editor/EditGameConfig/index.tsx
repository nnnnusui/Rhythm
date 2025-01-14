import { Wve } from "~/type/struct/Wve";
import { GameConfig } from "../../type/GameConfig";

import styles from "./EditGameConfig.module.css";

export const EditGameConfig = (p: {
  value: Wve<GameConfig>;
}) => {
  const value = Wve.from(() => p.value);
  const offset = value.partial("offset");
  const duration = value.partial("duration");

  return (
    <fieldset class={styles.EditGameConfig}>
      <legend>Game config</legend>
      <label class={styles.Label}>
        <span>offset</span>
        <span>:</span>
        <input class={styles.Offset}
          type="number"
          value={offset()}
          onChange={(event) => offset.set(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={styles.Label}>
        <span>duration</span>
        <span>:</span>
        <input class={styles.Duration}
          type="number"
          value={duration()}
          onChange={(event) => duration.set(event.currentTarget.valueAsNumber)}
        />
      </label>
    </fieldset>
  );
};
