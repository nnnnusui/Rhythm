import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { Objects } from "~/fn/objects";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Lane } from "./Lane";
import { LatestJudge } from "./LatestJudge";
import { Note } from "./Note";
import { JudgeArea } from "../type/JudgeArea";
import { Score } from "../type/Score";

import styles from "./Game.module.css";

export const Game = (p: {
  score: Score;
  time: number;
  ghost: boolean;
  duration: number;
}) => {
  const keyframes = () => Object.values(p.score.timeline.keyframeMap);
  const judgeAreas = () => Object.values(p.score.judgeAreaMap);
  const lanes = () => judgeAreas(); //.filter((it) => it.kind === "lane");

  const notes = () => keyframes().filter((it) => it.kind === "note")
    .sort((prev, next) => prev.time - next.time);
  const notesMap = () => Object.groupBy(notes(), (it) => it.judgeAreaId);

  const judgeMsMap = {
    perfect: 20,
    great: 60,
    good: 100,
    bad: 125,
    miss: 200,
  };
  const judgedMap = Wve.create<Record<Id, string>>({});
  const state = Wve.create({
    judgeLineMarginBottomPx: 80,
    latestJudge: undefined as string | undefined,
  });
  const judgeLineMarginBottomPx = state.partial("judgeLineMarginBottomPx");
  const latestJudge = state.partial("latestJudge");
  const judgeAreaActiveMap = Wve.create<Record<JudgeArea["id"], boolean>>({});
  const getJudgeAreaFromKey = (key: string) => {
    const keys = "asdjkl".split("");
    const index = keys.indexOf(key);
    if (index === -1) return;
    const lane = lanes()[index];
    return lane;
  };
  const keyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    const lane = getJudgeAreaFromKey(event.key);
    if (!lane) return;
    judgeAreaActiveMap.set(lane.id, true);

    const [judgeTarget] = notesMap()[lane.id]
      ?.flatMap((note) => {
        if (judgedMap()[note.id]) return [];
        const diffMs = Math.abs(note.time - p.time) * 1000;
        const judge = Objects.entries(judgeMsMap)
          .find(([, ms]) => diffMs <= ms)
          ?.[0];
        console.log(note.time, p.time);
        if (judge == null) return [];
        return [{ note, judge }];
      })
      ?? [];
    if (!judgeTarget) return;
    const { note, judge } = judgeTarget;
    judgedMap.set(note.id, judge);
    latestJudge.set(judge);
  };
  const keyUp = (event: KeyboardEvent) => {
    const lane = getJudgeAreaFromKey(event.key);
    if (!lane) return;
    judgeAreaActiveMap.set(lane.id, false);
  };
  onMount(() => {
    if (isServer) return;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
  });
  onCleanup(() => {
    if (isServer) return;
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
  });

  const [playArea, setPlayArea] = createSignal<HTMLElement>();
  const playAreaSize = createElementSize(playArea);
  const playAreaHeight = () => playAreaSize.height ?? 0;

  return (
    <div class={styles.Game}
      classList={{ [styles.Ghost]: p.ghost }}
    >
      <span>time: {p.time}</span>
      <span>duration: {p.duration}</span>
      <For each={keyframes()}>{(node) => (
        <p>{JSON.stringify(node)}</p>
      )}</For>
      <div class={styles.PlayArea}
        ref={setPlayArea}
      >
        <div class={styles.LaneContainer}>
          <For each={lanes()}>{(lane) => (
            <Lane
              judgeLineMarginBottomPx={judgeLineMarginBottomPx()}
              active={judgeAreaActiveMap()[lane.id]}
            >
              <For each={notesMap()[lane.id]}>{(note) => (
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
                  judged={judgedMap.partial(note.id)}
                />
              )}</For>
            </Lane>
          )}</For>
        </div>
        <div class={styles.JudgeLine}
          style={{ "--marginBottom": `${judgeLineMarginBottomPx()}px` }}
        />
        <LatestJudge
          judge={latestJudge()}
        />
      </div>
    </div>
  );
};
