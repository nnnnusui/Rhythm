import { createElementSize } from "@solid-primitives/resize-observer";
import { createSignal, For, JSX, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { Objects } from "~/fn/objects";
import { Pos } from "~/type/struct/2d/Pos";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Judge } from "./Judge";
import { Lane } from "./Lane";
import { LatestJudge } from "./LatestJudge";
import { Note } from "./Note";
import { JudgeArea } from "../type/JudgeArea";
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
  const notesMap = () => Object.groupBy(notes(), (it) => it.judgeAreaId);

  const judgeMsMap = {
    perfect: 40,
    great: 100,
    good: 160,
    bad: 210,
    miss: 240,
  };
  const judgedMap = Wve.create<Record<Id, Judge>>({});
  const state = Wve.create({
    judgeLineMarginBottomPx: 80,
    latestJudge: undefined as Judge | undefined,
  });
  const judgeLineMarginBottomPx = state.partial("judgeLineMarginBottomPx");
  const latestJudge = state.partial("latestJudge");
  const judgeAreaActiveMap = Wve.create<Record<JudgeArea["id"], boolean>>({});

  const onJudge = (judgeAreaId: string) => {
    const [judgeTarget] = notesMap()[judgeAreaId]
      ?.flatMap((note) => {
        if (judgedMap()[note.id]) return [];
        const untilSecond = p.judgeDelay + note.time - p.time;
        const diffMs = Math.abs(untilSecond) * 1000;
        const judgeKind = Objects.entries(judgeMsMap)
          .find(([, ms]) => diffMs <= ms)
          ?.[0];
        if (judgeKind == null) return [];
        const judge: Judge = {
          kind: judgeKind,
          untilSecond,
        };
        return [{ note, judge }];
      })
      ?? [];
    if (!judgeTarget) return;
    const { note, judge } = judgeTarget;
    judgedMap.set(note.id, judge);
    latestJudge.set(judge);
  };

  const getJudgeAreaFromKey = (key: string) => {
    const keys = "asdjkl".split("");
    const index = keys.indexOf(key);
    if (index === -1) return;
    return judgeAreas()[index];
  };
  const keyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    const judgeArea = getJudgeAreaFromKey(event.key);
    if (!judgeArea) return;
    judgeAreaActiveMap.set(judgeArea.id, true);
    onJudge(judgeArea.id);
  };
  const keyUp = (event: KeyboardEvent) => {
    const judgeArea = getJudgeAreaFromKey(event.key);
    if (!judgeArea) return;
    judgeAreaActiveMap.set(judgeArea.id, false);
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
  const getJudgeAreaFromPos = (pos: Pos) => {
    if (!playAreaSize.width) return;
    const order = Math.floor(pos.x * (maxOrder() + 1) / playAreaSize.width);
    return judgeAreas()[order];
  };
  const pointerJudgeAreaIdMap = Wve.create<Record<number, Id>>({});
  const onPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    const pos = Pos.fromEvent(event, { relativeTo: playArea() });
    const judgeArea = getJudgeAreaFromPos(pos);
    if (!judgeArea) return;
    pointerJudgeAreaIdMap.set(event.pointerId, judgeArea.id);
    judgeAreaActiveMap.set(judgeArea.id, true);
    onJudge(judgeArea.id);
  };
  const onPointerUp: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    const judgeAreaId = pointerJudgeAreaIdMap()[event.pointerId];
    const judgeArea = judgeAreaMap()[judgeAreaId ?? -1];
    if (!judgeArea) return;
    judgeAreaActiveMap.set(judgeArea.id, false);
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
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        on:touchstart={{ // suppress pinch-in and pinch-out
          handleEvent: (event) => event.preventDefault(),
          passive: false,
        }}
      >
        <div class={styles.LaneContainer}>
          <For each={judgeAreas()}>{(judgeArea) => (
            <Lane
              judgeLineMarginBottomPx={judgeLineMarginBottomPx()}
              active={judgeAreaActiveMap()[judgeArea.id]}
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
