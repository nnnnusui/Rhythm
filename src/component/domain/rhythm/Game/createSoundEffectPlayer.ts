import { onMount } from "solid-js";

import { Objects } from "~/fn/objects";
import { useSoundEffectPlayer } from "~/fn/signal/root/useSoundEffectPlayer";

export const createSoundEffectPlayer = (p: {
  volume: number;
}) => {
  const sePlayer = useSoundEffectPlayer();
  const seIdMap = {
    ["judge.perfect"]: "/sound/judgePerfect.wav",
    ["judge.great"]: "/sound/judgeGreat.wav",
    ["tap"]: "/sound/tap.wav",
  };
  onMount(() => {
    Objects.entries(seIdMap)
      .forEach(([key, path]) => {
        sePlayer.storeByFetch(key, path);
      });
  });

  return {
    playJudge: (judgeKind: string) => {
      const targetId = `judge.${judgeKind}`;
      const id = (targetId in seIdMap)
        ? targetId
        : "judge.great";
      sePlayer.play(id, { volume: p.volume });
    },
    playTap: () => sePlayer.play("tap", { volume: p.volume }),
  };
};
