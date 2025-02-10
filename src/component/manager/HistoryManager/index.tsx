import { ComponentProps, For, JSX, Show, splitProps, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Objects } from "~/fn/objects";
import { Historical, History } from "~/fn/signal/makeHistorical";
import { Override } from "~/type/Override";

import styles from "./HistoryManager.module.css";

/** @public */
export const HistoryManager = <
  T,
>(p: {
  history: Historical<T>;
  children?: (history: History<T>) => JSX.Element;
}) => {

  return (
    <div class={styles.HistoryManager}>
      <button
        type="button"
        onClick={() => p.history.undo()}
      >
        undo
      </button>
      <button
        type="button"
        onClick={() => p.history.redo()}
      >
        redo
      </button>
      <Recursive class={styles.Siblings}
        root={p.history.root}
        getChildren={(base) => Objects.values(p.history.map()).filter((it) => it.prevHistoryId === base.id)}
      >{(data) => (
          <p
            classList={{
              [styles.CurrentState]: data.id === p.history.currentHistoryId,
            }}
            onClick={() => p.history.setCurrentHistoryId(data.id)}
          >
            <Show when={data}>{(data) => (
              p.children?.(data()) ?? JSON.stringify(data().delta)
            )}</Show>
          </p>
        )}</Recursive>
    </div>
  );
};

type RecursiveProps<T, As extends ValidComponent> = Override<
  Omit<ComponentProps<typeof Dynamic<As>>, "component">,
  {
    as?: ComponentProps<typeof Dynamic<As>>["component"];
    root: T;
    getChildren: (it: T) => T[];
    children: (it: T) => JSX.Element;
  }
>;
const Recursive = <
  T,
  As extends ValidComponent = "div",
>(_p: RecursiveProps<T, As>) => {
  const [p, wrappedParentProps] = splitProps(_p, ["as", "children", "root", "getChildren"]);

  const innerProps = (it: T) => ({
    ...wrappedParentProps,
    as: p.as,
    root: it,
    getChildren: p.getChildren,
    children: p.children,
  } as RecursiveProps<T, As>);

  return (
    <Dynamic {...wrappedParentProps}
      component={p.as ?? "div"}
    >
      <p>{p.children(p.root)}</p>
      <For each={p.getChildren(p.root)}>{(it) => (
        <Recursive {...innerProps(it)} />
      )}</For>
    </Dynamic>
  );
};
