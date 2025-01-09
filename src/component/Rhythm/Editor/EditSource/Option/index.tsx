import { JSX, Suspense } from "solid-js";

import styles from "./Option.module.css";

export const Option = (p: {
  children: JSX.Element;
  sourceId: string;
  selected: boolean;
  select: () => void;
  remove: () => void;
}) => {

  return (
    <div class={styles.Option}
      classList={{ [styles.Selected]: p.selected }}
      onClick={() => p.select()}
    >
      <div class={styles.Texts}>
        <Suspense>
          {p.children}
          <div class={styles.SubTexts}>
            <span class={styles.SourceId}>{p.sourceId}</span>
          </div>
        </Suspense>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          p.remove();
        }}
      >x</button>
    </div>
  );
};
