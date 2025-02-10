import { Show } from "solid-js";

import { SourceMap } from "~/component/embed/ResourcePlayer";
import { Wve } from "~/type/struct/Wve";
import { EditKeyframeDetail } from "../EditKeyframeDetail";
import { TimelineAction, TimelineKeyframe } from "../Timeline";

import styles from "./EditKeyframeMove.module.css";

type MoveAction = Extract<TimelineAction, { kind: "move" }>;
export const EditKeyframeMove = (p: {
  action: Wve<MoveAction>;
  keyframeMap: Wve<Record<TimelineKeyframe["id"], TimelineKeyframe>>;
  sourceMap: Wve<SourceMap>;
}) => {
  const action = Wve.from(() => p.action);
  const keyframeIds = action.partial("keyframeIds");
  const keyframe = Wve.mayBe(() => {
    const [id] = keyframeIds();
    if (!id) return;
    return p.keyframeMap.partial(id);
  });
  const time = keyframe.partial("time");

  return (
    <fieldset class={styles.EditKeyframeMove}>
      <legend>Selected</legend>
      <sub class={styles.Id}>{keyframe()?.id}</sub>
      <input placeholder="keyframe time"
        type="number"
        value={time()}
        onChange={(event) => time.set(event.currentTarget.valueAsNumber)}
      />
      <Show when={keyframe.when((it) => !!it)}>{(keyframe) => (
        <EditKeyframeDetail
          keyframe={keyframe()}
          sourceMap={p.sourceMap}
        />
      )}</Show>
    </fieldset>
  );
};
