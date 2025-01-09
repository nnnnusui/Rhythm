import { untrack } from "solid-js";

import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";

import styles from "./NoteValueInteraction.module.css";

/** @public */
export const NoteValueInteraction = <
  Required extends boolean = false,
>(p: {
  value: Required extends true ? Wve<NoteValue> : Wve<NoteValue | undefined>;
  required?: Required;
  defaultValue?: NoteValue;
}) => {
  const applied = Wve.from(() => p.value);
  const numerator = applied.partial("numerator");
  const denominator = applied.partial("denominator");

  const cache = Wve.create(untrack(() => applied() ?? NoteValue.from(0)));
  const disabled = () => !applied();
  const required = () => p.required ?? false;

  const toggleDelete = () => {
    applied.set((prev) => {
      const next = prev ? undefined : cache();
      if (prev) cache.set(prev);
      return next;
    });
  };

  return (
    <div class={styles.NoteValueInteraction}>
      <input placeholder="numerator"
        type="number"
        value={numerator() ?? cache().numerator}
        onChange={(event) => numerator.set(event.currentTarget.valueAsNumber)}
        disabled={disabled()}
      />
      /
      <input placeholder="denominator"
        type="number"
        value={denominator()?.[0] ?? cache().denominator[0]}
        onChange={(event) => denominator.set(0, event.currentTarget.valueAsNumber)}
        disabled={disabled()}
      />
      <button class={styles.DeleteButton}
        type="button"
        onClick={toggleDelete}
        disabled={required()}
      >
        {applied() == null ? "o" : "x"}
      </button>
    </div>
  );
};
