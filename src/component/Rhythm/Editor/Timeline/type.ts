import { Tempo } from "~/type/struct/music/Tempo";

/** @public */
export type TimelineNode
  = SourceNode
  | BeatNode;

type TimelineNodeBase<Kind> = {
  readonly id: string;
  kind: Kind;
  time: number;
};

export type SourceNode
  = TimelineNodeBase<"source">
  & {
    sourceId: string;
    action: "play" | "pause";
  };

export type BeatNode
  = TimelineNodeBase<"beat">
  & Tempo;
