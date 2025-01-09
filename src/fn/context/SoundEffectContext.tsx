import { createContext, createEffect, JSX, untrack, useContext } from "solid-js";
import { isServer } from "solid-js/web";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { useOperated } from "./OperatedContext";

type Store = {
  storeByFetch: (id: Id, url: string) => void;
  play: (id: Id, options?: { gain: number }) => void;
};
const Context = createContext<Store>();

/** @public */
export const SoundEffectProvider = (p: {
  children: JSX.Element;
}) => {
  const operated = useOperated();
  const sourceMap = Wve.create<Record<Id, AudioBufferSourceNode>>({});

  let audioContextCache: AudioContext | undefined;
  const getAudioContext = () => {
    if (isServer) return;
    if (!operated()) return;
    if (!audioContextCache) return audioContextCache = new AudioContext();
    return audioContextCache;
  };

  const notYetLoadedMap = Wve.create<Record<Id, string>>({});
  const storeByFetch = (id: Id, url: string) => {
    const context = getAudioContext();
    if (!context) return notYetLoadedMap.set(id, url);
    const source = context.createBufferSource();
    fetch(url).then((response) =>
      response
        .arrayBuffer()
        .then((it) =>
          context.decodeAudioData(it).then((it) => (source.buffer = it)),
        ),
    );
    sourceMap.set(id, source);
  };
  createEffect(() => {
    const context = getAudioContext();
    if (!context) return;
    const reloadMap = untrack(notYetLoadedMap);
    Object.entries(reloadMap)
      .forEach(([id, url]) => storeByFetch(id, url));
  });

  const play: Store["play"] = (id, options) => {
    const context = getAudioContext();
    if (!context) return;
    const sound = sourceMap()[id];
    if (!sound) return;
    const gainNode = context.createGain();
    gainNode.gain.value = options?.gain ?? 0.6;
    const source = context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start();
  };

  return (
    <Context.Provider
      value={{
        storeByFetch,
        play,
      }}
    >
      {p.children}
    </Context.Provider>
  );
};
/** @public */
export const useSoundEffect = () => {
  const context = useContext(Context);
  if (!context) {
    console.warn("AudioContext is not provided.");
    return undefined!;
  }
  return context;
};
