import {
  Component,
  createSignal,
  JSX,
} from "solid-js";

import styles from "./Player.module.styl";

const Player: Component = () => {
  const [debugText, setDebugText] = createSignal("");
  let element!: HTMLDivElement;
  const putNote = (args: {clientX: number, clientY: number}) => {
    setDebugText(`y: ${args.clientX}, x: ${args.clientY}`);
    const rect = element.getBoundingClientRect();
    const pos = {
      x: args.clientX - rect.left,
      y: args.clientY - rect.top,
    };
    const rate = {
      x: pos.x / element.clientWidth,
      y: pos.y / element.clientHeight,
    };
  };

  const onDown: JSX.EventHandler<HTMLElement, PointerEvent> = (event) => {
    putNote(event);
    // const target = event.currentTarget;
    // const rect = target.getBoundingClientRect();
    // const pos = {
    //   x: event.clientX - rect.left,
    //   y: event.clientY - rect.top,
    // };
    // const rate = {
    //   x: pos.x / target.clientWidth,
    //   y: pos.y / target.clientHeight,
    // };
  };

  return (
    <div
      class={styles.Player}
      ref={element}
      onPointerDown={onDown}
    >
      <h1>{debugText()}</h1>
    </div>
  );
};

export default Player;
