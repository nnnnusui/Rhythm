import { Accessor } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import { KeyOf } from "../KeyOf";
import { NestedKeyOf } from "../NestedKeyOf";
import { NestedValueOf } from "../NestedValueOf";
import { PartializedTuple } from "../PartializedTuple";

/** @public */
export type Store<T> = [get: T, set: SetStore<T>];
type SetStore<T> = SetStoreFunction<T>;

/** @public */
export const Store = (() => {
  const partializeSetStore = <T, Key extends keyof T>(
    setter: SetStore<T>,
    finder: any,
  ): SetStore<T[Key]> => { // @ts-ignore
    return (...args: unknown[]) => setter(finder, ...args);
  };

  const partialOnce = <T, Key extends KeyOf<T>>(store: Store<T>, key: Key): Store<T[Key]> => {
    return ([store[0][key], partializeSetStore<T, Key>(store[1], key)]);
  };

  const partial: PartialFn = (store) => (...keys) =>
    keys.reduce((it, key) => {
      return partialOnce(it as any, key as never);
    }, store) as any;

  const filter = <T extends unknown[], S extends T[KeyOf<T>] = T[KeyOf<T>]>(
    store: Store<T>,
    predicate: (
      (it: T[KeyOf<T>], index: number, array: T[]) => it is S)
      | ((it: T[KeyOf<T>], index: number, array: T[]) => boolean
    ),
  ): Store<S[]> => {
    const setter: SetStore<S[]> = (first: any, ...args: any) => {
      const base = store[1];
      let predicateCount = 0;
      const finder = (it: S) => {
        const next = first instanceof Function ? first(it, predicateCount) : predicateCount === first;
        predicateCount += 1;
        return next;
      };
      // @ts-ignore
      return base((it, index) => predicate(it, index) && finder(it), ...args);
    };
    // @ts-ignore
    return [store[0].filter(predicate), setter];
  };

  return {
    from: <T>(accessor: Accessor<Store<T>>) => accessor(),
    partial,
    filter,
  };
})();

type PartialFn = <T>(store: Store<T>) => <
  Finders extends PartializedTuple<NestedKeyOf<T>>,
>(...keys: Finders) => Store<NestedValueOf<T, Finders>>;
