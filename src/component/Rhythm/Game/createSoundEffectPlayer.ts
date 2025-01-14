import { onMount } from "solid-js";

import { useSoundEffect } from "~/fn/context/SoundEffectContext";
import { Objects } from "~/fn/objects";

export const createSoundEffectPlayer = () => {
  const se = useSoundEffect();
  const seIdMap = {
    ["judge.perfect"]: "/sound/judgePerfect.wav",
    ["judge.great"]: "/sound/judgeGreat.wav",
    ["tap"]: "/sound/tap.wav",
  };
  onMount(() => {
    Objects.entries(seIdMap)
      .forEach(([key, path]) => {
        se.storeByFetch(key, path);
      });
  });

  return {
    playJudge: (judgeKind: string) => {
      const targetId = `judge.${judgeKind}`;
      const id = (targetId in seIdMap)
        ? targetId
        : "judge.great";
      se.play(id);
    },
    playTap: () => se.play("tap"),
  };
};
