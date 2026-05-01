import { defaultTextFormatter, Sink } from "@logtape/logtape";
import { createRoot } from "solid-js";

import { Wve } from "~/type/struct/Wve";

const createLogStore = () => {
  const logs = Wve.create<string[]>([]);

  return () => ({
    logs,
    append: (line: string) => logs.set((prev) => [line, ...prev]),
    clear: () => logs.set([]),
  });
};

/** @public */
export const useLogStore = createRoot(createLogStore);

const logStore = useLogStore();
/** @public */
export const getLogStoreSink = (): Sink => (record) => {
  const line = defaultTextFormatter(record);
  logStore.append(line);
};
