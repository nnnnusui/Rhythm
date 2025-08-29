import { createEffect, createRoot, untrack } from "solid-js";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { useAudioContext } from "./useAudioContext";

const createSoundEffectPlayer = () => {
  const sourceMap = Wve.create<Record<Id, AudioBufferSourceNode>>({});
  const audioContext = useAudioContext();

  const notYetLoadedMap = Wve.create<Record<Id, string>>({});
  createEffect(() => {
    // Reload any unread resources once the audioContext is loaded.
    const context = audioContext();
    if (!context) return;
    const reloadMap = untrack(notYetLoadedMap);
    Object.entries(reloadMap)
      .forEach(([id, url]) => storeByFetch(id, url));
  });

  const storeByFetch: SoundEffectPlayer["storeByFetch"] = (id, url) => {
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

  const play: SoundEffectPlayer["play"] = (id, options) => {
    const context = audioContext();
    if (!context) return;
    const sound = sourceMap()[id];
    if (!sound) return;
    const gainNode = context.createGain();
    gainNode.gain.value = 0.6 * (options?.volume ?? 1.0);
    const source = context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start();
  };

  return () => ({
    storeByFetch,
    play,
  });
};

/** @public */
export const useSoundEffectPlayer = createRoot(createSoundEffectPlayer);

type SoundEffectPlayer = {
  storeByFetch: (id: Id, url: string) => void;
  play: (id: Id, options?: { volume: number }) => void;
};
