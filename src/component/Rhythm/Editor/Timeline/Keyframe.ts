import { Objects } from "~/fn/objects";
import { Tempo } from "~/type/struct/music/Tempo";

export type Keyframe
  = SourceKeyframe
  | TempoKeyframe
  | NoteKeyframe
  ;

export const Keyframe = (() => {
  const toNodes = <T extends Keyframe>(
    keyframes: T[],
    isRequired: (keyframe: T) => keyframe is Required<T>,
  ): Required<T>[] => {
    const init: { prev?: T; sum: Required<T>[] } = { sum: [] };
    return keyframes.reduce(({ prev, sum }, it) => {
      const current = { ...prev, ...it };
      if (isRequired(current)) sum.push(current);
      return { prev: current, sum };
    }, init).sum;
  };

  const toNodeMap = <T extends Keyframe>(
    keyframeMap: Record<Keyframe["id"], T>,
    isRequired: (keyframe: T) => keyframe is Required<T>,
  ): Record<Keyframe["id"], Required<T>> => {
    const keyframes = Objects.values(keyframeMap);
    const nodes = toNodes(keyframes, isRequired);
    const nodeMap = Objects.fromEntries(nodes.map((it) => ([it.id, it])));
    return nodeMap;
  };

  type Id = Keyframe["id"];
  type ToNodes<T extends Keyframe> = (keyframes: T[]) => Required<T>[];
  type ToNodeMap<T extends Keyframe> = (keyframeMap: Record<Id, T>) => Record<Id, Required<T>>;

  const isSourceNode = (it: SourceKeyframe): it is Required<SourceKeyframe> =>
    Objects.isRequired(it, { action: "", sourceId: "" });
  const getSourceNodes: ToNodes<SourceKeyframe> = (keyframes) => toNodes(keyframes, isSourceNode);
  const getSourceNodeMap: ToNodeMap<SourceKeyframe> = (keyframeMap) => toNodeMap(keyframeMap, isSourceNode);

  const isTempoNode = (it: TempoKeyframe): it is Required<TempoKeyframe> =>
    Objects.isRequired(it, { beat: "", bpm: "", timeSignature: "" });
  const getTempoNodes: ToNodes<TempoKeyframe> = (keyframes) => toNodes(keyframes, isTempoNode);
  const getTempoNodeMap: ToNodeMap<TempoKeyframe> = (keyframeMap) => toNodeMap(keyframeMap, isTempoNode);

  return {
    getSourceNodes,
    getSourceNodeMap,
    getTempoNodes,
    getTempoNodeMap,
  };
})();

type KeyframeBase<Kind> = {
  readonly id: string;
  time: number;
  kind: Kind;
};

type SourceKeyframe
  = KeyframeBase<"source">
  & {
    sourceId?: string;
    action?: "play" | "pause";
  };

type TempoKeyframe
  = KeyframeBase<"tempo">
  & Partial<Tempo>;

export type NoteKeyframe
  = KeyframeBase<"note">
  & {
    judgeAreaId?: string;
  };
