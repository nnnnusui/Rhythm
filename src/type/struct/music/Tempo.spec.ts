import { describe, it, expect } from "vitest";

import { NoteValue } from "./NoteValue";
import { Tempo } from "./Tempo";

describe("type Tempo", async () => {
  describe("from()", async () => {
    it("by bpm only", async () => {
      const tempo = Tempo.from(60);

      expect(tempo.bpm).toBe(60);
    });
  });

  describe("toBarSecond()", async () => {
    it("𝅘𝅥=60 4/4 _ 4s", async () => {
      const tempo = Tempo.from({ bpm: 60 });
      const barSec = Tempo.toBarSecond(tempo);

      expect(barSec).toBe(4);
    });

    it("𝅘𝅥=120 4/4 _ 2s", async () => {
      const tempo = Tempo.from({ bpm: 120 });
      const barSec = Tempo.toBarSecond(tempo);

      expect(barSec).toBe(2);
    });

    it("𝅘𝅥=60 6/8 _ 3s", async () => {
      const tempo = Tempo.from({ bpm: 60, timeSignature: NoteValue.from("6/8") });
      const barSec = Tempo.toBarSecond(tempo);

      expect(barSec).toBe(3);
    });

    it("𝅘𝅥.=60 3/4 _ 2s", async () => {
      const tempo = Tempo.from({ bpm: 60, beat: NoteValue.from("1.5/4"), timeSignature: NoteValue.from("3/4") });
      const barSec = Tempo.toBarSecond(tempo);

      expect(barSec).toBe(2);
    });

    it("𝅘𝅥.=120 3/4 _ 1s", async () => {
      const tempo = Tempo.from({ bpm: 120, beat: NoteValue.from("1.5/4"), timeSignature: NoteValue.from("3/4") });
      const barSec = Tempo.toBarSecond(tempo);

      expect(barSec).toBe(1);
    });
  });

  describe("toBeatSecond()", async () => {
    it("𝅘𝅥=60 4/4 _ 1", async () => {
      const tempo = Tempo.from(60);
      const beatSec = Tempo.toBeatSecond(tempo);

      expect(beatSec).toBe(1);
    });

    it("𝅘𝅥.=120 3/4 _ .5s", async () => {
      const tempo = Tempo.from({ bpm: 120, beat: NoteValue.from("1.5/4"), timeSignature: NoteValue.from("3/4") });
      const barSec = Tempo.toBeatSecond(tempo);

      expect(barSec).toBe(0.5);
    });
  });
});
