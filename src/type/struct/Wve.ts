import { createStore, SetStoreFunction } from "solid-js/store";

import { Objects } from "~/fn/objects";
import { AnyArray } from "../AnyArray";
import { KeyOf } from "../KeyOf";
import { NestedKeyOf } from "../NestedKeyOf";
import { NestedValueOf } from "../NestedValueOf";
import { PartializedTuple } from "../PartializedTuple";
import { ValueOf } from "../ValueOf";

/**
 * Dividable `solid-js/store` wrapper.
 * @public
 */
export type Wve<T> = Atomic<T> & {
  partial: PartialFn<T>;
  filter: FilterFn<T>;
  with: WithFn<T>;
  when: WhenFn<T>;
  whenPresent: WhenPresentFn<T>;
};

/** @public */
export const Wve = (() => {
  const atomicFrom = <T>(get: () => T, set: SetStoreFunction<T>): Atomic<T> =>
    Object.assign(get, { set });

  const completion = <T>(atomic: Atomic<T>): Wve<T> => {
    const wve = atomic as Wve<T>;
    return Object.assign(wve, {
      partial: partial(wve),
      filter: filter(wve),
      with: withFn(wve),
      when: when(wve),
      whenPresent: whenPresent(wve),
    });
  };

  const create = <T extends object>(init: T): Wve<T> => {
    const [get, set] = createStore<T>(init);
    return completion(atomicFrom(() => get, set));
  };

  /**
   * @ts-ignore: overloaded `from()` */
  const from: FromFn = (accessor) => {
    let cache: any;
    const getCached = (reload?: boolean) => {
      if (reload || !cache) cache = accessor();
      return cache;
    };
    const wve = getCached();
    if (wve) return wve;
    const get = () => getCached(true)?.();
    // @ts-ignore: bypass setter args.
    const set = (...args) => getCached()?.set(...args);
    return completion(atomicFrom(get, set));
  };

  const fromSeparated = <T>(get: () => T, set: () => SetStoreFunction<T>): Wve<T> =>
    completion(atomicFrom(get, set()));

  /**
   * @ts-ignore: overloaded `from()` */
  const mayBe = <T>(accessor: () => Wve<T> | undefined): Wve<T | undefined> => {
    const get = () => accessor()?.();
    // @ts-ignore: bypass setter args.
    const set = (...args) => accessor()?.set(...args);
    return completion(atomicFrom(get, set));
  };

  const partial = <T>(wve: Atomic<T>): PartialFn<T> => (...keys) =>
    // @ts-ignore: fold partial.
    completion(keys.reduce((wve, key) => partialOnce(wve, key), wve));

  /**
   * @ts-ignore: overloaded `filter()`. */
  const filter = <T>(wve: Atomic<T>): FilterFn<T> => (predicate) => {
    let filteredCache: any[] | undefined;
    let filteredIndexCache: number[] | undefined;
    const tryCacheFiltered = <T>(array: T[], predicate: (it: T) => boolean) => {
      const filtered = array.filter(predicate);
      if (!filteredCache) {
        filteredCache = filtered;
        filteredIndexCache = array.map((_,index) => index);
      }
      return filtered;
    };
    const get = () => {
      const base = wve();
      if (base == null) return base;
      if (Array.isArray(base)) return tryCacheFiltered(base, predicate);
      return Objects.entries(base)
        .filter(([key, value]) => predicate(value, key, base))
        .reduce((sum, [key]) => {
          return Object.defineProperty(sum, key, {
            get() { return base[key]; },
            enumerable: true,
          });
        }, {});
    };
    // @ts-ignore: wrap setter.
    const set: SetStoreFunction<any[]> = (first, ...args) => {
      const base = wve.set;
      let predicatedCount = 0;
      const arrayFinder = (it: any, index: number, all: any[]) => {
        if (!predicate(it, index, all)) return true;
        if (!filteredCache) tryCacheFiltered(all, predicate);
        const next = first instanceof Function
          ? first(it, predicatedCount, filteredCache)
          : first;
        predicatedCount += 1;
        return next;
      };
      // @ts-ignore: bypass setter args.
      if (args.length !== 0 && first instanceof Function) return base(arrayFinder, ...args);
      // @ts-ignore: bypass setter args.
      if (args.length !== 0 && typeof first === "number") return base(filteredIndexCache[first] ?? first, ...args);
      // @ts-ignore: bypass setter args.
      return base(first, ...args);
    };
    return completion(atomicFrom<any>(get, set));
  };

  const withFn = <T>(wve: Wve<T>): WithFn<T> => (apply) => apply(wve);

  const when = <T>(wve: Wve<T>): WhenFn<T> => (matcher) =>
    // @ts-ignore: wve as Wve<S>
    matcher(wve()) ? wve : undefined;

  const whenPresent = <T>(wve: Wve<T>): WhenPresentFn<T> => () => when(wve)((it) => it != null);

  const as = <To>(accessor: () => Wve<any>): Wve<To> =>
    accessor() as Wve<To>;

  return {
    from,
    fromSeparated,
    create,
    mayBe,
    as,
  };
})();

type Atomic<T> = (() => T) & {
  set: SetStoreFunction<T>;
};
type WhenFn<T> = <S extends T>(matcher: (it: T) => it is S) => Wve<S> | undefined;
type WhenPresentFn<T> = () => Wve<NonNullable<T>> | undefined;
interface FromFn {
  <T>(accessor: () => Wve<T>): Wve<T>;
  <W extends Wve<any> | undefined>(accessor: () => W): W extends Wve<infer T> ? Wve<T | undefined> : never;
}

type PartialFn<T> = <
  Keys extends PartializedTuple<NestedKeyOf<T>>,
>(...keys: Keys) => Wve<NestedValueOf<T, Keys>>;

const partializeSetter = <T, Key extends keyof T>(
  setter: SetStoreFunction<T>,
  finder: any,
): SetStoreFunction<T[Key]> => { // @ts-ignore
  return (...args: unknown[]) => setter(finder, ...args);
};

const partialOnce = <T, Key extends KeyOf<T>>(wve: Atomic<T>, key: Key): Atomic<T[Key]> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const get = () => wve()?.[key];
  const set = partializeSetter<T, Key>(wve.set, key);
  return Object.assign(get, { set }) as Atomic<T[Key]>;
};

type FilterFn<T>
  = T extends AnyArray
    ? FilterFnOfArray<T>
    : FilterFnOfObject<T>;

interface FilterFnOfArray<T> {
  <Guarded extends ValueOf<T>>(
    predicate: (it: ValueOf<T>, index: number, array: T) => it is Guarded,
  ): Wve<Guarded[]>;
  (
    predicate: (it: ValueOf<T>, index: number, array: T) => boolean
  ): Wve<T>;
}

interface FilterFnOfObject<T> {
  <Guarded extends ValueOf<T>>(
    predicate: (value: ValueOf<T>, key: KeyOf<T>, array: T) => value is Guarded,
  ): Wve<Record<KeyOf<T>, Guarded>>;
  (
    predicate: (value: ValueOf<T>, key: KeyOf<T>, array: T) => boolean
  ): Wve<T>;
}

type WithFn<T> = <S extends T>(apply: (wve: Wve<T>) => Wve<S>) => Wve<S>;
