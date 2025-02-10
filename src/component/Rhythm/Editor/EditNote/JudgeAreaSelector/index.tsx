import { For } from "solid-js";

import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Objects } from "~/fn/objects";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";

import styles from "./JudgeAreaSelector.module.css";

export const JudgeAreaSelector = (p: {
  value: Wve<string>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const value = Wve.from(() => p.value);
  const judgeAreas = () => Objects.values(p.judgeAreaMap())
    .sort((prev, next) => prev.order - next.order);

  return (
    <div class={styles.JudgeArea}>
      <span>JudgeArea:</span>
      <div class={styles.AreaButtons}>
        <For each={judgeAreas()}>{(area) => (
          <button
            type="button"
            class={styles.AreaButton}
            classList={{ [styles.Selected]: value() === area.id }}
            onClick={() => value.set(area.id)}
          >
            <div class={styles.AreaIcon}
              data-order={area.order}
            />
            <span class={styles.AreaLabel}>Lane {area.order + 1}</span>
          </button>
        )}</For>
      </div>
    </div>
  );
};
