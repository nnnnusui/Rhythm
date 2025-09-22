import { createRoot } from "solid-js";

import { Wve } from "~/type/struct/Wve";
import { createTimer } from "../createTimer";

const createPlaybackState = () => {
  const timer = createTimer();
  const resourcePosition = Wve.create<ResourcePosition | undefined>(undefined);

  return () => ({
    timer,
    resourcePosition,
  });
};

/** @public */
export const usePlaybackState = createRoot(createPlaybackState);

/** @public */
export type ResourcePosition = {
  top: number;
  left: number;
  width: number;
  height: number;
  inFront: boolean;
  borderRadius?: number;
};
