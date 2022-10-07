import {
  Component, For,
} from "solid-js";

import styles from "./Play.module.styl";

const Play: Component = () => {
  const context = new AudioContext();
  const gainNode = context.createGain();
  gainNode.gain.value = 0.2;

  let sound: AudioBuffer;
  fetch("/air.wav").then((response) =>
    response
      .arrayBuffer()
      .then((it) =>
        context.decodeAudioData(it).then((it) => (sound = it))
      )
  );

  const playSound = () => {
    const source = context.createBufferSource();
    source.buffer = sound;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start();
  };

  return (
    <div
      class={styles.Play}
      onPointerDown={playSound}
    >
      {/* <Player /> */}
      <For each={[...Array(8)]}>{(_, i) =>
        <div
          class={styles.Line}
        />
      }</For>
    </div>
  );
};

export default Play;
