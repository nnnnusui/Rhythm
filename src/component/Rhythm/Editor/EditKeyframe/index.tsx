import { Match, Switch } from "solid-js";

import { SourceMap } from "~/component/embed/ResourcePlayer";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { JudgeArea } from "../../type/JudgeArea";
import { EditKeyframeInsert } from "../EditKeyframeInsert";
import { EditKeyframeMove } from "../EditKeyframeMove";
import { TimelineAction, TimelineKeyframe } from "../Timeline";

import styles from "./EditKeyframe.module.css";

export const EditKeyframe = (p: {
  action: Wve<TimelineAction>;
  keyframeMap: Wve<Record<TimelineKeyframe["id"], TimelineKeyframe>>;
  sourceMap: Wve<SourceMap>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const action = Wve.from(() => p.action);

  return (
    <fieldset class={styles.EditKeyframe}>
      <legend>Timeline action</legend>
      <div class={styles.ModeSelect}>
        <button
          type="button"
          onClick={() => action.set(TimelineAction.fromKind("none"))}
          disabled={action().kind === "none"}
        >none</button>
        <button
          type="button"
          onClick={() => action.set(TimelineAction.fromKind("move"))}
          disabled={action().kind === "move"}
        >move</button>
        <button
          type="button"
          onClick={() => action.set(TimelineAction.fromKind("insert"))}
          disabled={action().kind === "insert"}
        >insert</button>
      </div>
      <Switch>
        <Match when={action.when((it) => it.kind === "insert")}>{(insert) => (
          <EditKeyframeInsert
            action={insert()}
            sourceMap={p.sourceMap}
            judgeAreaMap={p.judgeAreaMap}
          />
        )}</Match>
        <Match when={action.when((it) => it.kind === "move")}>{(move) => (
          <EditKeyframeMove
            action={move()}
            keyframeMap={p.keyframeMap}
            sourceMap={p.sourceMap}
            judgeAreaMap={p.judgeAreaMap}
          />
        )}</Match>
      </Switch>
    </fieldset>
  );
};
