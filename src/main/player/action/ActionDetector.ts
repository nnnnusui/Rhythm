import { JudgeLineView } from "../view/JudgeLineView";

const dispatchPointerEventTo =
  (getClientY: () => number) => (event: PointerEvent) => {
    if (event.target !== event.currentTarget) return;
    const clientY = getClientY();
    const onJudgeLine = document.elementsFromPoint(event.clientX, clientY)[1];
    if (!onJudgeLine) return;
    const newEvent = new PointerEvent(event.type, {
      bubbles: true,
      cancelable: true,
      clientX: event.clientX,
      clientY: clientY,
    });
    onJudgeLine.dispatchEvent(newEvent);
  };

const ActionDetector = (args: {
  judgeLineView: JudgeLineView;
  onJudge: OnJudge;
}) => {
  const element = document.createElement("div");
  element.classList.add("action-detector");
  const dispatchEvent = dispatchPointerEventTo(args.judgeLineView.y);
  element.addEventListener("pointerdown", dispatchEvent);
  element.addEventListener("pointerup", dispatchEvent);
  element.addEventListener("pointercancel", dispatchEvent);

  const audioContext = new (window.AudioContext ||
    (<any>window).webkitAudioContext)();
  const clap = audioContext.createBufferSource();
  fetch("clap.wav").then((it) => {
    it.arrayBuffer().then((it) => {
      audioContext.decodeAudioData(it).then((it) => {
        clap.buffer = it;
      });
    });
  });
  element.addEventListener("pointerdown", () => {
    const source = audioContext.createBufferSource();
    source.buffer = clap.buffer;
    source.connect(audioContext.destination);
    source.start();
  });

  return { element };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
