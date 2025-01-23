import { For } from "solid-js";

import { NoteValue } from "~/type/struct/music/NoteValue";
import { Beat } from "../../Beat";
import { TimeFns } from "../createTimeFns";

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

  return (
    <div class={styles.Beats}>
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
      <div class={styles.BeatIndicateLane}>
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
