import { For, Show } from "solid-js";

import { Pos } from "~/type/struct/2d/Pos";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";
import { Beat } from "../../Beat";
import { PxFns } from "../createPxFns";

import styles from "./Beats.module.css";

export const Beats = (p: {
  beats: Beat[];
  currentBeat: undefined | Beat;
  pxFns: PxFns;
}) => {
  const Px = PxFns.from(() => p.pxFns);
  const beats = () => p.beats
    .map((it, index, all) => {
      const next = all[index + 1];
      return { ...it, diff: (next?.time ?? 0) - it.time };
    });

  const selection = Wve.create<{
    from?: number;
    to?: number;
  }>({});
  const setSelectionFrom = (event: PointerEvent) => {
    const pos = Pos.fromEvent(event);
    const step = Px.getStepFromPxPos(pos);
    selection.set("from", step);
    selection.set("to", undefined);
  };
  const setSelectionTo = (event: PointerEvent) => {
    const pos = Pos.fromEvent(event);
    const step = Px.getStepFromPxPos(pos);
    selection.set("to", step);
  };
  const selectionStyle = () => {
    const { from, to } = selection();
    if (!from) return;
    if (!to) return;
    const low = Math.min(from, to);
    const high = Math.max(from, to);
    const diff = high - low;
    return {
      "--progress": `${Px.getPxFromStep(low)}px`,
      "--range": `${Px.getPxFromStep(diff)}px`,
    };
  };

  return (
    <div class={styles.Beats}>
      <div class={styles.Selection}
        style={selectionStyle()}
      />
      <div class={styles.Lines}>
        <For each={beats()}>{(beat) => (
          <div class={styles.BeatLine}
            style={{ "--progress": `${Px.getPxFromSeconds(beat.time)}px` }}
            classList={{
              [styles.Current]: p.currentBeat?.time === beat.time,
              [styles.Auxiliary]: beat.kind === "auxiliary",
            }}
          />
        )}</For>
      </div>
      <div class={styles.BeatIndicateLane}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          if (event.shiftKey) return setSelectionTo(event);
          setSelectionFrom(event);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          setSelectionTo(event);
        }}
        onPointerUp={setSelectionTo}
      >
        <For each={beats()}>{(beat) => (
          <div class={styles.LineInfo}
            style={{
              "--progress": `${Px.getPxFromSeconds(beat.time)}px`,
              "--length": `${Px.getPxFromSeconds(beat.diff)}px`,
            }}
            classList={{
              [styles.Current]: p.currentBeat?.time === beat.time,
            }}
          >
            <div class={styles.TopInfo}>
              {NoteValue.toString(NoteValue["+"](beat.offsetInBar, beat.duration))}
            </div>
            <div class={styles.VerticalInfo}>
              <div>{Math.floor(beat.time * 1000) / 1000}</div>
              <div class={styles.Kind}>
                <Show when={beat.kind !== "auxiliary"}>
                  <span>{beat.kind}</span>
                </Show>
              </div>
            </div>
          </div>
        )}</For>
      </div>
    </div>
  );
};
