import { For } from "solid-js";

import { Wve } from "~/type/struct/Wve";
import { KeyframeBase } from "../KeyframeBase";

import styles from "./NoteKeyframe.module.css";

export const NoteKeyframe = (p: {
  keyframe: Wve<NoteKeyframe>;
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

type NoteKeyframe
  = KeyframeBase<"note">
  & {
    judgeAreaId: string;
    judgeKinds: ("press" | "release" | "trace" | "flick")[];
  };
