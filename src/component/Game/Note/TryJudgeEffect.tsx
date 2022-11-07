import {
  Component,
  createEffect,
  createSignal,
  on,
  onMount,
  untrack,
} from "solid-js";

import { useGame } from "../../../context/game";
import Note from "../../../context/game/Note";
import styles from "./TryJudgeEffect.module.styl";

type Props = {
  judgement: Note.State["judgement"]
  isInsideJudgeRect: Note.Action["isInsideJudgeRect"]
}
const TryJudgeEffect: Component<Props> = (props) => {
  const isJudged = () => !!props.judgement;

  const [game] = useGame();
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [_animation, setAnimation] = createSignal<Animation>();
  const [judged, setJudged] = createSignal(untrack(isJudged));

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
    (recentJudge) => {
      if (untrack(judged)) return;
      const animation = untrack(_animation);
      if (!animation) return;
      if (!recentJudge) return;
      if (!props.isInsideJudgeRect(recentJudge.point())) return;

      animation.finish();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          animation.play();
        });
      });
      setJudged(untrack(isJudged));
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
