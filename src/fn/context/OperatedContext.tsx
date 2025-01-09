import { createContext, createSignal, JSX, onCleanup, onMount, useContext } from "solid-js";
import { isServer } from "solid-js/web";

type Store = () => boolean;
const Context = createContext<Store>();

/** @public */
export const OperatedProvider = (p: {
  children: JSX.Element;
}) => {
  const [operated, setOperated] = createSignal(false);

  const operatedHandler = () => {
    setOperated(true);
    window.removeEventListener("pointerdown", operatedHandler);
  };
  onMount(() => !isServer && window.addEventListener("pointerdown", operatedHandler));
  onCleanup(() => !isServer && window.removeEventListener("pointerdown", operatedHandler));

  return (
    <Context.Provider value={operated}>
      {p.children}
    </Context.Provider>
  );
};

/** @public */
export const useOperated = (): Store => {
  const context = useContext(Context);
  if (!context) {
    console.warn("OperatedContext is not provided.");
    return () => true;
  }
  return context;
};
