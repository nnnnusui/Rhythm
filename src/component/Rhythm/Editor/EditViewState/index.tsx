import { Wve } from "~/type/struct/Wve";

import styles from "./EditViewState.module.css";

export const EditViewState = (p: {
  mode: Wve<"edit" | "play" | "sourceControl">;
  duration: Wve<number>;
}) => {
  const mode = Wve.from(() => p.mode);
  const duration = Wve.from(() => p.duration);

  return (
    <fieldset class={styles.EditViewState}>
      <legend>View state</legend>
      <label class={styles.Label}>
        <span>duration</span>
        <span>:</span>
        <input
          type="number"
          value={duration()}
          onInput={(event) => duration.set(event.currentTarget.valueAsNumber)}
        />
      </label>
      <div class={styles.ViewMode}>
        <button
          type="button"
          onClick={() => mode.set("sourceControl")}
          disabled={mode() === "sourceControl"}
        >source</button>
        <button
          type="button"
          onClick={() => mode.set("play")}
          disabled={mode() === "play"}
        >play</button>
        <button
          type="button"
          onClick={() => mode.set("edit")}
          disabled={mode() === "edit"}
        >edit</button>
      </div>
    </fieldset>
  );
};
