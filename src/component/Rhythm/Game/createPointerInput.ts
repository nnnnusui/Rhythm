import { JSX } from "solid-js";

import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { createJudge } from "./createJudge";
import { JudgeArea } from "../type/JudgeArea";

export const createPointerInput = (p: {
  judge: ReturnType<typeof createJudge>;
  playArea: () => HTMLElement | undefined;
  maxOrder: () => number;
  getJudgeAreas: () => JudgeArea[];
  getJudgeAreaMap: () => Record<Id, JudgeArea>;
}) => {
  const getJudgeAreaFromPos = (pos: Pos) => {
    const playAreaWidth = p.playArea()?.clientWidth;
    if (!playAreaWidth) return;
    const order = Math.floor(pos.x * (p.maxOrder() + 1) / playAreaWidth);
    return p.getJudgeAreas()[order];
  };

  const pointerJudgeAreaIdMap = Wve.create<Record<number, Id>>({});

  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    const pos = Pos.fromEvent(event, { relativeTo: p.playArea() });
    const judgeArea = getJudgeAreaFromPos(pos);
    if (!judgeArea) return;
    pointerJudgeAreaIdMap.set(event.pointerId, judgeArea.id);
    p.judge.onPress(judgeArea.id);
  };

  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    const judgeAreaId = pointerJudgeAreaIdMap()[event.pointerId];
    const judgeArea = p.getJudgeAreaMap()[judgeAreaId ?? -1];
    if (!judgeArea) return;
    p.judge.onRelease(judgeArea.id);
  };

  return {
    onPointerDown,
    onPointerUp,
  };
};
