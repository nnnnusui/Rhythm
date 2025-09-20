import { createRoot } from "solid-js";

import { Dates } from "~/fn/dates";
import { Wve } from "~/type/struct/Wve";

const createLogger = () => {
  const logs = Wve.create<string[]>([]);
  const debug = (text: string) => {
    const timestamp = Dates.toISO8601WithTimezone(new Date());
    const line = `${timestamp} : ${text}`;
    logs.set((prev) => ([line, ...prev]));
    console.debug(line);
  };

  return (): Logger => ({
    logs,
    debug: debug,
  });
};

/** @public */
export const useLogger = createRoot(createLogger);

type Logger = {
  logs: Wve<string[]>;
  debug: (text: string) => void;
};
