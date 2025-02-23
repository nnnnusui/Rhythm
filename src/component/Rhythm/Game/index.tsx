import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For } from "solid-js";
import type { JSX } from "solid-js";

import { Objects } from "~/fn/objects";
import { Wve } from "~/type/struct/Wve";
import { createJudge } from "./createJudge";
import { createKeyboardInput } from "./createKeyboardInput";
import { createPointerInput } from "./createPointerInput";
import { Lane } from "./Lane";
import { LatestJudge } from "./LatestJudge";
import { Note } from "./Note";
import { Score } from "../type/Score";

import styles from "./Game.module.css";

export const Game = (p: {
  score: Score;
  time: number;
  judgeDelay: number;
  duration: number;
  ghost: boolean;
}) => {
  const keyframes = () => Object.values(p.score.timeline.keyframeMap);
  const judgeAreaMap = () => p.score.judgeAreaMap;
  const judgeAreas = () => Object.values(judgeAreaMap());
  const maxOrder = () => Math.max(...judgeAreas().map((it) => it.order));

  const notes = () => keyframes().filter((it) => it.kind === "note")
    .sort((prev, next) => prev.time - next.time);
  const notesMap = () => Objects.groupBy(notes(), (it) => it.judgeAreaId);

  const state = Wve.create({
    judgeLineMarginBottomPx: 80,
  });
  const judgeLineMarginBottomPx = state.partial("judgeLineMarginBottomPx");

  const [playArea, setPlayArea] = createSignal<HTMLElement>();
  const playAreaSize = createElementSize(playArea);
  const playAreaHeight = () => playAreaSize.height ?? 0;

  const judge = createJudge({
    get time() { return p.time; },
    get judgeDelay() { return p.judgeDelay; },
    get notesMap() { return notesMap(); },
  });

  createKeyboardInput({
    judge,
    getJudgeAreas: judgeAreas,
  });

  const pointer = createPointerInput({
    judge,
    playArea,
    maxOrder,
    getJudgeAreas: judgeAreas,
    getJudgeAreaMap: judgeAreaMap,
  });

  const noteStyle = (judgeKinds: string[]): JSX.CSSProperties => {
    const baseStyle: JSX.CSSProperties = {
      width: "100%",
      height: "1.2em",
      "border-radius": "2px",
      opacity: 0.9,
      transition: "opacity 0.1s ease",
      "background-color": "currentColor",
    };

    // 複数のjudgeKindがある場合は最初のものを使用
    const primaryKind = judgeKinds[0] ?? "";
    switch (primaryKind) {
      case "press":
        return {
          ...baseStyle,
          color: "#FF6B6B",
          "background-image": "linear-gradient(to bottom, transparent 40%, rgba(255, 255, 255, 0.2) 40%)",
          "border-bottom": "0.3em solid rgba(255, 255, 255, 0.3)",
        };
      case "trace":
        return {
          ...baseStyle,
          height: "0.3em",
          "margin-top": "0.45em",
          color: "#4ECDC4",
          "box-shadow": "0 0 0 1px rgba(78, 205, 196, 0.3), 0 0 0 3px rgba(78, 205, 196, 0.1)",
        };
      case "release":
        return {
          ...baseStyle,
          color: "#FFE66D",
          "background-image": "linear-gradient(to top, transparent 40%, rgba(255, 255, 255, 0.2) 40%)",
          "border-top": "0.3em solid rgba(255, 255, 255, 0.3)",
        };
      case "flick":
        return {
          ...baseStyle,
          color: "#FF8B94",
          "background-image": "linear-gradient(to right, transparent 30%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.2) 70%, transparent 70%)",
          "border-right": "0.3em solid rgba(255, 255, 255, 0.3)",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div class={styles.Game}
      classList={{ [styles.Ghost]: p.ghost }}
    >
      <span>time: {p.time}</span>
      <span>duration: {p.duration}</span>
      <span>judgeDelay: {p.judgeDelay}</span>
      <div class={styles.PlayArea}
        ref={setPlayArea}
        onPointerDown={pointer.onPointerDown}
        onPointerUp={pointer.onPointerUp}
        onPointerLeave={pointer.onPointerUp}
        on:touchstart={{ // suppress pinch-in and pinch-out
          handleEvent: (event) => event.preventDefault(),
          passive: false,
        }}
      >
        <div class={styles.LaneContainer}>
          <For each={judgeAreas()}>{(judgeArea) => (
            <Lane
              judgeLineMarginBottomPx={judgeLineMarginBottomPx()}
              active={judge.activeMap()[judgeArea.id]}
            >
              <For each={notesMap()[judgeArea.id]}>{(note) => (
                <Note
                  gameTime={p.time}
                  gameDuration={p.duration}
                  time={note.time}
                  keyframes={[
                    {
                      offset: 0,
                      bottom: `${playAreaHeight() + judgeLineMarginBottomPx()}px`,
                    },{
                      offset: 1,
                      bottom: `${judgeLineMarginBottomPx()}px`,
                    },{
                      offset: 2,
                      bottom: `${-1 * playAreaHeight() + judgeLineMarginBottomPx()}px`,
                    },
                  ]}
                  style={noteStyle(note.judgeKinds)}
                  judged={judge.judgedMap.partial(note.id)}
                />
              )}</For>
            </Lane>
          )}</For>
        </div>
        <div class={styles.JudgeLine}
          style={{ "--marginBottom": `${judgeLineMarginBottomPx()}px` }}
        />
        <LatestJudge
          judge={judge.latestJudge()}
        />
      </div>
    </div>
  );
};
