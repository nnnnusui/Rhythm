import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";

import { useGame } from "../../context/game";
import Type from "../../context/game/Note";
import styles from "./Note.module.styl";

const Note: Component<Type> = (props) => {
  const [game] = useGame();
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [animation, setAnimation] = createSignal<Animation>();

  const durationMs = () => game.duration() * 1000;
  const progressMs = () => props.progress() * 1000;

  createEffect(() => {
    const element = ref();
    if (!element) return;
    const fullDurationMs = durationMs() * 2;
    const animation
      = element.animate([
        { top: 0 },
        { top: "80%" },
        { top: "160%" },
      ], {
        duration: fullDurationMs,
        delay: props.time(),
        fill: "forwards",
      });
    animation.pause();
    setAnimation(animation);
  });
  createEffect(() => {
    const state = animation();
    if (state === undefined) return;
    state.currentTime = durationMs() - progressMs();
    console.log(state.currentTime);
  });

  return (
    <Show when={!props.judgement()}>
      <div
        ref={setRef}
        class={styles.Note}
      >
        {props.time().toFixed(1)}
      _ {props.progress().toFixed(1)}
      </div>
    </Show>
  );
};

export default Note;
