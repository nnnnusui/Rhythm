import Score from "@/type/Score";

type AnimationInfo = {
  keyframes: Keyframe[]
  duration: (base: number) => number
  beforeJudge: (baseDuration: number) => number
  afterJudge: (baseDuration: number) => number
}
/**
 * AnimationInfo
 * Convert Score's animation information for the Web Animations API.
 *
 * The Web Animations API `Keyframe.offset` can have values between 0 and 1.
 * But `Score...keyframe.offset` is not range limited.
 * The return value also includes a getter to compensate for missing information.
 */
const AnimationInfo = (source: Score["notes"][number]["keyframes"]): AnimationInfo => {
  const offsets
    = source
      .filter((it) => typeof it.offset === "number")
      .map((it) => it.offset as number);
  const max = Math.max(...offsets);
  const min = Math.min(...offsets);
  const scale = max - min;
  const ratio = 1 / scale;

  const formattedOffset = (offset: Keyframe["offset"]) => {
    if (typeof offset !== "number") return offset;
    return (offset - min) * ratio;
  };
  const shaped
    = source
      .map((it) => ({
        ...it,
        offset: formattedOffset(it.offset),
      }));

  const duration = (base: number) => base * scale;
  const afterJudge = (baseDuration: number) => baseDuration * (max - 1);
  const beforeJudge = (baseDuration: number) => duration(baseDuration) - afterJudge(baseDuration);

  return {
    keyframes: shaped,
    duration,
    afterJudge,
    beforeJudge,
  };
};

export default AnimationInfo;
