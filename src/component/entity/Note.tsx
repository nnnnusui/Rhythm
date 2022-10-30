import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import Type from "../../context/game/Note";
import styles from "./Note.module.styl";
import JudgeEffect from "./note/JudgeEffect";
import JudgePoint from "./note/JudgePoint";
import TryJudgeEffect from "./note/TryJudgeEffect";

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

  return (
    <>
      <Show when={!props.judgement()}>
        <div
          ref={setRef}
          class={styles.Note}
          style={props.noteStyle()}
        >
          {props.time().toFixed(1)}
          _ {props.untilJudge().toFixed(1)}
        </div>
      </Show>
      <Show when={props.onScreen()}>
        <JudgePoint
          isJudged={isJudged}
          judgePointStyle={props.judgePointStyle}
        >
          <TryJudgeEffect isJudged={isJudged} />
          <JudgeEffect judgement={props.judgement} />
        </JudgePoint>
      </Show>
    </>
  );
};

export default Note;
