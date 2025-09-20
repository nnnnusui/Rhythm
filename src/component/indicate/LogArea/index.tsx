import { For } from "solid-js";

import { useLogger } from "~/fn/signal/root/useLogger";

import styles from "./LogArea.module.css";

/** @public */
export const LogArea = () => {
  const logger = useLogger();

  return (
    <div class={styles.LogArea}>
      <For each={logger.logs()}>{(line) => (
        <p>{line}</p>
      )}</For>
    </div>
  );
};
