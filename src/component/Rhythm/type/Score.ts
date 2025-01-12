import { Id } from "~/type/struct/Id";
import { JudgeArea } from "./JudgeArea";
import { SourceMap } from "../../embed/ResourcePlayer";
import { TimelineKeyframe } from "../Editor/Timeline";

/** @public */
export type Score = {
  title: string;
  length: number;
  sourceMap: SourceMap;
  judgeAreaMap: Record<Id, JudgeArea>;
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
    judgeAreaMap: {},
    timeline: {
      keyframeMap: {},
    },
  });
  return {
    init,
  };
})();
