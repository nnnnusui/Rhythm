type VolumeConfig = {
  master: number;
  music: number;
  effect: number;
};

/** @public */
export const VolumeConfig = (() => {
  const init = (): VolumeConfig => ({
    master: 1,
    music: 1,
    effect: 1,
  });

  const from = <T extends VolumeConfig>(data: T): VolumeConfig => ({
    ...init(),
    master: data.master,
    music: data.music,
    effect: data.effect,
  });

  const getDecimal = (from: VolumeConfig, key: keyof VolumeConfig) => {
    const master = from.master;
    if (key === "master") return master;
    return master * from[key];
  };

  return {
    init,
    from,
    getDecimal,
  };
})();

/** @public */
export type GameConfig = {
  duration: number;
  judgeDelay: number;
  volume: VolumeConfig;
};

/** @public */
export const GameConfig = (() => {
  const init = (): GameConfig => {
    return {
      duration: 1.2,
      judgeDelay: 0,
      volume: VolumeConfig.init(),
    };
  };

  const from = <T extends GameConfig>(data: T): GameConfig => ({
    ...init(),
    duration: data.duration,
    judgeDelay: data.judgeDelay,
    volume: VolumeConfig.from(data.volume),
  });

  return {
    init,
    from,
  };
})();
