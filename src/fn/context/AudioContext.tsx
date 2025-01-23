import { createContext, JSX, useContext } from "solid-js";
import { isServer } from "solid-js/web";

import { useOperated } from "../signal/root/useOperated";

type Store = () => AudioContext | undefined;
const Context = createContext<Store>();

/** @public */
export const AudioContextProvider = (p: {
  children: JSX.Element;
}) => {
  const operated = useOperated();

  let audioContextCache: AudioContext | undefined;
  const audioContext = () => {
    if (isServer) return;
    if (!operated()) return;
    if (!audioContextCache) return audioContextCache = new AudioContext();
    return audioContextCache;
  };

  return (
    <Context.Provider
      value={audioContext}
    >
      {p.children}
    </Context.Provider>
  );
};

/** @public */
export const useAudioContext = () => {
  const context = useContext(Context);
  if (!context) {
    console.warn("AudioContext is not provided.");
    return undefined!;
  }
  return context;
};
