import { For } from "solid-js";

import { Wve } from "~/type/struct/Wve";

import styles from "./JudgeKindSelector.module.css";

export const JudgeKindSelector = (p: {
  value: Wve<JudgeKind[]>;
}) => {
  const value = Wve.from(() => p.value);

  const toggleKind = (kind: JudgeKind) => {
    const current = value();
    if (current.includes(kind)) {
      value.set(current.filter((it) => it !== kind));
    } else {
      value.set([...current, kind]);
    }
  };

  return (
    <div class={styles.JudgeKind}>
      <span>Kind:</span>
      <div class={styles.KindButtons}>
        <For each={judgeKinds}>{(kind) => (
          <button
            type="button"
            class={styles.KindButton}
            classList={{ [styles.Selected]: value().includes(kind) }}
            onClick={() => toggleKind(kind)}
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
