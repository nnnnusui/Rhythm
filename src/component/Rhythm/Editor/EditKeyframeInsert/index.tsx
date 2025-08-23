import { SourceMap } from "~/component/embed/ResourcePlayer";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { JudgeArea } from "../../type/JudgeArea";
import { EditKeyframeDetail } from "../EditKeyframeDetail";
import { TimelineAction, TimelineKeyframe } from "../Timeline";

import styles from "./EditKeyframeInsert.module.css";

type InsertAction = Extract<TimelineAction, { kind: "insert" }>;
export const EditKeyframeInsert = (p: {
  action: Wve<InsertAction>;
  keyframeMap: Wve<Record<TimelineKeyframe["id"], TimelineKeyframe>>;
  sourceMap: Wve<SourceMap>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const action = Wve.from(() => p.action);
  const keyframe = action.partial("keyframe");

  return (
    <fieldset class={styles.EditKeyframeInsert}>
      <legend>Insert</legend>
      <button
        type="button"
        onClick={() => keyframe.set(TimelineKeyframe.init({ kind: "source" }))}
        disabled={keyframe().kind === "source"}
      >source</button>
      <button
        type="button"
        onClick={() => keyframe.set(TimelineKeyframe.init({ kind: "tempo" }))}
        disabled={keyframe().kind === "tempo"}
      >tempo</button>
      <button
        type="button"
        onClick={() => keyframe.set(TimelineKeyframe.init({ kind: "note" }))}
        disabled={keyframe().kind === "note"}
      >note</button>
      <EditKeyframeDetail
        keyframe={keyframe}
        keyframeMap={p.keyframeMap}
        sourceMap={p.sourceMap}
        judgeAreaMap={p.judgeAreaMap}
      />
    </fieldset>
  );
};
