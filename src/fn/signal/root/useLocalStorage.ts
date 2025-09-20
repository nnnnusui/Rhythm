import { createEffect, createRoot, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { Objects } from "~/fn/objects";
import { Wve } from "~/type/struct/Wve";

const createLocalStorage = () => {
  if (isServer) return () => Wve.create<Record<string, unknown>>({});
  const storage = Wve.create<Record<string, unknown>>((() => {
    const keyValuePairs = { ...localStorage };
    return Objects.map(keyValuePairs, (value) => {
      return JSON.parse(value);
    }) as Record<string, unknown>;
  })());

  createEffect(() => {
    Objects.entries(storage()).forEach(([key, value]) => {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    });
  });

  const storageEventListener = (event: StorageEvent) => {
    // TODO: Sync `storage` with localStorage changes from other tabs
    //       (currently not implemented)
    console.warn("localStorage was updated in another tab, but this state is not synchronized yet.", event);
  };
  onMount(() => !isServer && window.addEventListener("storage", storageEventListener));
  onCleanup(() => !isServer && window.removeEventListener("storage", storageEventListener));

  return () => storage;
};

/**
 * Root signal for localStorage values, accessible across all SPA routes/components.
 *
 * - Wraps all localStorage key-value pairs in a Wve (solid-store),
 *   enabling reactive access and updates from any route or component.
 * - Changes are immediately reflected in localStorage.
 * - TODO: Sync across tabs is NOT implemented yet. (see `storageEventListener()`)
 *
 * @public
 */
export const useLocalStorage = createRoot(createLocalStorage);
