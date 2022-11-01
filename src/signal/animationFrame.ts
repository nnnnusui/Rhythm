import { createRoot, createSignal } from "solid-js";

const createTimer = () => {
  const [state, setState] = createSignal(0);

  const callback: FrameRequestCallback
    = (current) => {
      setState(current);
      window.requestAnimationFrame(callback);
    };
  window.requestAnimationFrame(callback);

  return state;
};

const animationFrame = createRoot(createTimer);

export default animationFrame;
