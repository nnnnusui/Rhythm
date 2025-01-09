import { Switch, Match } from "solid-js";

import { SourceMap } from "~/component/embed/ResourcePlayer";
import { TempoInteraction } from "~/component/interaction/TempoInteraction";
import { Wve } from "~/type/struct/Wve";
import { EditSource } from "../EditSource";
import { TimelineKeyframe } from "../Timeline";

import styles from "./EditKeyframeDetail.module.css";

export const EditKeyframeDetail = (p: {
  keyframe: Wve<TimelineKeyframe>;
  sourceMap: Wve<SourceMap>;
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
      </Switch>
    </fieldset>
  );
};
