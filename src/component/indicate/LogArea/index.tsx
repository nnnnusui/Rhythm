import { For } from "solid-js";

import { useLogStore } from "~/fn/signal/root/useLogStore";

import styles from "./LogArea.module.css";

/** @public */
export const LogArea = () => {
  const logStore = useLogStore();

  return (
    <div class={styles.LogArea}>
      <For each={logStore.logs()}>{(line) => (
        <p>{line}</p>
      )}</For>
    </div>
  );
};
