import { captureStoreUpdates } from "@solid-primitives/deep";
import { batch, createSignal, onMount, untrack } from "solid-js";
import { createEffect } from "solid-js";
import { isServer } from "solid-js/web";

import { useLocalStorage } from "~/fn/signal/root/useLocalStorage";
import { Wve } from "~/type/struct/Wve";

/**
 * Modifier to persist a signal's value to localStorage and restore it on page reload.
 *
 * - Synchronizes the signal with localStorage under the given key.
 * - On page load, restores the value from localStorage if present.
 *
 * @example
 * const status = Wve.create(false)
 *   .with(makePersisted({ name: "darkMode" }));
 *
 * @public
 */
export const makePersisted = <T>(options: {
  name: string;
  init?: (it: T) => T;
}) => (wve: Wve<T>): Wve<T> => {
  if (isServer) return wve;
  const key = options.name;
  const init = options.init ?? ((it) => it);
  const persistentStorage = useLocalStorage().partial(key) as Wve<T | undefined>;

  const [loaded, setLoaded] = createSignal(false);
  createEffect(() => {
    if (!untrack(loaded)) return;
    if (!key) return;
    persistentStorage.set(wve());
  });

  onMount(() => {
    const saved = persistentStorage();
    if (saved) wve.set(init(saved));
    setLoaded(true);
  });

  const updateFromPersisted = () => {
    if (!untrack(loaded)) return;
    const saved = persistentStorage();
    if (!saved) return;
    const getPersistedDelta = captureStoreUpdates(saved);
    const deltas = getPersistedDelta();
    batch(() => {
      deltas.forEach(({ path, value }) => {
        wve.partial(...path as any).set(value as any);
      });
    });
  };
  createEffect(updateFromPersisted);

  return wve;
};
