import {
  Component,
  createEffect,
  createSignal,
  on,
} from "solid-js";

import Judgement from "../../../context/game/Judgement";
import styles from "./JudgeEffect.module.styl";

type Props = {
  judgement: () => Judgement
}
const JudgeEffect: Component<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLDivElement>();

  createEffect(on(
    () => props.judgement(),
    (judgement) => {
      if (!judgement) return;
      ref()?.classList.add(styles.Effect);
    },
    { defer: true }
  ));

  return (
    <div
      ref={setRef}
      class={styles.JudgeEffect}
    />
  );
};

export default JudgeEffect;
