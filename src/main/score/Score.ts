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
  length: number;
};

const Score = {
  build: (
    args: Omit<Score, "notes" | "length"> &
      Order & {
        bpm: number;
      }
  ): Score => {
    const notes = Context.generateNotes({
      order: args,
      offset: 0,
      division: 1,
      base: 60 * 1000,
      bpm: args.bpm,
    });
    return {
      ...args,
      notes,
      length: notes.reverse()[0].timing + 5,
    };
  },
};

export { Score };
