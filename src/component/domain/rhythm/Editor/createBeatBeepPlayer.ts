import { createEffect, onMount } from "solid-js";

import { createTimeBasedCache } from "~/fn/signal/createTimeBasedCache";
import { Timer } from "~/fn/signal/createTimer";
import { useSoundEffectPlayer } from "~/fn/signal/root/useSoundEffectPlayer";
import { Beat } from "./Beat";

export const createBeatBeepPlayer = (p: {
  timer: Timer;
  beats: Beat[];
  play: boolean;
  volume: number;
}) => {
  const sePlayer = useSoundEffectPlayer();
  const seIdMap: Record<Beat["kind"], string> = {
    head: "beatBeepPerMeasure",
    bar: "beatBeepPerMeasure",
    tempo: "beatBeepOn",
    auxiliary: "beatBeepOff",
  };
  onMount(() => {
    sePlayer.storeByFetch("beatBeepPerMeasure", "/sound/beatBeepPerMeasure.wav");
    sePlayer.storeByFetch("beatBeepOn", "/sound/beatBeepOn.wav");
    sePlayer.storeByFetch("beatBeepOff", "/sound/beatBeepOff.wav");
  });

  const currentBeat = createTimeBasedCache({
    timer: p.timer,
    get values() { return p.beats; },
  });
  createEffect(() => {
    if (!p.play) return;
    const beat = currentBeat();
    if (!beat) return;
    const seId = seIdMap[beat.kind];
    sePlayer.play(seId, { volume: p.volume });
  });

  return {
    currentBeat,
  };
};
