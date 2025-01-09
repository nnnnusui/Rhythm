import { Timer } from "~/fn/signal/createTimer";

import styles from "./TimerInteraction.module.css";

/**
 * @example
 * ```
 * const timer = createTimer();
 * return (
 *   <TimerInteraction timer={timer} />
 * );
 * ```
 * @public
 */
export const TimerInteraction = (p: {
  timer: Timer;
}) => {
  const timer = Timer.from(() => p.timer);

  return (
    <fieldset class={styles.TimerInteraction}>
      <legend>Timer</legend>
      <span>time: {timer.current / 1000}</span>
      <div class={styles.MeasuringControls}>
        <button class={styles.Button}
          type="button"
          onClick={() => timer.measuring ? timer.pause() : timer.start()}
        >
          <div
            classList={{
              [styles.ResumeIcon]: !timer.measuring,
              [styles.PauseIcon]: timer.measuring,
            }}
          />
        </button>
        <button class={styles.Button}
          type="button"
          onClick={() => timer.stop()}
        >
          <div class={styles.StopIcon} />
        </button>
      </div>
    </fieldset>
  );
};
