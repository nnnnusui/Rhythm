import { JudgeArea } from "~/component/Rhythm/type/JudgeArea";
import { Wve } from "~/type/struct/Wve";

import styles from "./LaneOption.module.css";

export const LaneOption = (p: {
  judgeArea: Wve<JudgeArea>;
  minOrder: number;
  maxOrder: number;
}) => {
  const judgeArea = Wve.from(() => p.judgeArea);
  const order = () => judgeArea().order;
  const minOrder = () => p.minOrder;
  const maxOrder = () => p.maxOrder;

  return (
    <div class={styles.LaneOption}>
      <div class={styles.Label}>
        <span>{judgeArea().kind}</span>
        <span>{judgeArea().order}</span>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {}}
          disabled={order() === minOrder()}
        >↑</button>
        <button
          type="button"
          onClick={() => {}}
          disabled={order() === maxOrder()}
        >↓</button>
        <button
          type="button"
          onClick={() => judgeArea.set(undefined!)}
        >x</button>
      </div>
    </div>
  );
};
