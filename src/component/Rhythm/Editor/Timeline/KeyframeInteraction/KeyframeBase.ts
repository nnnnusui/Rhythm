export type KeyframeBase<Kind> = {
  readonly id: string;
  time: number;
  kind: Kind;
};
