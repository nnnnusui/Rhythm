import { createRoot } from "solid-js";

import { Dates } from "~/fn/dates";
import { Wve } from "~/type/struct/Wve";

const createLogger = () => {
  const logs = Wve.create<string[]>([]);
  const log = (p: LogArgs) => {
    const timestamp = Dates.toISO8601WithTimezone(new Date());
    const labelPart = p.labels.length === 0
      ? ""
      : `[${p.labels.join(",")}]`;
    const line = `${timestamp}[${p.level}]${labelPart}: ${p.text}`;
    logs.set((prev) => ([line, ...prev]));
    switch (p.level) {
      case "DEBUG":
        console.debug(line);
        break;
      case "INFO":
        console.info(line);
        break;
      case "WARN":
        console.warn(line);
        break;
      case "ERROR":
        console.error(line);
        break;
    }
  };
  const getLogFnWithLevel
    = (level: LogArgs["level"]) =>
      (label?: string) =>
        (text: LogArgs["text"], options?: Omit<LogArgs, "level" | "text">) =>
          log({
            text: text,
            ...options,
            level,
            labels: [
              ...label ? [label] : [],
              ...options?.labels ?? [],
            ],
          });
  const debug = getLogFnWithLevel("DEBUG");
  const info = getLogFnWithLevel("INFO");
  const warn = getLogFnWithLevel("WARN");
  const error = getLogFnWithLevel("ERROR");

  return (label?: string): Logger => ({
    logs,
    debug: debug(label),
    info: info(label),
    warn: warn(label),
    error: error(label),
  });
};

/** @public */
export const useLogger = createRoot(createLogger);

type Logger = {
  logs: Wve<string[]>;
  debug: (text: string, options?: LogOptions) => void;
  info: (text: string, options?: LogOptions) => void;
  warn: (text: string, options?: LogOptions) => void;
  error: (text: string, options?: LogOptions) => void;
};

type LogOptions = Omit<LogArgs, "text" | "level">;
type LogArgs = {
  text: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  labels: string[];
};
