import { Button } from "~/component/ui/Button";
import { Wve } from "~/type/struct/Wve";
import { NumberInteraction } from "../NumberInteraction";
import { BpmInteractDialog } from "./BpmInteractDialog";

import styles from "./BpmInteraction.module.css";

/** @public */
export const BpmInteraction = (p: {
  value: Wve<number | undefined>;
}) => {
  const applied = Wve.from(() => p.value);
  const opened = Wve.create(false);

  return (
    <div class={styles.BpmInteraction}>
      <NumberInteraction value={applied} />
      <Button onAction={() => opened.set(true)}>by Tap</Button>
      <BpmInteractDialog
        open={opened}
        onApply={(bpm) => applied.set((prev) => bpm ?? prev)}
      />
    </div>
  );
};
