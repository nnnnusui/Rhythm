// @refresh reload
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { mount, StartClient } from "@solidjs/start/client";

import { getLogStoreSink } from "./fn/signal/root/useLogStore";

await (async () => { // setup logger
  await configure({
    sinks: {
      console: getConsoleSink(),
      inAppConsole: getLogStoreSink(),
    },
    loggers: [
      { category: ["logtape", "meta"], sinks: ["console"] },
      { category: ["rhythm"], lowestLevel: "trace", sinks: ["console", "inAppConsole"] },
    ],
  });
  const logger = getLogger(["rhythm"]);
  logger.info`Starting client...`;
})();

mount(() => <StartClient />, document.getElementById("app")!);
