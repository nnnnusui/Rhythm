import { Switch, Match } from "solid-js";

import { SourceMap } from "~/component/embed/ResourcePlayer";
import { TempoInteraction } from "~/component/interaction/TempoInteraction";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { JudgeArea } from "../../type/JudgeArea";
import { EditNote } from "../EditNote";
import { EditSource } from "../EditSource";
import { TimelineKeyframe } from "../Timeline";

import styles from "./EditKeyframeDetail.module.css";

export const EditKeyframeDetail = (p: {
  keyframe: Wve<TimelineKeyframe>;
  keyframeMap: Wve<Record<TimelineKeyframe["id"], TimelineKeyframe>>;
  sourceMap: Wve<SourceMap>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const keyframe = Wve.from(() => p.keyframe);

  return (
    <fieldset class={styles.EditKeyframeDetail}>
      <legend>Keyframe Details</legend>
      <Switch>
        <Match when={keyframe.when((it) => it.kind === "source")}>{(source) => (
          <EditSource
            sourceMap={p.sourceMap}
            sourceId={source().partial("sourceId")}
            action={source().partial("action")}
          />
        )}</Match>
        <Match when={keyframe.when((it) => it.kind === "tempo")}>{(tempo) => (
          <TempoInteraction
            tempo={tempo()}
          />
        )}</Match>
        <Match when={keyframe.when((it) => it.kind === "note")}>{(note) => (
          <EditNote
            keyframe={note()}
            keyframeMap={p.keyframeMap}
            judgeAreaMap={p.judgeAreaMap}
          />
        )}</Match>
      </Switch>
    </fieldset>
  );
};
