import { Accessor } from "solid-js";

import { Arrays } from "~/fn/arrays";
import { Pos } from "~/type/struct/2d/Pos";
import { Beat } from "../Beat";

/**
 * @example
 * ```
 * const Time = createTimeFns(...);
 * ```
 */
export const createTimeFns = (p: {
  maxScrollPx: number;
  maxTime: number;
  beats: Beat[];
}) => {
  const beats = () => p.beats;
  const validate = (value: number): Time => value as Time;

  const toProgressPx = (time: Time): number => time / p.maxTime * p.maxScrollPx;
  const fromProgressPxPos = (pxPos: Pos): Time => {
    const pxFromStart = p.maxScrollPx - pxPos.y;
    const progress = pxFromStart / p.maxScrollPx;
    const progressPx = progress * p.maxTime;
    return validate(progressPx);
  };
  const fromDeltaPxPos = (deltaPxPos: Pos): Time => {
    const raw = (deltaPxPos.y * -1 / p.maxScrollPx) * p.maxTime;
    return validate(raw);
  };

  const toAdjusted = (raw: Time): Time => {
    const getByBeat = (rawNextTime: number) => {
      const nextBeatIndex = beats().findIndex((it) => rawNextTime < it.time);
      const nextBeat = beats()[nextBeatIndex];
      const prevBeat = beats()[nextBeatIndex - 1];
      if (!prevBeat) return rawNextTime;
      if (!nextBeat) return rawNextTime;
      return Arrays.closest([nextBeat.time, prevBeat.time])(rawNextTime);
    };
    const nextRaw = Math.max(0, Math.min(getByBeat(raw), p.maxTime));
    return validate(nextRaw);
  };

  return {
    validate,
    fromProgressPxPos,
    fromDeltaPxPos,
    toProgressPx,
    toAdjusted,
  };
};

declare const __time__: unique symbol;
export type Time = number & {
  [__time__]: never;
};

export type TimeFns = ReturnType<typeof createTimeFns>;
export const TimeFns = {
  from: (value: Accessor<TimeFns>): TimeFns => value(),
};
