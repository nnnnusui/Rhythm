import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For } from "solid-js";

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
                  style={{
                    width: "100%",
                    height: "1em",
                    "background-color": "orange",
                  }}
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
