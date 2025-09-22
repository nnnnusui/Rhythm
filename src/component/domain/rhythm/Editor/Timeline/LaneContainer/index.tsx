import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For, Show } from "solid-js";

import { JudgeArea } from "~/component/domain/rhythm/type/JudgeArea";
import { Objects } from "~/fn/objects";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Action } from "../Action";
import { PxFns } from "../createPxFns";
import { Keyframe } from "../Keyframe";
import { KeyframeInteraction } from "../KeyframeInteraction";

import styles from "./LaneContainer.module.css";

export const LaneContainer = (p: {
  keyframeMap: Wve<Record<Keyframe["id"], Keyframe>>;
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
  editAction: Wve<Action>;
  pxFns: PxFns;
}) => {
  const Px = PxFns.from(() => p.pxFns);

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
    editAction.when((it) => it.kind === "move")?.().keyframeIds.includes(keyframeId) ?? false;

  const state = Wve.create<{
    mayBeKeyframe?: Keyframe;
  }>({});
  const mayBeKeyframe = state.partial("mayBeKeyframe");
  const getKeyframeFromEvent = (event: PointerEvent): Keyframe | undefined => {
    const action = editAction();
    if (action.kind !== "insert") return;
    const pos = Pos.fromEvent(event);
    const stepRaw = Px.getStepFromPxPos(pos);
    const step = Px.getStepAdjusted(stepRaw);
    const id = Id.new();
    if (action.keyframe.kind === "note") {
      const judgeArea = getJudgeAreaFromPx(pos);
      if (!judgeArea) return;
      return {
        ...action.keyframe,
        judgeAreaId: judgeArea.id,
        step,
        id,
      };
    } else {
      return {
        ...action.keyframe,
        step,
        id,
      };
    }
  };

  return (
    <div class={styles.LaneContainer}
      style={{
        "--laneCount": `${laneCount()}`,
      }}
    >
      <div class={styles.Lanes}
        ref={setContainer}
        onPointerDown={(event) => {
          event.stopPropagation();
          mayBeKeyframe.set(getKeyframeFromEvent(event));
        }}
        onPointerMove={(event) => {
          mayBeKeyframe.set(getKeyframeFromEvent(event));
        }}
        onPointerUp={(event) => {
          if (mayBeKeyframe()) {
            mayBeKeyframe.set(undefined);
            const keyframe = getKeyframeFromEvent(event);
            if (!keyframe) return;
            keyframeMap.set(keyframe.id, keyframe);
            return;
          }
        }}
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
              pxFns={Px}
              getJudgeAreaFromPx={getJudgeAreaFromPx}
              selected={isSelected(keyframeId)}
              getLaneOrder={(judgeAreaId?: Id) => judgeAreaOrderMap()[judgeAreaId ?? -1]}
            />
          )}</Show>
        )}</For>
        <Show when={mayBeKeyframe.whenPresent()}>{(keyframe) => (
          <KeyframeInteraction
            keyframe={keyframe()}
            action={editAction}
            dragContainer={container()}
            pxFns={Px}
            getJudgeAreaFromPx={getJudgeAreaFromPx}
            selected={false}
            mayBe
            getLaneOrder={(judgeAreaId?: Id) => judgeAreaOrderMap()[judgeAreaId ?? -1]}
          />
        )}</Show>
      </div>
    </div>
  );
};
