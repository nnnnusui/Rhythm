import { Context } from "./Context";
import { Order } from "./Order";

type Source =
  | { kind: "YouTube"; id: string }
  | { kind: "SoundCloud"; id: string };

type Score = {
  source: Source;
  laneAmount: number;
  notes: {
    timing: number;
    position: number;
  }[];
};

const Score = {
  build: (
    args: Omit<Score, "notes"> & {
      order: Order;
      bpm: number;
    }
  ): Score => ({
    ...args,
    notes: Context.generateNotes({
      order: args.order,
      offset: 0,
      division: 1,
      base: 60,
      bpm: args.bpm,
    }),
  }),
};

export { Score };
