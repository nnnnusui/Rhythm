import { Objects } from "~/fn/objects";
import { AppConfig } from "./type/AppConfig";
import { GameConfig } from "./type/GameConfig";
import { Score } from "./type/Score";

/** @public */
export type PerUserStatus = {
  editingScoreMap: Record<ScoreId, Score>;
  editingScoreId?: ScoreId;
  gameConfig: GameConfig;
  appConfig: AppConfig;
};

/** @public */
export const PerUserStatus = (() => {
  const init = (): PerUserStatus => {
    return {
      editingScoreMap: {},
      gameConfig: GameConfig.init(),
      appConfig: AppConfig.init(),
    };
  };

  const from = <T extends PerUserStatus>(data: T): PerUserStatus => {
    return {
      ...init(),
      editingScoreMap: Objects.map(data.editingScoreMap, Score.from),
      editingScoreId: data.editingScoreId,
      gameConfig: GameConfig.from(data.gameConfig),
      appConfig: AppConfig.from(data.appConfig),
    };
  };

  return {
    init,
    from,
  };
})();

export type ScoreId = string;
