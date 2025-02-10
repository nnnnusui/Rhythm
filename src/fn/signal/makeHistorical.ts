import { captureStoreUpdates, NestedUpdate } from "@solid-primitives/deep";
import { Accessor, createEffect, untrack } from "solid-js";
import { unwrap } from "solid-js/store";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Objects } from "../objects";

/** @public */
export const makeHistorical = () => <
  T extends Record<PropertyKey, unknown>,
>(wve: Wve<T>): WveHistorical<T> => {
  const rootHistoryId = "root";
  const state = Wve.create<{
    currentHistoryId: Id;
    tailHistoryId: Id;
    newHistoryAssigned: boolean;
  }>({
    currentHistoryId: rootHistoryId,
    tailHistoryId: rootHistoryId,
    newHistoryAssigned: true,
  });
  const currentHistoryId = state.partial("currentHistoryId");
  const tailHistoryId = state.partial("tailHistoryId");
  const newHistoryAssigned = state.partial("newHistoryAssigned");

  const rootHistory = {
    id: rootHistoryId,
    value: structuredClone(unwrap(untrack(wve))),
    delta: [],
  };
  const historyMap = Wve.create<Record<Id, History<T>>>({
    [rootHistoryId]: rootHistory,
  });
  const getDelta = captureStoreUpdates(wve());
  createEffect(() => {
    const delta = getDelta();
    const deltaClone = structuredClone(unwrap(delta));
    const value = untrack(wve);
    const valueClone = structuredClone(unwrap(value));
    if (!untrack(newHistoryAssigned)) return;

    const nextHistory: History<T> = {
      id: Id.new(),
      value: valueClone,
      prevHistoryId: untrack(currentHistoryId),
      delta: deltaClone,
    };
    historyMap.set(nextHistory.id, nextHistory);
    currentHistoryId.set(nextHistory.id);
    tailHistoryId.set(nextHistory.id);
    return;
  });

  const get = () => historyMap()[currentHistoryId()]?.value;
  const undo = () => {
    const currentHistory = historyMap()[currentHistoryId()];
    const prevId = currentHistory?.prevHistoryId;
    if (!prevId) return;
    newHistoryAssigned.set(false);
    currentHistoryId.set(prevId);
  };
  const redo = () => {
    const tailIds = (() => {
      const recursive = (historyId: Id): Id[] => {
        const prevId = historyMap()[historyId]?.prevHistoryId;
        if (!prevId) return [historyId];
        if (prevId === currentHistoryId()) return [historyId];
        return [...recursive(prevId), historyId];
      };
      return recursive(tailHistoryId());
    })();
    const [nextId] = tailIds;
    if (!nextId) return;
    if (nextId === rootHistoryId) return;
    newHistoryAssigned.set(false);
    currentHistoryId.set(nextId);
  };
  const setByOuter: typeof wve.set = (...args: unknown[]) => {
    newHistoryAssigned.set(true);
    // @ts-ignore: pass wrapped args.
    return wve.set(...args);
  };

  const setHistoryId = (historyId: Id) => {
    const tail = (() => {
      const recursive = (historyId: Id) => {
        const found = Objects.values(historyMap())
          .findLast((it) => it.prevHistoryId === historyId);
        if (!found) return historyId;
        return recursive(found.id);
      };
      return recursive(historyId);
    })();
    tailHistoryId.set(tail);
    currentHistoryId.set(historyId);
  };

  return Object.assign(get, wve, {
    set: setByOuter,
    history: {
      undo,
      redo,
      map: historyMap,
      root: rootHistory,
      get currentHistoryId() { return currentHistoryId(); },
      setCurrentHistoryId: setHistoryId,
    },
  });
};

/** @public */
export type Historical<T> = {
  undo: () => void;
  redo: () => void;
  map: Wve<Record<Id, History<T>>>;
  root: History<T>;
  currentHistoryId: Id;
  setCurrentHistoryId: (historyId: Id) => void;
};

type WveHistorical<T> = Wve<T> & {
  history: Historical<T>;
};

/** @public */
export type History<T> = {
  id: Id;
  value: T;
  prevHistoryId?: Id;
  delta: NestedUpdate<T>[];
};

/** @public */
export const History = {
  from: <T>(it: Accessor<History<T>>): History<T> => it(),
};
