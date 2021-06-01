type Source = { kind: "YouTube"; videoId: string };

export type Score = {
  source: Source;
  kind: "lanes";
  amount: number;
  notes: {
    timing: number;
    position: number;
  }[];
};
