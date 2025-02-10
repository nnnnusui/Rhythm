import { For } from "solid-js";

import { Wve } from "~/type/struct/Wve";

import styles from "./NoteKindSelector.module.css";

export const NoteKindSelector = (p: {
  value: Wve<NoteKind>;
}) => {
  const value = Wve.from(() => p.value);

  return (
    <div class={styles.NoteKind}>
      <span>Kind:</span>
      <div class={styles.KindButtons}>
        <For each={noteKinds}>{(kind) => (
          <button
            type="button"
            class={styles.KindButton}
            classList={{ [styles.Selected]: value() === kind }}
            onClick={() => value.set(kind)}
          >
            <div class={styles.KindIcon}
              data-kind={kind}
            />
            <span class={styles.KindLabel}>{kind}</span>
          </button>
        )}</For>
      </div>
    </div>
  );
};

type NoteKind = "press" | "release" | "trace" | "flick";
const noteKinds: NoteKind[] = ["press", "release", "trace", "flick"];
