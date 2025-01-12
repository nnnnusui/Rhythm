import { NoteValue } from "~/type/struct/music/NoteValue";
import { Tempo } from "~/type/struct/music/Tempo";

export type Beat = {
  kind: "head" | "bar" | "tempo" | "auxiliary";
  time: number;
  barIndex: number;
  offsetInBar: NoteValue;
  duration: NoteValue;
};

export const Beat = (() => {
  const init = (): Beat => ({
    kind: "head",
    time: 0,
    barIndex: 0,
    offsetInBar: NoteValue.from("0/4"),
    duration: NoteValue.from("1/4"),
  });

  const fromTempos = (temposWithTime: (Tempo & { time: number })[], maxSecond: number, auxiliaryBeat: NoteValue) => {
    return temposWithTime
      .sort((prev, next) => prev.time - next.time)
      .flatMap((tempo, index, all) => {
        const next = all[index + 1];
        const _maxTime = (next?.time ?? maxSecond) - tempo.time;
        return Beat.fromTempo(tempo, _maxTime, auxiliaryBeat)
          .map((it) => ({ ...it, time: tempo.time + it.time }));
      });
  };

  const fromTempo = (tempo: Tempo, maxSecond: number, auxiliaryBeat: NoteValue) => {
    const barSecond = Tempo.toBarSecond(tempo);
    const tempoSecond = Tempo.toBeatSecond(tempo);
    const auxiliarySecond = Tempo.getSecondFromNote(tempo, auxiliaryBeat);
    const getOffsetFn = (base: number) => (index: number) => index * base;
    const secondsWithKind: SecondWithKind[] = [
      { kind: "head", second: maxSecond, noteValue: undefined, getOffset: getOffsetFn(maxSecond) },
      { kind: "bar", second: barSecond, noteValue: undefined, getOffset: (barOffset) => Tempo.toBarOffsetSecond(tempo, barOffset) },
      { kind: "tempo", second: tempoSecond, noteValue: tempo.beat, getOffset: getOffsetFn(tempoSecond) },
      { kind: "auxiliary", second: auxiliarySecond, noteValue: auxiliaryBeat, getOffset: getOffsetFn(auxiliarySecond) },
    ];

    const baseSeconds = secondsWithKind
      .reduceRight((sum, it) => {
        // reject smaller values in between.
        const [prev] = sum;
        if (prev && prev.second > it.second) return sum;
        if (!it.second) return sum;
        return [it, ...sum];
      }, [] as SecondWithKind[]);

    const withCounts
      = baseSeconds
        .flatMap((it, index, all) => {
          const prev = all[index - 1];
          if (!prev) return [{ ...it, count: 1 }];
          const count = Math.ceil(prev.second / it.second);
          if (count <= 1) return [];
          return [{ ...it, count }];
        });

    const beats = withCounts.reduce((prevResoluted, resolution) => {
      const baseBeats = prevResoluted.length === 0
        ? [{ ...init(), kind: resolution.kind }]
        : prevResoluted;
      return baseBeats.flatMap((beat) => {
        const offset = beat.time;
        return [...Array(resolution.count)].flatMap((_, index) => {
          const time = offset + resolution.getOffset(index);
          if (maxSecond <= time) return [];
          const barIndex = resolution.kind === "bar" ? index : beat.barIndex;
          const offsetInBar = resolution.noteValue
            ? NoteValue["+"](NoteValue["*"](resolution.noteValue, index), beat.offsetInBar)
            : undefined;
          const next: Beat = {
            kind: index === 0 ? beat.kind : resolution.kind,
            time,
            barIndex,
            offsetInBar: offsetInBar ?? NoteValue.from("0/4"),
            duration: resolution.noteValue ?? NoteValue.from("0/4"),
          };
          return [next];
        });
      });
    }, [] as Beat[]);

    return beats;
  };

  return {
    fromTempos,
    fromTempo,
  };
})();

type SecondWithKind = {
  kind: Beat["kind"];
  second: number;
  noteValue: NoteValue | undefined;
  getOffset: (index: number) => number;
};
