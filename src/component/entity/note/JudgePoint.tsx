import {
  Component,
  createEffect,
  createSignal,
  on,
  Show,
  untrack,
} from "solid-js";

import Note from "../../../context/game/Note";
import JudgeEffect from "./JudgeEffect";
import styles from "./JudgePoint.module.styl";
import TryJudgeEffect from "./TryJudgeEffect";

type Props = Note
const JudgePoint: Component<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const beforeJudge
    = !untrack(() => props.judgement());

  createEffect(on(
    () => props.judgement(),
    (judgement) => {
      if (!judgement) return;
      ref()?.classList.add(styles.Disappear);
    },
    { defer: true }
  ));

  return (
    <Show when={beforeJudge}>
      <div
        class={styles.JudgePoint}
      >
        <div
          ref={setRef}
          class={styles.View}
        />
        <TryJudgeEffect isJudged={() => !!props.judgement()} />
        <JudgeEffect {...props} />
      </div>
    </Show>
  );
};

export default JudgePoint;
