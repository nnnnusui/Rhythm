type Source =
  | { kind: "YouTube"; id: string }
  | { kind: "SoundCloud"; id: string };

export type Score = {
  source: Source;
  kind: "lanes";
  amount: number;
  notes: {
    timing: number;
    position: number;
  }[];
};
