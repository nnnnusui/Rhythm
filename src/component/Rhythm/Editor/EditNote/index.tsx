import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { TimelineKeyframe } from "../Timeline";
import { JudgeAreaSelector } from "./JudgeAreaSelector";
import { NoteKindSelector } from "./NoteKindSelector";

import styles from "./EditNote.module.css";

export const EditNote = (p: {
  keyframe: Wve<NoteKeyframe>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const judgeAreaId = keyframe.partial("judgeAreaId");
  const noteKind = keyframe.partial("noteKind");

  return (
    <fieldset class={styles.EditNote}>
      <legend>Note</legend>
      <div class={styles.Content}>
        <JudgeAreaSelector
          value={judgeAreaId}
          judgeAreaMap={p.judgeAreaMap}
        />
        <NoteKindSelector value={noteKind} />
      </div>
    </fieldset>
  );
};

type NoteKeyframe = Extract<TimelineKeyframe, { kind: "note" }>;
