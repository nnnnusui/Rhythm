export type AnimationKeyframes = {
  keyframes: Keyframe[];
  duration: (base: number) => number;
  beforeJudge: (baseDuration: number) => number;
  afterJudge: (baseDuration: number) => number;
};

/**
 * AnimationKeyframes
 * Convert Score's animation information for the Web Animations API.
 *
 * The Web Animations API `Keyframe.offset` can have values between 0 and 1.
 * But `Score...keyframe.offset` is not range limited.
 * The return value also includes a getter to compensate for missing information.
 */
export const AnimationKeyframes = (() => {
  const from = (keyframes: Keyframe[]) => {
    const offsets
      = keyframes
        .filter((it) => typeof it.offset === "number")
        .map((it) => it.offset as number);
    const max = Math.max(...offsets);
    const min = Math.min(...offsets);
    const scale = max - min;
    const ratio = 1 / scale;

    const getNormalizedOffset = (offset: Keyframe["offset"]) => {
      if (typeof offset !== "number") return offset;
      return (offset - min) * ratio;
    };

    const formatted = keyframes
      .map((it) => ({
        ...it,
        offset: getNormalizedOffset(it.offset),
      }));
    const duration = (base: number) => base * scale;
    const afterJudge = (baseDuration: number) => baseDuration * (max - 1);
    const beforeJudge = (baseDuration: number) => duration(baseDuration) - afterJudge(baseDuration);

    return {
      keyframes: formatted,
      duration,
      afterJudge,
      beforeJudge,
    };
  };

  return {
    from,
  };
})();
