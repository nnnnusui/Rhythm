import { merge } from "ts-deepmerge";

import { Objects } from "~/fn/objects";
import { Score } from "./type/Score";

export type PerUserStatus = {
  editingScoreMap: Record<ScoreId, Score>;
  editingScoreId?: ScoreId;
};

export const PerUserStatus = (() => {
  const init = (base?: PerUserStatus): PerUserStatus => {
    if (!base) return { editingScoreMap: {} };
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
