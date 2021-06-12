import { Source } from "../source/Source";
import { Context } from "./Context";
import { Order } from "./Order";

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
    args: Omit<Score, "notes"> &
      Order & {
        bpm: number;
      }
  ): Score => ({
    ...args,
    notes: Context.generateNotes({
      order: args,
      offset: 0,
      division: 1,
      base: 60,
      bpm: args.bpm,
    }),
  }),
};

export { Score };
