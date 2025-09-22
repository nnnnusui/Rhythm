import { createEffect, createSignal, JSX, Show } from "solid-js";

import { Wve } from "~/type/struct/Wve";
import { AnimationKeyframes } from "../AnimationKeyframes";
import { Judge } from "../Judge";

import styles from "./Note.module.css";

export const Note = (p: {
  time: number;
  keyframes: Keyframe[];
  style: JSX.CSSProperties;
  gameTime: number;
  gameDuration: number;
  judged: Wve<undefined | Judge>;
}) => {
  const judged = Wve.from(() => p.judged);

  const [ref, setRef] = createSignal<HTMLDivElement>();
  const [animation, setAnimation] = createSignal<Animation>();
  const keyframes = () => AnimationKeyframes.from(p.keyframes);

  const duration = () => p.gameDuration;
  const untilJudge = () => p.time - p.gameTime;
  const sinceJudge = () => -1 * untilJudge();
  const beforeScreen = () => untilJudge() > keyframes().beforeJudge(duration());
  const afterScreen = () => untilJudge() < -1 * keyframes().afterJudge(duration());
  const offScreen = () => beforeScreen() || afterScreen();

  createEffect(() => {
    const element = ref();
    if (!element) return;
    const animation = element
      .animate(
        keyframes().keyframes,
        {
          duration: keyframes().duration(duration()) * 1000,
          fill: "both",
        },
      );
    animation.pause();
    setAnimation(animation);
  });
  createEffect(() => {
    const state = animation();
    if (state === undefined) return;
    const currentTime = sinceJudge() + keyframes().beforeJudge(duration());
    state.currentTime = currentTime * 1000;
  });

  return (
    <Show when={!(offScreen() || judged())}>
      <div class={styles.Note}
        ref={setRef}
        style={p.style}
      >
        <Show when={judged()}>{(judged) => (
          <span>
            {judged().kind}: {Math.floor(judged().untilSecond * 10000) / 10000}
          </span>
        )}</Show>
      </div>
    </Show>
  );
};
