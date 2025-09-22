import { Dates } from "~/fn/dates";
import { Id } from "~/type/struct/Id";
import { JudgeArea } from "./JudgeArea";
import { SourceMap } from "../../embed/ResourcePlayer";
import { TimelineKeyframe } from "../Editor/Timeline";

/** @public */
export type Score = {
  id: Id;
  version: {
    current: string;
  };
  title: string;
  description?: string;
  length: number;
  sourceMap: SourceMap;
  judgeAreaMap: Record<Id, JudgeArea>;
  timeline: {
    keyframeMap: Record<TimelineKeyframe["id"], TimelineKeyframe>;
  };
};

type Version = {
  current: string;
};
const Version = (() => {
  const init = () => ({
    current: Dates.toISO8601WithTimezone(new Date()),
  });

  const from = <T extends Version>(obj: T): Version => ({
    ...init(),
    current: obj.current,
  });

  return {
    init,
    from,
  };
})();

/** @public */
export const Score = (() => {
  const init = (): Score => ({
    id: Id.new(),
    version: Version.init(),
    title: "",
    length: 100,
    sourceMap: {},
    judgeAreaMap: {},
    timeline: {
      keyframeMap: {},
    },
  });

  const from = <T extends Score>(obj: T): Score => {
    const i = init();
    return {
      ...i,
      id: obj.id,
      version: Version.from(obj.version),
      title: obj.title,
      description: obj.description,
      length: obj.length,
      sourceMap: obj.sourceMap,
      judgeAreaMap: obj.judgeAreaMap,
      timeline: {
        ...i.timeline,
        keyframeMap: obj.timeline.keyframeMap,
      },
    };
  };

  return {
    init,
    from,
    Version,
  };
})();
