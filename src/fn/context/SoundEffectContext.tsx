import { createContext, createEffect, JSX, untrack, useContext } from "solid-js";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { useAudioContext } from "../signal/root/useAudioContext";

type Store = {
  storeByFetch: (id: Id, url: string) => void;
  play: (id: Id, options?: { gain: number }) => void;
};
const Context = createContext<Store>();

/** @public */
export const SoundEffectProvider = (p: {
  children: JSX.Element;
}) => {
  const sourceMap = Wve.create<Record<Id, AudioBufferSourceNode>>({});
  const audioContext = useAudioContext();

  const notYetLoadedMap = Wve.create<Record<Id, string>>({});
  const storeByFetch = (id: Id, url: string) => {
    const context = audioContext();
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
    const context = audioContext();
    if (!context) return;
    const reloadMap = untrack(notYetLoadedMap);
    Object.entries(reloadMap)
      .forEach(([id, url]) => storeByFetch(id, url));
  });

  const play: Store["play"] = (id, options) => {
    const context = audioContext();
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
