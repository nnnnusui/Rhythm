const BpmCounter = (args: { onCount: (bpm: number) => void }) => {
  var intervals = [] as number[];
  var before: number = null;
  const calcBpm = (newInterval: number) => {
    intervals.push(newInterval);
    const sum = intervals.reduce((it, sum) => it + sum, 0);
    const average = sum / intervals.length;
    return 60000 / average;
  };
  const count = () => {
    const now = performance.now();
    if (before) args.onCount(calcBpm(now - before));
    before = now;
  };
  const reset = () => {
    intervals = [];
    before = null;
    args.onCount(0);
  };

  const longPressDetector = (() => {
    var detected = false;
    var timerId = -1;
    return {
      detected: () => detected,
      timerSet: () => {
        detected = false;
        timerId = window.setTimeout(() => {
          detected = true;
        }, 2000);
      },
      timerCancel: () => {
        window.clearTimeout(timerId);
      },
    };
  })();

  const element = document.createElement("button");
  element.classList.add("bpm-counter");
  element.addEventListener("pointerdown", () => {
    count();
    longPressDetector.timerSet();
  });
  element.addEventListener("pointerup", () => {
    longPressDetector.timerCancel();
    if (longPressDetector.detected()) reset();
  });
  element.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    event.preventDefault();
    switch (event.key) {
      case "Backspace":
      case "Delete":
        reset();
        break;
      default:
        count();
        break;
    }
  });

  return element;
};

export { BpmCounter };
