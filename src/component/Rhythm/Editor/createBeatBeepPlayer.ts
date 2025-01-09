import { createEffect, onCleanup, onMount, untrack } from "solid-js";
import { isServer } from "solid-js/web";

import { useSoundEffect } from "~/fn/context/SoundEffectContext";
import { Timer } from "~/fn/signal/createTimer";
import { Wve } from "~/type/struct/Wve";
import { Beat } from "./Beat";

export const createBeatBeepPlayer = (p: {
  timer: Timer;
  beats: Beat[];
  play: boolean;
}) => {
  const se = useSoundEffect();
  const seIdMap: Record<Beat["kind"], string> = {
    head: "beatBeepPerMeasure",
    bar: "beatBeepPerMeasure",
    tempo: "beatBeepOn",
    auxiliary: "beatBeepOff",
  };
  onMount(() => {
    se.storeByFetch("beatBeepPerMeasure", "/sound/beatBeepPerMeasure.wav");
    se.storeByFetch("beatBeepOn", "/sound/beatBeepOn.wav");
    se.storeByFetch("beatBeepOff", "/sound/beatBeepOff.wav");
  });

  const beats = () => p.beats;

  let hided = true;
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") return;
    hided = true;
  };
  onMount(() => !isServer && document.addEventListener("visibilitychange", onVisibilityChange));
  onCleanup(() => !isServer && document.removeEventListener("visibilitychange", onVisibilityChange));

  const cache = Wve.create<{
    measured: boolean;
    length: number;
    index: number;
    nextMs?: number;
    nextKind?: Beat["kind"];
  }>({
    measured: false,
    length: 0,
    index: -1,
  });
  const cacheNext = (index: number) => {
    const nextBeat = beats()[index + 1];
    cache.set({
      measured: true,
      length: beats().length,
      index,
      nextMs: nextBeat?.time == null
        ? undefined
        : Math.floor(nextBeat.time * 1000),
      nextKind: nextBeat?.kind,
    });
  };

  createEffect(() => {
    if (!p.play) return;
    const timer = p.timer;
    if (!timer.measuring) return cache.set("measured", false);
    const prev = untrack(cache);
    if (hided || !prev.measured || prev.length !== beats().length) {
      hided = false;
      const index = beats().findIndex((it) => timer.current < Math.floor(it.time * 1000));
      cacheNext(index - 1);
      return;
    }
    if (prev.length !== beats().length) return;
    if (prev.nextMs == null) return;
    if (prev.nextKind == null) return;
    if (timer.current < prev.nextMs) return;
    const seId = seIdMap[prev.nextKind];
    se.play(seId, { gain: 0.2 });
    cacheNext(prev.index + 1);
  });

  const currentBeat = () => beats()[cache().index];
  return {
    currentBeat,
  };
};
