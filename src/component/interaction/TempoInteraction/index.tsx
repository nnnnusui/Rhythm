import { Show } from "solid-js";

import { Tempo } from "~/type/struct/music/Tempo";
import { Wve } from "~/type/struct/Wve";
import { NoteValueInteraction } from "../NoteValueInteraction";

import styles from "./TempoInteraction.module.css";

type Base = Partial<Tempo>;

/** @public */
export const TempoInteraction = <T extends Base>(p: {
  tempo: Wve<T>;
}) => {
  const tempo = Wve.as<Base>(() => p.tempo);
  const bpm = tempo.partial("bpm");
  const beat = tempo.partial("beat");
  const timeSignature = tempo.partial("timeSignature");

  return (
    <fieldset class={styles.TempoInteraction}>
      <legend>
        Tempo
        <Show when={Tempo.whenRequired(tempo())}>{(tempo) => (
          <span>
            <span> _ </span>
            <span>{Tempo.toString(tempo(), { symbolize: true })}</span>
          </span>
        )}</Show>
      </legend>
      <NoteValueInteraction
        value={beat}
      />
      <input placeholder="bpm"
        type="number"
        value={bpm()}
        onChange={(event) => {
          const value = event.currentTarget.valueAsNumber;
          bpm.set(isNaN(value) ? undefined : value);
        }}
      />
      <NoteValueInteraction
        value={timeSignature}
      />
    </fieldset>
  );
};
