import { Accessor, createSignal, Setter, Signal, untrack } from "solid-js";

export const makeWithMayBe = <T>(
  [get, _set]: Signal<T>,
): WithMayBe<T> => {
  const [mayBe, setMayBe] = createSignal<T>(untrack(get));
  const [confirmed, setConfirmed] = createSignal(true);

  // const set: Setter<T> = (...args) => _set(...args);

  return [
    Object.assign(get, {
      get mayBe() { return mayBe(); },
      get confirmed() { return confirmed(); },
    }),
    Object.assign(_set, {
      mayBe: setMayBe,
      confirmed: setConfirmed,
    }),
  ];
};

type WithMayBe<T> = [
  Accessor<T> & {
    mayBe: T;
    confirmed: boolean;
  },
  Setter<T> & {
    mayBe: Setter<T>;
    confirmed: Setter<boolean>;
  },
];
