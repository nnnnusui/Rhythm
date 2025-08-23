import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { TimelineKeyframe } from "../Timeline";
import { JudgeAreaSelector } from "./JudgeAreaSelector";
import { JudgeGroupSelector } from "./JudgeGroupSelector";
import { JudgeKindSelector } from "./JudgeKindSelector";

import styles from "./EditNote.module.css";

export const EditNote = (p: {
  keyframe: Wve<NoteKeyframe>;
  keyframeMap: Wve<Record<TimelineKeyframe["id"], TimelineKeyframe>>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const judgeAreaId = keyframe.partial("judgeAreaId");
  const judgeKinds = keyframe.partial("judgeKinds");

  return (
    <fieldset class={styles.EditNote}>
      <legend>Note</legend>
      <div class={styles.Content}>
        <JudgeAreaSelector
          value={judgeAreaId}
          judgeAreaMap={p.judgeAreaMap}
        />
        <JudgeKindSelector value={judgeKinds} />
        <JudgeGroupSelector
          keyframe={keyframe}
          keyframeMap={p.keyframeMap}
        />
      </div>
    </fieldset>
  );
};

type NoteKeyframe = Extract<TimelineKeyframe, { kind: "note" }>;
