import { For } from "solid-js";

import { Objects } from "~/fn/objects";
import { Wve } from "~/type/struct/Wve";
import { GameConfig } from "../../type/GameConfig";

import styles from "./EditGameConfig.module.css";

/** @public */
export const EditGameConfig = (p: {
  value: Wve<GameConfig>;
}) => {
  const value = Wve.from(() => p.value);
  const duration = value.partial("duration");
  const judgeDelay = value.partial("judgeDelay");
  const volume = value.partial("volume");

  return (
    <fieldset class={styles.EditGameConfig}>
      <legend>Game config</legend>
      <label class={styles.Label}>
        <span>duration</span>
        <span>:</span>
        <input class={styles.Duration}
          type="number"
          value={duration()}
          onChange={(event) => duration.set(event.currentTarget.valueAsNumber)}
        />
      </label>
      <label class={styles.Label}>
        <span>judgeDelay</span>
        <span>:</span>
        <input class={styles.Offset}
          type="number"
          value={judgeDelay()}
          onChange={(event) => judgeDelay.set(event.currentTarget.valueAsNumber)}
        />
      </label>
      <For each={Objects.keys(volume())}>{(key) => (
        <label class={styles.Label}>
          <span>volume[{key}]</span>
          <span>:</span>
          <div class={styles.RangeInputContainer}>
            <input
              type="number"
              step={0.01}
              value={volume()[key]}
              onChange={(event) => volume.set(key, event.currentTarget.valueAsNumber)}
            />
            <input
              type="range"
              step={0.01}
              max={2}
              min={0}
              value={volume()[key]}
              onChange={(event) => volume.set(key, event.currentTarget.valueAsNumber)}
            />
          </div>
        </label>
      )}</For>
    </fieldset>
  );
};
