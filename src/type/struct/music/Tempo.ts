import { Objects } from "~/fn/objects";
import { NoteValue } from "./NoteValue";

/**
 * Beat par minutes and time signature.
 *
 * - 𝅘𝅥 =60 4/4: `{ bpm: 60, beat: "1  /4", timeSignature: "4/4" }`
 * - 𝅘𝅥.=60 3/4: `{ bpm: 60, beat: "1.5/4", timeSignature: "3/4" }`
 * @public */
export type Tempo = {
  bpm: number;
  beat: NoteValue;
  timeSignature: NoteValue;
};

/** @public */
export const Tempo = (() => {
  const init = (): Tempo => ({
    bpm: 0,
    beat: NoteValue.from("1/4"),
    timeSignature: NoteValue.from("4/4"),
  });

  const from = <T extends Partial<Tempo>>(from: T | number): Tempo => {
    const _default = init();
    const value = typeof from === "object" ? from : { ...init(), bpm: from };
    return {
      bpm: value.bpm ?? _default.bpm,
      beat: value.beat ?? _default.beat,
      timeSignature: value.timeSignature ?? _default.timeSignature,
    };
  };

  const toString = (tempo: Tempo, options?: { symbolize?: boolean }) => {
    const beat = NoteValue.toString(tempo.beat, options);
    const timeSignature = NoteValue.toString(tempo.timeSignature, options);
    return `${beat}=${tempo.bpm} ${timeSignature}`;
  };

  const isRequired = (partial: Partial<Tempo>): partial is Tempo =>
    Objects.isRequired(partial, { beat: "", bpm: "", timeSignature: "" });

  const whenRequired = (partial: Partial<Tempo>): Tempo | undefined =>
    isRequired(partial) ? partial : undefined;

  const toBarSecond = (tempo: Tempo) => {
    if (!tempo.bpm) return 0;
    const beatParMinuts = tempo.bpm;
    const barPerBeat = NoteValue.toDecimal(tempo.timeSignature) / NoteValue.toDecimal(tempo.beat);
    return barPerBeat * 60 / beatParMinuts;
  };

  const toBarOffsetSecond = (tempo: Tempo, barOffset: number) => {
    if (!tempo.bpm) return 0;
    // const beatParMinuts = tempo.bpm;
    // const barPerBeat = NoteValue.toDecimal(tempo.timeSignature) / NoteValue.toDecimal(tempo.beat);
    // return barPerBeat * 60 / beatParMinuts;
    const diviend = 60 * barOffset * NoteValue.toDecimal(tempo.timeSignature);
    const divisor = tempo.bpm * NoteValue.toDecimal(tempo.beat);
    return diviend / divisor;
  };

  const toBeatSecond = (tempo: Tempo) => {
    const beatPerBar = NoteValue.toDecimal(tempo.beat) / NoteValue.toDecimal(tempo.timeSignature);
    const barSecond = toBarSecond(tempo);
    return barSecond * beatPerBar;
  };

  const getSecondFromNote = (tempo: Tempo, note: NoteValue) => {
    // const notePerBar = NoteValue.toDecimal(note) / NoteValue.toDecimal(tempo.timeSignature);
    // const barSecond = toBarSecond(tempo);
    // return barSecond * notePerBar;
    return NoteValue.toDecimal(note) * toBarSecond(tempo) / NoteValue.toDecimal(tempo.timeSignature);
  };

  return {
    init,
    from,
    toString,
    isRequired,
    whenRequired,
    toBarSecond,
    toBarOffsetSecond,
    toBeatSecond,
    getSecondFromNote,
  };
})();
