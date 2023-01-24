import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";

import styles from "./index.module.styl";

import { NoteState } from "@/state/createNoteStore";

type Props = {
  game: {
    duration: number
    time: number
  }
} & NoteState
const This: Component<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [animation, setAnimation] = createSignal<Animation>();

  const durationMs = () => props.game.duration * 1000;

  const untilJudgeMs = () => (props.time - props.game.time) * 1000;
  const sinceJudgeMs = () => -1 * untilJudgeMs();
  const beforeScreen = () => untilJudgeMs() > props.animation.beforeJudge(durationMs());
  const afterScreen = () => untilJudgeMs() < -1 * props.animation.afterJudge(durationMs());
  const offScreen = () => beforeScreen() || afterScreen();

  createEffect(() => {
    const element = ref();
    if (!element) return;
    const animation
      = element.animate(
        props.animation.keyframes,
        {
          duration: props.animation.duration(durationMs()),
          fill: "both",
        }
      );
    animation.pause();
    setAnimation(animation);
  });
  createEffect(() => {
    const state = animation();
    if (state === undefined) return;
    state.currentTime = sinceJudgeMs() + props.animation.beforeJudge(durationMs());
  });

  return (
    <Show when={!offScreen()}>
      <div
        ref={setRef}
        class={styles.Root}
        style={props.style}
      />
    </Show>
  );
};

export default This;
