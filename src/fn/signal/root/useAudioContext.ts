import { createRoot } from "solid-js";
import { isServer } from "solid-js/web";

import { useOperated } from "./useOperated";

const createAudioContext = () => {
  const operated = useOperated();

  let audioContextCache: AudioContext | undefined;
  const audioContext = () => {
    if (isServer) return;
    if (!operated()) return;
    if (!audioContextCache) return audioContextCache = new AudioContext();
    return audioContextCache;
  };

  return () => audioContext;
};

/** @public */
export const useAudioContext = createRoot(createAudioContext);
