import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";

import { useGame } from "../../../context/game";
import Type from "../../../context/game/Note";
import styles from "./index.module.styl";
import JudgeEffect from "./JudgeEffect";
import JudgePoint from "./JudgePoint";
import TryJudgeEffect from "./TryJudgeEffect";

const Note: Component<Type> = (props) => {
  const [game] = useGame();
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [animation, setAnimation] = createSignal<Animation>();

  const durationMs = () => game.duration() * 1000;
  const isJudged = () => !!props.judgement();

  createEffect(() => {
    const element = ref();
    if (!element) return;
    const fullDurationMs = durationMs() * 2;
    const animation
      = element.animate(
        props.keyframes(),
        {
          duration: fullDurationMs,
          fill: "both",
        }
      );
    animation.pause();
    setAnimation(animation);
  });
  createEffect(() => {
    const state = animation();
    if (state === undefined) return;
    const untilJudgeMs = props.untilJudge() * 1000;
    state.currentTime = untilJudgeMs + durationMs();
  });
  createEffect(() => {
    if (!isJudged()) return;
    ref()?.classList.add(styles.Disappear);
  });

  return (
    <>
      <Show when={!props.judgement()}>
        <div
          ref={setRef}
          class={styles.Note}
          style={props.noteStyle()}
        />
      </Show>
      <Show when={props.onScreen()}>
        <JudgePoint
          isJudged={isJudged}
          judgePointStyle={props.judgePointStyle}
        >
          <TryJudgeEffect
            judgement={props.judgement}
            isInsideJudgeRect={props.isInsideJudgeRect}
          />
          <JudgeEffect judgement={props.judgement} />
        </JudgePoint>
      </Show>
    </>
  );
};

export default Note;
