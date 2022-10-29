import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  on,
  onMount,
  untrack,
} from "solid-js";

import { useGame } from "../../../context/game";
import styles from "./TryJudgeEffect.module.styl";

type Props = {
  isJudged: Accessor<boolean>
}
const TryJudgeEffect: Component<Props> = (props) => {
  const [game] = useGame();
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [_animation, setAnimation] = createSignal<Animation>();
  const [judged, setJudged] = createSignal(untrack(() => props.isJudged()));

  onMount(() => {
    const element = ref();
    if (!element) return;
    const animation
      = element.animate(
        [
          { opacity: 1 },
          { opacity: 0 },
        ],
        {
          duration: 200,
          fill: "both",
        }
      );
    animation.finish();
    setAnimation(animation);
  });
  createEffect(on(
    game.recentJudge,
    () => {
      if (untrack(judged)) return;
      const animation = untrack(_animation);
      if (!animation) return;

      animation.finish();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          animation.play();
        });
      });
      setJudged(untrack(props.isJudged));
    },
    { defer: true }
  ));

  return (
    <div
      ref={setRef}
      class={styles.TryJudgeEffect}
    />
  );
};

export default TryJudgeEffect;
