import { For, Show } from "solid-js";

import { Objects } from "~/fn/objects";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { LaneOption } from "./LaneOption";
import { JudgeArea } from "../../type/JudgeArea";

import styles from "./EditJudgeAreaMap.module.css";

export const EditJudgeAreaMap = (p: {
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const judgeAreaMap = Wve.from(() => p.judgeAreaMap);
  const judgeAreas = () => Objects.values(judgeAreaMap());

  const minOrder = () => 0;
  const maxOrder = () => Math.max(-1, ...judgeAreas().map((it) => it.order));

  const add = () => {
    const id = Id.new();
    judgeAreaMap.set(id, {
      id,
      kind: "lane",
      order: maxOrder() + 1,
    });
  };

  return (
    <fieldset class={styles.EditJudgeAreaMap}>
      <legend>Judge area</legend>
      <button
        type="button"
        onClick={add}
      >add</button>
      <For each={judgeAreas()}>{(judgeArea) => (
        <Show when={judgeAreaMap.partial(judgeArea.id).whenPresent()}>{(judgeArea) => (
          <LaneOption
            judgeArea={judgeArea()}
            minOrder={minOrder()}
            maxOrder={maxOrder()}
          />
        )}</Show>
      )}</For>
    </fieldset>
  );
};
