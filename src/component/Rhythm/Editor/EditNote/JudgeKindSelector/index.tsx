import { For } from "solid-js";

import { Wve } from "~/type/struct/Wve";

import styles from "./JudgeKindSelector.module.css";

export const JudgeKindSelector = (p: {
  value: Wve<JudgeKind>;
}) => {
  const value = Wve.from(() => p.value);

  return (
    <div class={styles.JudgeKind}>
      <span>Kind:</span>
      <div class={styles.KindButtons}>
        <For each={judgeKinds}>{(kind) => (
          <button
            type="button"
            class={styles.KindButton}
            classList={{ [styles.Selected]: value() === kind }}
            onClick={() => value.set(kind)}
          >
            <div
              class={styles.KindIcon}
              data-kind={kind}
            />
            <span class={styles.KindLabel}>{kind}</span>
          </button>
        )}</For>
      </div>
    </div>
  );
};

type JudgeKind = "press" | "release" | "trace" | "flick";
const judgeKinds: JudgeKind[] = ["press", "release", "trace", "flick"];
