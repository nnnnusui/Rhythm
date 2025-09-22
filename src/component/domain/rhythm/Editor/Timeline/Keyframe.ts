import { Objects } from "~/fn/objects";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Tempo } from "~/type/struct/music/Tempo";

export type Keyframe
  = SourceKeyframe
  | TempoKeyframe
  | NoteKeyframe
  ;

export type KeyframeKindMap<Kind extends Keyframe["kind"]>
  = Extract<Keyframe, { kind: Kind }>;

export type KeyframeNodeKindMap<Kind extends Keyframe["kind"]>
  = Required<Extract<Keyframe, { kind: Kind }>>
  & {
    offsetSeconds: number;
  };

type KeyframeNode<T extends Keyframe> = KeyframeNodeKindMap<T["kind"]>;

export const Keyframe = (() => {
  const toRequiredKeyframes = <T extends Keyframe>(
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

  const defaultTempoKeyframe: KeyframeNodeKindMap<"tempo"> = {
    id: "defaultTempoKeyframe",
    step: 0,
    kind: "tempo",
    offsetSeconds: 0,
    ...Tempo.from({ bpm: 60 }),
  };
  const isTempoNode = (it: TempoKeyframe): it is Required<TempoKeyframe> =>
    Objects.isRequired(it, { beat: "", bpm: "", timeSignature: "" });
  const getTempoNodes = (keyframes: TempoKeyframe[]): KeyframeNodeKindMap<"tempo">[] => {
    const init: {
      prev: Required<KeyframeKindMap<"tempo">>;
      sum: KeyframeNodeKindMap<"tempo">[];
      offsetSeconds: number;
    } = { prev: Keyframe.defaultTempoKeyframe, sum: [], offsetSeconds: 0 };
    return toRequiredKeyframes(keyframes, isTempoNode)
      .reduce(({ prev, sum, offsetSeconds }, it) => {
        const elapsed = Tempo.getSecondFromNote(prev, NoteValue["*"](prev.beat, it.step));
        const nextOffsetSeconds = offsetSeconds + elapsed;
        const node = { ...it, offsetSeconds: nextOffsetSeconds };
        sum.push(node);
        return { prev: it, sum, offsetSeconds: nextOffsetSeconds };
      }, init)
      .sum;
  };

  const getSecondsFromStep = (step: number, tempoNodes: KeyframeNodeKindMap<"tempo">[]) => {
    const currentTempo = tempoNodes.findLast((it) => it.step <= Math.max(0, step));
    if (!currentTempo) throw new Error(`No current tempo found: ${JSON.stringify({ step })}`);
    const elapsedStep = step - currentTempo.step;
    const elapsedSeconds = Tempo.getSecondFromNote(currentTempo, NoteValue["*"](currentTempo.beat, elapsedStep));
    return currentTempo.offsetSeconds + elapsedSeconds;
  };

  const toNodes = <T extends Keyframe>(
    keyframes: T[],
    isRequired: (keyframe: T) => keyframe is Required<T>,
    tempoNodes: KeyframeNodeKindMap<"tempo">[],
  ): KeyframeNode<T>[] => {
    return toRequiredKeyframes(keyframes, isRequired)
      .map((it) => ({
        ...it,
        offsetSeconds: getSecondsFromStep(it.step, tempoNodes),
      })) as KeyframeNode<T>[];
  };
  const isSourceNode = (it: SourceKeyframe): it is Required<SourceKeyframe> =>
    Objects.isRequired(it, { action: "", sourceId: "" });
  const isNoteNode = (it: NoteKeyframe): it is Required<NoteKeyframe> => true;

  const init = <Kind extends Keyframe["kind"]>(p: {
    kind: Kind;
  }): Keyframe => {
    const base: KeyframeBase<Kind> = { id: "", step: 0, kind: p.kind };
    switch (base.kind) {
      case "note":
        return NoteKeyframe.init(base);
      default:
        return { ...base } as Extract<Keyframe, { kind: Kind }>;
    }
  };

  const getNodes = (keyframes: Keyframe[]) => {
    const tempoNodes = getTempoNodes([defaultTempoKeyframe, ...keyframes.filter((it) => it.kind === "tempo")]);
    const sourceNodes = toNodes(keyframes.filter((it) => it.kind === "source"), isSourceNode, tempoNodes);
    const noteNodes = toNodes(keyframes.filter((it) => it.kind === "note"), isNoteNode, tempoNodes);
    return { tempoNodes, sourceNodes, noteNodes };
  };

  return {
    getNodes,
    init,
    getTempoNodes,
    getSecondsFromStep,
    defaultTempoKeyframe,
  };
})();

type KeyframeBase<Kind> = {
  readonly id: string;
  step: number;
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

type NoteKeyframe
  = KeyframeBase<"note">
  & {
    judgeAreaId: string;
    judgeKinds: ("press" | "release" | "trace" | "flick")[];
    judgeGroupId?: string;
  };
const NoteKeyframe = (() => {
  const init = (p: Omit<KeyframeBase<"note">, "kind">): NoteKeyframe => {
    return { ...p, kind: "note", judgeAreaId: "", judgeKinds: [] };
  };
  return {
    init,
  };
})();
