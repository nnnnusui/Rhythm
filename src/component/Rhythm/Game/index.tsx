import { For } from "solid-js";

import { Note } from "./Note";
import { Score } from "../type/Score";

import styles from "./Game.module.css";

export const Game = (p: {
  timeline: Score["timeline"];
  time: number;
  ghost: boolean;
  duration: number;
}) => {
  const keyframes = () => Object.values(p.timeline.keyframeMap);

  return (
    <div class={styles.Game}
      classList={{ [styles.Ghost]: p.ghost }}
    >
      <span>time: {p.time}</span>
      <span>duration: {p.duration}</span>
      <For each={keyframes()}>{(node) => (
        <p>{JSON.stringify(node)}</p>
      )}</For>
      <Note
        gameTime={p.time}
        gameDuration={p.duration}
        time={3}
        keyframes={[
          {
            offset: -0.5,
            top: "-20%",
          },{
            offset: 0,
            top: "0%",
          },{
            offset: 1,
            top: "80%",
          },{
            offset: 1.5,
            top: "120%",
          },
        ]}
        style={{
          width: "100%",
          height: "1em",
          "background-color": "orange",
        }}
      />
    </div>
  );
};
