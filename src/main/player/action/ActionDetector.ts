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
  onJudge: (judge: string) => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("action-detector");
  const dispatchEvent = dispatchPointerEventTo(args.judgeLineView.y);
  element.addEventListener("pointerdown", dispatchEvent);
  element.addEventListener("pointerup", dispatchEvent);
  element.addEventListener("pointerleave", dispatchEvent);
  return { element };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
