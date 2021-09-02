const Timer = {
  new: (args: {
    onTimer: (time: number) => void;
    onStart?: () => void;
    onStop?: () => void;
  }) => {
    const { onTimer, onStart, onStop } = {
      onTimer: args.onTimer,
      onStart: args.onStart ? args.onStart : () => {},
      onStop: args.onStop ? args.onStop : () => {},
    };
    let canceled = true;
    const stop = () => {
      canceled = true;
      onStop();
    };
    const start = (from: number) => {
      canceled = false;
      const startTime = performance.now();
      const loop = (nowTime) => {
        if (canceled) return;
        const elapsedTime = nowTime - startTime;
        onTimer(from + elapsedTime);
        // if (to <= elapsedTime) return stop();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      onStart();
    };
    return { start, stop };
  },
};

export { Timer };
