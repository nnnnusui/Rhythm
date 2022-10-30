import {
  Accessor,
  createEffect,
  createSignal,
  JSX,
  on,
  ParentComponent,
  Show,
  untrack,
} from "solid-js";

import styles from "./JudgePoint.module.styl";

type Props = {
  isJudged: Accessor<boolean>
  judgePointStyle: Accessor<JSX.CSSProperties>
}
const JudgePoint: ParentComponent<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const beforeJudge
    = !untrack(() => props.isJudged());

  createEffect(on(
    () => props.isJudged(),
    (judged) => {
      if (!judged) return;
      ref()?.classList.add(styles.Disappear);
    },
    { defer: true }
  ));

  return (
    <Show when={beforeJudge}>
      <div
        class={styles.JudgePoint}
        style={props.judgePointStyle()}
      >
        <div
          ref={setRef}
          class={styles.View}
        />
        {props.children}
      </div>
    </Show>
  );
};

export default JudgePoint;
