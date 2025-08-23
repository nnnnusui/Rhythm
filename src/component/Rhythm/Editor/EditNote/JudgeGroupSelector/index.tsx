import { For, createMemo } from "solid-js";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { TimelineKeyframe } from "../../Timeline";

import styles from "./JudgeGroupSelector.module.css";

export const JudgeGroupSelector = (p: {
  keyframe: Wve<NoteKeyframe>;
  keyframeMap: Wve<Record<TimelineKeyframe["id"], TimelineKeyframe>>;
}) => {
  const keyframe = Wve.from(() => p.keyframe);
  const judgeGroupId = keyframe.partial("judgeGroupId");

  const existingGroupIds = createMemo(() => {
    const currentTime = keyframe().time;
    return Object.values(p.keyframeMap())
      .filter((kf): kf is NoteKeyframe =>
        kf.kind === "note"
        && kf.judgeGroupId != null,
      )
      .sort((a, b) =>
        Math.abs(a.time - currentTime) - Math.abs(b.time - currentTime),
      )
      .map((kf) => kf.judgeGroupId!);
  });

  const createNewGroup = () => {
    judgeGroupId.set(Id.new());
  };

  return (
    <div class={styles.JudgeGroup}>
      <span>Judge Group:</span>
      <div class={styles.Controls}>
        <select
          class={styles.GroupSelect}
          value={judgeGroupId() ?? ""}
          onChange={(e) => judgeGroupId.set(e.currentTarget.value || undefined)}
        >
          <option value="">No Group</option>
          <For each={[...new Set(existingGroupIds())]}>{(groupId) => (
            <option value={groupId}>
              {groupId}
            </option>
          )}</For>
        </select>
        <button
          type="button"
          class={styles.NewGroupButton}
          onClick={createNewGroup}
          title="Create New Group"
        >
          +
        </button>
      </div>
    </div>
  );
};

type NoteKeyframe = Extract<TimelineKeyframe, { kind: "note" }>;
