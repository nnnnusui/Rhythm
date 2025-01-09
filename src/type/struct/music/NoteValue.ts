/**
 * ### normal
 * - 𝅝 [ 1]: { numerator: 1, denominator:  1 }
 * - 𝅗𝅥 [ 2]: { numerator: 1, denominator:  2 }
 * - 𝅘𝅥 [ 4]: { numerator: 1, denominator:  4 }
 * - 𝅘𝅥𝅮 [ 8]: { numerator: 1, denominator:  8 }
 * - 𝅘𝅥𝅯 [16]: { numerator: 1, denominator: 16 }
 * - 𝅘𝅥𝅰 [32]: { numerator: 1, denominator: 32 }
 *
 * ### dotted
 * - 𝅘𝅥. [4.5 ]: { numerator: 1.5 , denominator: 4 }
 * - 𝅘𝅥𝅭..[4.75]: { numerator: 1.75, denominator: 4 }
 *
 * ### triplet once
 * - triplet by 𝅗𝅥 [1/(2/3)]: { numerator: 1. denominator: [2, 3] }
 * - triplet by 𝅘𝅥 [2/(4/3)]: { numerator: 2. denominator: [4, 3] }
 *
 * @public
 */
export type NoteValue = {
  numerator: number;
  denominator: number[];
};

/** @public */
export const NoteValue = (() => {
  type TimeSignatureStr = `${number}/${number}`;
  const from = <T extends NoteValue>(init: T | number | TimeSignatureStr): NoteValue => {
    if (typeof init === "number") return {
      numerator: 1,
      denominator: [init],
    };
    if (typeof init === "string") {
      const [numerator, denominator] = init.split("/");
      return {
        numerator: Number(numerator),
        denominator: [Number(denominator)],
      };
    }
    return {
      numerator: init.numerator,
      denominator: init.denominator,
    };
  };

  const toDecimal = (note: NoteValue) => {
    if (note.numerator == 0) return 0;
    return note.denominator.reduce((process, it) => {
      return process / it;
    }, note.numerator);
  };

  const toResolution = (note: NoteValue) => {
    const base = from({ ...note, numerator: 1 });
    return toDecimal(base);
  };

  const unicodeValueSymbols = ["𝅝", "𝅗𝅥", "𝅘𝅥", "𝅘𝅥𝅮", "𝅘𝅥𝅯", "𝅘𝅥𝅰", "𝅘𝅥𝅱", "𝅘𝅥𝅲"];
  const unicodeValueSymbolConvertMap = unicodeValueSymbols
    .reduce(({ result, currentValue }, symbol) => {
      result.set(currentValue, symbol);
      const nextValue = currentValue * 2;
      return { result, currentValue: nextValue };
    }, { result: new Map<number, string>(), currentValue: 1 })
    .result;
  const toString = (note: NoteValue, options?: { symbolize?: boolean }) => {
    const symbolized = (() => {
      if (!options?.symbolize) return;
      if (note.denominator.length !== 1) return;
      if (!/^1(?:\.5+)?$/.test(`${note.numerator}`)) return;
      const [denominator] = note.denominator;
      if (!denominator) return;
      const symbol = unicodeValueSymbolConvertMap.get(denominator);
      if (!symbol) return;
      const dotCount = `${note.numerator}`.split("").filter((it) => it === "5").length;
      return symbol + ".".repeat(dotCount);
    })();

    return symbolized
      ?? `${note.numerator}/${note.denominator.join("/")}`;
  };

  const add = (lhs: NoteValue, rhs: NoteValue) => {
    const ratio = toResolution(rhs) / toResolution(lhs);
    return from({
      ...lhs,
      numerator: lhs.numerator + rhs.numerator * ratio,
    });
  };
  const time = (base: NoteValue, num: number) => {
    return from({
      ...base,
      numerator: base.numerator * num,
    });
  };

  return {
    from,
    toDecimal,
    toString,
    ["+"]: add,
    ["*"]: time,
  };
})();
