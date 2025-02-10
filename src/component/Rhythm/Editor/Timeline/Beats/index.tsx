import { For } from "solid-js";

import { Pos } from "~/type/struct/2d/Pos";
import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";
import { Beat } from "../../Beat";
import { Time, TimeFns } from "../createTimeFns";

import styles from "./Beats.module.css";

export const Beats = (p: {
  beats: Beat[];
  currentBeat: undefined | Beat;
  timeFns: TimeFns;
}) => {
  const Time = TimeFns.from(() => p.timeFns);
  const beats = () => p.beats
    .map((it, index, all) => {
      const next = all[index + 1];
      return { ...it, diff: (next?.time ?? 0) - it.time };
    });

  const selection = Wve.create<{
    from?: Time;
    to?: Time;
  }>({});
  const setSelectionFrom = (event: PointerEvent) => {
    const pos = Pos.fromEvent(event);
    const time = Time.fromProgressPxPos(pos);
    selection.set("from", time);
    selection.set("to", undefined);
  };
  const setSelectionTo = (event: PointerEvent) => {
    const pos = Pos.fromEvent(event);
    const time = Time.fromProgressPxPos(pos);
    selection.set("to", time);
  };
  const selectionStyle = () => {
    const { from, to } = selection();
    if (!from) return;
    if (!to) return;
    const low = Time.validate(Math.min(from, to));
    const high = Math.max(from, to);
    const diff = Time.validate(high - low);
    return {
      "--progress": `${Time.toProgressPx(low)}px`,
      "--range": `${Time.toProgressPx(diff)}px`,
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
            style={{ "--progress": `${Time.toProgressPx(Time.validate(beat.time))}px` }}
            classList={{
              [styles.Current]: p.currentBeat?.time === beat.time,
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
              "--progress": `${Time.toProgressPx(Time.validate(beat.time))}px`,
              "--length": `${Time.toProgressPx(Time.validate(beat.diff))}px`,
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
                <span>{beat.kind}</span>
              </div>
            </div>
          </div>
        )}</For>
      </div>
    </div>
  );
};
