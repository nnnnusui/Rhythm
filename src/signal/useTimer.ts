import {
  createSignal,
  createEffect,
} from "solid-js";

import animationFrame from "./animationFrame";

const time = () => animationFrame() / 1000;

type Timer = {
  state: number,
  start: () => void,
  stop: () => void,
}
const useTimer = (): Timer => {
  const [start, setStart] = createSignal(time());
  const [measuring, setMeasuring] = createSignal(false);
  const [state, setState] = createSignal(0);

  createEffect(() => {
    if (!measuring()) return;
    setState(time() - start());
  });

  return {
    get state() {
      return state();
    },
    start: () => {
      setStart(time());
      setMeasuring(true);
    },
    stop: () => {
      setMeasuring(false);
    },
  };
};

export { useTimer };
