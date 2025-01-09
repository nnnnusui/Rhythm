import { describe, it, expect } from "vitest";

import { NoteValue } from "./NoteValue";

describe("type NoteValue", async () => {
  describe("toDecimal()", async () => {
    it("1/4", async () => {
      const note = NoteValue.from(4);
      const decimal = NoteValue.toDecimal(note);

      expect(decimal).toBe(0.25);
    });

    it("0/4", async () => {
      const note = NoteValue.from("0/4");
      const decimal = NoteValue.toDecimal(note);

      expect(decimal).toBe(0);
    });
  });

  describe("+()", async () => {
    it("0/8 + 1/4 = 2/8", async () => {
      const note0_8 = NoteValue.from("0/8");
      const note1_4 = NoteValue.from(4);
      const result = NoteValue["+"](note0_8, note1_4);
      const correct = NoteValue.from("2/8");

      expect(result).toStrictEqual(correct);
    });

    it("2/8 + 1/4 = 4/8", async () => {
      const note2_8 = NoteValue.from("2/8");
      const note1_4 = NoteValue.from(4);
      const result = NoteValue["+"](note2_8, note1_4);
      const correct = NoteValue.from("4/8");

      expect(result).toStrictEqual(correct);
    });

    it("3/8 + 1/4 = 5/8", async () => {
      const note3_8 = NoteValue.from("3/8");
      const note1_4 = NoteValue.from(4);
      const result = NoteValue["+"](note3_8, note1_4);
      const correct = NoteValue.from("5/8");

      expect(result).toStrictEqual(correct);
    });

    it("1.5/4 + 1/8 = 2/4", async () => {
      const note1n5_4 = NoteValue.from("1.5/4");
      const note1_8 = NoteValue.from(8);
      const result = NoteValue["+"](note1n5_4, note1_8);
      const correct = NoteValue.from("2/4");

      expect(result).toStrictEqual(correct);
    });
  });
});
