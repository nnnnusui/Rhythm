import { For } from "solid-js";

import { Objects } from "~/fn/objects";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { JudgeArea } from "../../type/JudgeArea";

import styles from "./EditJudgeAreaMap.module.css";

export const EditJudgeAreaMap = (p: {
  judgeAreaMap: Wve<Record<Id, JudgeArea>>;
}) => {
  const judgeAreaMap = Wve.from(() => p.judgeAreaMap);
  const judgeAreas = () => Objects.values(judgeAreaMap());

  const add = () => {
    const id = Id.new();
    judgeAreaMap.set(id, {
      id,
      kind: "lane",
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
        <div>
          {JSON.stringify(judgeArea)}
          <button
            type="button"
            onClick={() => judgeAreaMap.set(judgeArea.id, undefined!)}
          >x</button>
        </div>
      )}</For>
    </fieldset>
  );
};
