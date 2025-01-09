import { Score } from "./type/Score";

export type PerUserStatus = {
  editingScoreMap: Record<ScoreId, Score>;
  editingScoreId?: ScoreId;
};

export const PerUserStatus = (() => {
  const init = (): PerUserStatus => ({
    editingScoreMap: {},
  });

  return {
    init,
  };
})();

export type ScoreId = string;
