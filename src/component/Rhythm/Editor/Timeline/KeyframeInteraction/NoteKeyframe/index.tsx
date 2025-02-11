import { Wve } from "~/type/struct/Wve";
import { KeyframeBase } from "../KeyframeBase";

import styles from "./NoteKeyframe.module.css";

export const NoteKeyframe = (p: {
  keyframe: Wve<NoteKeyframe>;
}) => {
  const noteKind = () => p.keyframe().noteKind;

  return (
    <div class={styles.NoteKeyframe}>
      <div
        class={styles.Icon}
        data-kind={noteKind()}
      />
    </div>
  );
};

type NoteKeyframe
  = KeyframeBase<"note">
  & {
    judgeAreaId: string;
    noteKind: "press" | "release" | "trace" | "flick";
  };
