export const nArrayConverter =
  <Empty, Value, Array>(args: {
    empty: Empty;
    onValue: (it: unknown) => Value;
    onArray: (it: (Empty | Value | Array)[]) => Array;
  }) =>
  (...values: unknown[]) => {
    const recursion = (value: unknown): Empty | Value | Array => {
      if (!Array.isArray(value)) return args.onValue(value);
      if (value.length === 0) return args.empty;
      return args.onArray(value.map((it) => recursion(it)));
    };
    return args.onArray(values.map((it) => recursion(it)));
  };
