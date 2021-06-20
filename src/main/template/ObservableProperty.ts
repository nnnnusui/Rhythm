const ObservableProperty = <T>(args: {
  init: T;
  onChange: (next: T, before: T) => void;
}) => {
  let current = args.init;
  args.onChange(current, current);
  return (next?: T): T => {
    if (next === undefined) return current;
    args.onChange(next, current);
    current = next;
    return current;
  };
};

export { ObservableProperty };
