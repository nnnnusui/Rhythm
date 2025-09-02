import { Id } from "~/type/struct/Id";
import { JudgeArea } from "./JudgeArea";
import { SourceMap } from "../../embed/ResourcePlayer";
import { TimelineKeyframe } from "../Editor/Timeline";

/** @public */
export type Score = {
  id: Id;
  title: string;
  description?: string;
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
    id: Id.new(),
    title: "",
    length: 100,
    sourceMap: {},
    judgeAreaMap: {},
    timeline: {
      keyframeMap: {},
    },
  });

  const from = <T extends Score>(obj: T): Score => {
    return {
      id: obj.id,
      title: obj.title,
      description: obj.description,
      length: obj.length,
      sourceMap: obj.sourceMap,
      judgeAreaMap: obj.judgeAreaMap,
      timeline: {
        keyframeMap: obj.timeline.keyframeMap,
      },
    };
  };

  return {
    init,
    from,
  };
})();
