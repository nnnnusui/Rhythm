/** @public */
export type GameConfig = {
  duration: number;
  judgeDelay: number;
  volume: VolumeConfig;
};

type VolumeConfig = {
  master: number;
  music: number;
  effect: number;
};

/** @public */
export const VolumeConfig = (() => {
  const getDecimal = (from: VolumeConfig, key: keyof VolumeConfig) => {
    const master = from.master;
    if (key === "master") return master;
    return master * from[key];
  };

  return {
    getDecimal,
  };
})();
