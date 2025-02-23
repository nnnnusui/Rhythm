import { Wve } from "~/type/struct/Wve";
import { KeyframeBase } from "../KeyframeBase";

import styles from "./NoteKeyframe.module.css";

export const NoteKeyframe = (p: {
  keyframe: Wve<NoteKeyframe>;
}) => {
  const judgeKind = () => p.keyframe().judgeKind;

  return (
    <div class={styles.NoteKeyframe}>
      <div
        class={styles.Icon}
        data-kind={judgeKind()}
      />
    </div>
  );
};

type NoteKeyframe
  = KeyframeBase<"note">
  & {
    judgeAreaId: string;
    judgeKind: "press" | "release" | "trace" | "flick";
  };
