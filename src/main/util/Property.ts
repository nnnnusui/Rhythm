type Action<T> = T | ((before: T) => T | undefined);
type Accessor<T> = (action?: Action<T>) => T;
type Observer<T> = (args: { next: T; before: T }) => void;
type ObserversStore<T> = {
  add: (value: Observer<T>) => void;
  remove: (target: Observer<T>) => void;
};
type Property<T> = {
  accessor: Accessor<T>;
  observer: ObserversStore<T>;
};

const Property = {
  new: <T>(args: { init: T; observers?: Observer<T>[] }): Property<T> => {
    let current = args.init;
    let observers = args.observers ? args.observers : [];
    const observer: ObserversStore<T> = {
      add: (value) => observers.push(value),
      remove: (target) => (observers = observers.filter((it) => it !== target)),
    };
    const accessor: Accessor<T> = (value) => {
      if (value === undefined) return current;
      const before = current;
      const next = value instanceof Function ? value(before) : value;
      if (next === undefined) return before;
      current = next;
      observers.forEach((it) => it({ next, before }));
    };
    return { accessor, observer };
  },
};
export { Property };
