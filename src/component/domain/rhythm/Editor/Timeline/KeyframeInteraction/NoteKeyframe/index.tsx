import { For } from "solid-js";

import { Wve } from "~/type/struct/Wve";
import { KeyframeKindMap } from "../../Keyframe";

import styles from "./NoteKeyframe.module.css";

export const NoteKeyframe = (p: {
  keyframe: Wve<KeyframeKindMap<"note">>;
}) => {
  const judgeKinds = () => p.keyframe().judgeKinds;

  return (
    <div class={styles.NoteKeyframe}>
      <For each={judgeKinds()}>{(kind) => (
        <div
          class={styles.Icon}
          data-kind={kind}
        />
      )}</For>
    </div>
  );
};
