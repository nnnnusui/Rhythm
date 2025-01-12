import { SourceMap } from "~/component/embed/ResourcePlayer";
import { Wve } from "~/type/struct/Wve";
import { EditKeyframeDetail } from "../EditKeyframeDetail";
import { TimelineAction } from "../Timeline";

import styles from "./EditKeyframeInsert.module.css";

type InsertAction = Extract<TimelineAction, { kind: "insert" }>;
export const EditKeyframeInsert = (p: {
  action: Wve<InsertAction>;
  sourceMap: Wve<SourceMap>;
}) => {
  const action = Wve.from(() => p.action);
  const keyframe = action.partial("keyframe");

  return (
    <fieldset class={styles.EditKeyframeInsert}>
      <legend>Insert</legend>
      <button
        type="button"
        onClick={() => keyframe.set({ kind: "source" })}
        disabled={keyframe().kind === "source"}
      >source</button>
      <button
        type="button"
        onClick={() => keyframe.set({ kind: "tempo" })}
        disabled={keyframe().kind === "tempo"}
      >tempo</button>
      <button
        type="button"
        onClick={() => keyframe.set({ kind: "note" })}
        disabled={keyframe().kind === "note"}
      >note</button>
      <EditKeyframeDetail
        keyframe={keyframe}
        sourceMap={p.sourceMap}
      />
    </fieldset>
  );
};
