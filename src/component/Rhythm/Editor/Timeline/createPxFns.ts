import { Accessor } from "solid-js";

import { Pos } from "~/type/struct/2d/Pos";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Tempo } from "~/type/struct/music/Tempo";
import { Keyframe, KeyframeNodeKindMap } from "./Keyframe";

/**
 * @example
 * ```
 * const Px = createPxFns(...);
 * ```
 */
export const createPxFns = (p: {
  tempoNodes: KeyframeNodeKindMap<"tempo">[];
  maxScrollPx: number;
  maxTime: number;
  auxiliaryBeat: NoteValue;
}) => {
  const tempoNodes = () => p.tempoNodes;
  const getTempoFromStep = (step: number) =>
    tempoNodes().findLast((it) => it.step <= Math.max(0, step));
  const getTempoFromSeconds = (seconds: number) =>
    tempoNodes().findLast((it) => it.offsetSeconds <= Math.max(0, seconds));
  const getSecondsFromStep = (step: number) => Keyframe.getSecondsFromStep(step, tempoNodes());
  const getPxFromSeconds = (seconds: number): number => seconds / p.maxTime * p.maxScrollPx;

  const getSecondsFromPxPos = (pxPos: Pos): number => {
    const pxFromStart = p.maxScrollPx - pxPos.y;
    const progress = pxFromStart / p.maxScrollPx;
    const progressPx = progress * p.maxTime;
    return progressPx;
  };
  const getStepFromSeconds = (seconds: number): number => {
    const currentTempo = getTempoFromSeconds(seconds);
    if (!currentTempo) throw new Error(`No current tempo found: ${JSON.stringify({ seconds })}`);
    const elapsedSeconds = seconds - currentTempo.offsetSeconds;
    const elapsedStep = elapsedSeconds / Tempo.toBeatSecond(currentTempo);
    return currentTempo.step + elapsedStep;
  };

  const getStepAdjusted = (step: number) => {
    const currentTempo = getTempoFromStep(step);
    if (!currentTempo) throw new Error(`No current tempo found: ${JSON.stringify({ step })}`);
    const auxiliarySeconds = Tempo.getSecondFromNote(currentTempo, p.auxiliaryBeat);
    const auxiliaryStep = auxiliarySeconds / Tempo.toBeatSecond(currentTempo);
    return roundTo(step, auxiliaryStep);
  };

  const getSecondsfromDeltaPxPos = (deltaPxPos: Pos): number => {
    return (deltaPxPos.y * -1 / p.maxScrollPx) * p.maxTime;
  };
  const getStepFromDeltaPxPos = (offsetStep: number, deltaPxPos: Pos): number => {
    const offsetSeconds = getSecondsFromStep(offsetStep);
    const deltaSeconds = getSecondsfromDeltaPxPos(deltaPxPos);
    return getStepFromSeconds(offsetSeconds + deltaSeconds);
  };

  return {
    getStepFromPxPos: (pxPos: Pos) => getStepFromSeconds(getSecondsFromPxPos(pxPos)),
    getPxFromStep: (step: number) => getPxFromSeconds(getSecondsFromStep(step)),
    getStepFromDeltaPxPos,
    getStepAdjusted,

    getPxFromSeconds,
    getSecondsFromStep,
  };
};

export type PxFns = ReturnType<typeof createPxFns>;
export const PxFns = {
  from: (value: Accessor<PxFns>): PxFns => value(),
};

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}
