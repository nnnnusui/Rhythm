import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import Type from "../../context/game/Note";
import styles from "./Note.module.styl";
import JudgePoint from "./note/JudgePoint";

const Note: Component<Type> = (props) => {
  const [game] = useGame();
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [animation, setAnimation] = createSignal<Animation>();

  const durationMs = () => game.duration() * 1000;

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
        <JudgePoint {...props} />
      </Show>
    </>
  );
};

export default Note;
