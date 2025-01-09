import { SourceMap } from "../../embed/ResourcePlayer";
import { TimelineKeyframe } from "../Editor/Timeline";

/** @public */
export type Score = {
  title: string;
  length: number;
  sourceMap: SourceMap;
  interactionMap: Record<string, {}>;
  timeline: {
    keyframeMap: Record<TimelineKeyframe["id"], TimelineKeyframe>;
  };
};

/** @public */
export const Score = (() => {
  const init = (): Score => ({
    title: "",
    length: 100,
    sourceMap: {},
    interactionMap: {},
    timeline: {
      keyframeMap: {},
    },
  });
  return {
    init,
  };
})();
