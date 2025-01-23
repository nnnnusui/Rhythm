import { createRoot, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

const createOperated = () => {
  const [operated, setOperated] = createSignal(false);

  const operatedHandler = () => {
    setOperated(true);
    window.removeEventListener("pointerdown", operatedHandler);
  };
  onMount(() => !isServer && window.addEventListener("pointerdown", operatedHandler, { capture: true }));
  onCleanup(() => !isServer && window.removeEventListener("pointerdown", operatedHandler, { capture: true }));

  return () => operated;
};

/** @public */
export const useOperated = createRoot(createOperated);
