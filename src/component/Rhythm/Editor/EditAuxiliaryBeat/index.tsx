import { NoteValue } from "~/type/struct/music/NoteValue";
import { Wve } from "~/type/struct/Wve";

import styles from "./EditAuxiliaryBeat.module.css";

export const EditAuxiliaryBeat = (p: {
  auxiliaryBeat: Wve<NoteValue>;
  playBeatBeep: Wve<boolean>;
}) => {
  const beat = Wve.from(() => p.auxiliaryBeat);
  const playBeep = Wve.from(() => p.playBeatBeep);

  return (
    <fieldset class={styles.EditAuxiliaryBeat}>
      <legend>AuxiliaryBeat</legend>
      <span>current: {NoteValue.toString(beat())}</span>
      <label>
        beep:
        <input
          type="checkbox"
          checked={playBeep()}
          onChange={(event) => playBeep.set(event.currentTarget.checked)}
        />
      </label>
      <div class={styles.Templates}>
        <button
          type="button"
          onClick={() => beat.set(NoteValue.from(2))}
        >1/2</button>
        <button
          type="button"
          onClick={() => beat.set(NoteValue.from(4))}
        >1/4</button>
        <button
          type="button"
          onClick={() => beat.set(NoteValue.from(8))}
        >1/8</button>
      </div>
    </fieldset>
  );
};
