import {
  createSignal,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";

import time from "./animationFrame";

type Timer = {
  state: number,
  start: () => void,
  stop: () => void,
}
const useTimer = (): Timer => {
  const [start, setStart] = createSignal(time());
  const [measuring, setMeasuring] = createSignal(false);

  const [state, setState] = createStore<Timer>({
    state: 0,
    start: () => {
      setStart(time());
      setMeasuring(true);
    },
    stop: () => {
      setMeasuring(false);
    },
  });

  createEffect(() => {
    if (!measuring()) return;
    setState("state", time() - start());
  });

  return state;
};

export { useTimer };
