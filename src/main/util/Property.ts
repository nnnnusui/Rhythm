type Action<T> = T | ((before: T) => T);
type Accessor<T> = (action?: Action<T>) => T;
type Observer<T> = (args: { next: T; before: T }) => void;
type Property<T> = {
  accessor: Accessor<T>;
  observers: Observer<T>[];
};

const Property = {
  new: <T>(args: { init: T; observers?: Observer<T>[] }): Property<T> => {
    let current = args.init;
    let observers = args.observers ? args.observers : [];
    const accessor: Accessor<T> = (value) => {
      if (value !== undefined) {
        const before = current;
        const next = value instanceof Function ? value(before) : value;
        current = next;
        observers.forEach((it) => it({ next, before }));
      }
      return current;
    };
    return { accessor, observers };
  },
};
export { Property };
