import { merge } from "ts-deepmerge";

import { Objects } from "~/fn/objects";
import { GameConfig } from "./type/GameConfig";
import { Score } from "./type/Score";

/** @public */
export type PerUserStatus = {
  editingScoreMap: Record<ScoreId, Score>;
  editingScoreId?: ScoreId;
  gameConfig: GameConfig;
};

/** @public */
export const PerUserStatus = (() => {
  const init = (base?: PerUserStatus): PerUserStatus => {
    if (!base) return {
      editingScoreMap: {},
      gameConfig: GameConfig.init(),
    };
    return {
      ...base,
      editingScoreMap: Objects.map(base.editingScoreMap,(it) => merge(Score.init(), it)),
    };
  };

  return {
    init,
  };
})();

export type ScoreId = string;
