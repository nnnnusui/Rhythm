import { createSignal, onMount } from "solid-js";
import { onCleanup } from "solid-js";
import { createEffect } from "solid-js";
import { isServer } from "solid-js/web";

import { Wve } from "~/type/struct/Wve";

/** @public */
export const makePersisted = (options: {
  name: string;
}) => <T>(wve: Wve<T>): Wve<T> => {
  if (isServer) return wve;
  const key = options.name;

  const [loaded, setLoaded] = createSignal(false);
  createEffect(() => {
    if (!loaded()) return;
    const json = JSON.stringify(wve());
    if (key) localStorage.setItem(key, json);
  });

  const storageHandler = (event: StorageEvent) => {
    console.log(event);
  };
  onMount(() => {
    const saved = localStorage.getItem(key);
    if (saved) wve.set(JSON.parse(saved));
    window.addEventListener("storage", storageHandler);
    setLoaded(true);
  });
  onCleanup(() => window.removeEventListener("storage", storageHandler));

  return wve;
};
