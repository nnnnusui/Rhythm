import { Wve } from "~/type/struct/Wve";
import { Score } from "../../type/Score";

import styles from "./EditScoreInfo.module.css";

export const EditScoreInfo = (p: {
  score: Wve<Score>;
}) => {
  const score = Wve.from(() => p.score);

  return (
    <fieldset class={styles.EditScoreInfo}>
      <label class={styles.Label}>
        <span>title</span>
        <span>:</span>
        <input class={styles.Input}
          type="text"
          value={score().title}
          onChange={(event) => score.set("title", event.currentTarget.value)}
        />
      </label>
      <label class={styles.Label}>
        <span>length</span>
        <span>:</span>
        <input class={styles.Input}
          type="number"
          value={score().length}
          onChange={(event) => score.set("length", event.currentTarget.valueAsNumber)}
        />
      </label>
      <div class={styles.Label}>
        <span>version[current]</span>
        <span>:</span>
        <div class={styles.CurrentVersionInputBox}>
          <button
            onClick={() => {
              score.set("version", "current", Score.Version.init().current);
            }}
          >↻</button>
          <input class={styles.Input}
            type="text"
            value={score().version.current}
            readOnly
          />
        </div>
      </div>
    </fieldset>
  );
};
