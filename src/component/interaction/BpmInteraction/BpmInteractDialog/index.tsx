import { createEffect, createSignal } from "solid-js";

import { Modal } from "~/component/ui/Modal";
import { Wve } from "~/type/struct/Wve";

import styles from "./BpmInteractDialog.module.css";

export const BpmInteractDialog = (p: {
  open: Wve<boolean>;
  onApply: (bpm: number | undefined) => void;
}) => {
  const [taps, setTaps] = createSignal<number[]>([]);
  const [bpm, setBpm] = createSignal<number>();

  createEffect(() => {
    if (!p.open()) return;
    setTaps([]);
    setBpm(undefined);
  });

  const handleTap = () => {
    const now = Date.now();
    setTaps((prev) => {
      const taps = [...prev, now];
      if (taps.length >= 2) {
        // Calculate BPM from intervals
        const intervals = taps.slice(1).map((nextInterval, i) => {
          const prevInterval = taps[i];
          return nextInterval - (prevInterval ?? nextInterval);
        });
        const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        setBpm(Math.floor(60000 / avgMs));
      }
      return taps;
    });
  };

  const handleReset = () => {
    setTaps([]);
    setBpm(undefined);
  };

  return (
    <Modal
      class={styles.BpmInteractDialog}
      open={p.open}
      onClose={() => p.onApply(bpm())}
    >
      <button class={styles.TapButton}
        onClick={handleTap}
      >Tap</button>
      <button class={styles.ResetButton}
        onClick={handleReset}
      >Reset</button>
      <div class={styles.BpmDisplay}>
        {bpm() ? `BPM: ${bpm()!.toFixed(2)}` : "Tap to detect BPM"}
      </div>
      <div class={styles.TapCount}>Taps: {taps().length}</div>
    </Modal>
  );
};
