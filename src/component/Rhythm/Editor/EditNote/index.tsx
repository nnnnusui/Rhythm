import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { TimelineKeyframe } from "../Timeline";
import { JudgeAreaSelector } from "./JudgeAreaSelector";
import { JudgeKindSelector } from "./JudgeKindSelector";

import styles from "./EditNote.module.css";

export const EditNote = (p: {
  keyframe: Wve<NoteKeyframe>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const judgeAreaId = keyframe.partial("judgeAreaId");
  const judgeKind = keyframe.partial("judgeKind");

  return (
    <fieldset class={styles.EditNote}>
      <legend>Note</legend>
      <div class={styles.Content}>
        <JudgeAreaSelector
          value={judgeAreaId}
          judgeAreaMap={p.judgeAreaMap}
        />
        <JudgeKindSelector value={judgeKind} />
      </div>
    </fieldset>
  );
};

type NoteKeyframe = Extract<TimelineKeyframe, { kind: "note" }>;
