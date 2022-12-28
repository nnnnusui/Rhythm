import {
  Component,
  createEffect,
  createSignal,
  JSX,
  Show,
} from "solid-js";

import styles from "./index.module.styl";

type Props = {
  game: {
    duration: number
    time: number
  }
  time: number
  keyframes: Keyframe[]
  style: JSX.CSSProperties
  judge: {
    style: JSX.CSSProperties
  }
}
const This: Component<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [animation, setAnimation] = createSignal<Animation>();

  const durationMs = () => props.game.duration * 1000;
  const keyframes
    = () => {
      const offsets
        = props.keyframes
          .filter((it) => typeof it.offset === "number")
          .map((it) => it.offset as number);
      const max = Math.max(...offsets);
      const min = Math.min(...offsets);
      const scale = max - min;
      const ratio = 1 / scale;
      const duration = durationMs() * scale;
      const afterJudge = durationMs() * (max - 1);
      const beforeJudge = duration - afterJudge;

      const formattedOffset = (offset: Keyframe["offset"]) => {
        if (typeof offset !== "number") return offset;
        return (offset - min) * ratio;
      };
      const state
        = props.keyframes
          .map((it) => ({
            ...it,
            offset: formattedOffset(it.offset),
          }));
      return {
        state,
        duration,
        afterJudge,
        beforeJudge,
      };
    };

  const untilJudgeMs = () => (props.time - props.game.time) * 1000;
  const sinceJudgeMs = () => -1 * untilJudgeMs();
  const beforeScreen = () => untilJudgeMs() > keyframes().beforeJudge;
  const afterScreen = () => untilJudgeMs() < keyframes().afterJudge * -1;
  const offScreen = () => beforeScreen() || afterScreen();

  createEffect(() => {
    const element = ref();
    if (!element) return;
    const animation
      = element.animate(
        keyframes().state,
        {
          duration: keyframes().duration,
          fill: "both",
        }
      );
    animation.pause();
    setAnimation(animation);
  });
  createEffect(() => {
    const state = animation();
    if (state === undefined) return;
    state.currentTime = sinceJudgeMs() + keyframes().beforeJudge;
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
