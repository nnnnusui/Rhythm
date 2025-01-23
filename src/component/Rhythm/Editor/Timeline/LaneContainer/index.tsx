import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For, JSX, Show } from "solid-js";

import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Objects } from "~/fn/objects";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "../Action";
import { TimeFns } from "../createTimeFns";
import { Keyframe } from "../Keyframe";
import { KeyframeInteraction } from "../KeyframeInteraction";

import styles from "./LaneContainer.module.css";

export const LaneContainer = (p: {
  keyframeMap: Wve<Record<Keyframe["id"], Keyframe>>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
  editAction: Wve<Action>;
  timeFns: TimeFns;
}) => {
  const Time = TimeFns.from(() => p.timeFns);

  const [container, setContainer] = createSignal<HTMLElement>();
  const containerSize = createElementSize(container);

  const keyframeMap = Wve.from(() => p.keyframeMap);
  const judgeAreaMap = Wve.from(() => p.judgeAreaMap);
  const judgeAreaOrderMap = () => Objects.modify(judgeAreaMap(), (entries) => entries.map(([key], index) => ([key, index])));
  const laneCount = () => Objects.keys(judgeAreaOrderMap()).length;
  const getJudgeAreaFromPx = (pos: Pos) => {
    if (!containerSize.width) return;
    if (!laneCount()) return;
    const getLaneOffsetPx = (laneIndex: number) =>
      laneIndex * containerSize.width / laneCount();
    const laneIndex = [...Array(laneCount())].map((_, index) => index)
      .findLast((index) => getLaneOffsetPx(index) <= pos.x);
    if (laneIndex == null) return;
    const judgeArea = Objects.values(judgeAreaMap())[laneIndex];
    return judgeArea;
  };

  const editAction = Wve.from(() => p.editAction);
  const isSelected = (keyframeId: Id) =>
    editAction.when((it) => it.kind === "move")?.().keyframeId === keyframeId;

  const addNote: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    const action = editAction();
    if (action.kind !== "insert") return;
    const pos = Pos.fromEvent(event);
    const timeRaw = Time.fromProgressPxPos(pos);
    const time = Time.toAdjusted(timeRaw);
    const id = Id.new();
    if (action.keyframe.kind === "note") {
      const judgeArea = getJudgeAreaFromPx(pos);
      if (!judgeArea) return;
      const keyframe = {
        ...action.keyframe,
        judgeAreaId: judgeArea.id,
        time,
        id,
      };
      keyframeMap.set(id, keyframe);
    } else {
      const keyframe = {
        ...action.keyframe,
        time,
        id,
      };
      keyframeMap.set(id, keyframe);
    }
    editAction.set(event.pointerType === "mouse" ? { kind: "move" } : Action.init());
  };

  return (
    <div class={styles.LaneContainer}
      style={{
        "--laneCount": `${laneCount()}`,
      }}
    >
      <div class={styles.Lanes}
        ref={setContainer}
        onPointerDown={addNote}
      >
        <For each={Objects.entries(judgeAreaMap())}>{() => (
          <div />
        )}</For>
      </div>
      <div class={styles.Keyframes}>
        <For each={Objects.entries(keyframeMap())}>{([keyframeId]) => (
          <Show when={keyframeMap.partial(keyframeId).whenPresent()}>{(keyframe) => (
            <KeyframeInteraction
              keyframe={keyframe()}
              action={editAction}
              dragContainer={container()}
              timeFns={Time}
              getJudgeAreaFromPx={getJudgeAreaFromPx}
              selected={isSelected(keyframeId)}
              getLaneOrder={(judgeAreaId?: Id) => judgeAreaOrderMap()[judgeAreaId ?? -1]}
            />
          )}</Show>
        )}</For>
      </div>
    </div>
  );
};
