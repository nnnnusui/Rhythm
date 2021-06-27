import { OnJudge } from "../type/OnJudge";
import { JudgeLineView } from "../view/JudgeLineView";

const judge =
  <E extends Event>(
    onJudge: OnJudge,
    getJudgePos: (event: E) => { x: number; y: number }
  ) =>
  (event: E) => {
    const pos = getJudgePos(event);
    const judgeElement = document
      .elementsFromPoint(pos.x, pos.y)
      .find((it) => it.classList.contains("judge")) as HTMLElement;
    const judge = judgeElement.dataset["judge"];
    judgeElement.parentElement.dataset["judge"] = judge;
    onJudge(judge);
  };

const ActionDetector = (args: {
  judgeLineView: JudgeLineView;
  onJudge: OnJudge;
}) => {
  const element = document.createElement("div");
  element.classList.add("action-detector");
  element.addEventListener(
    "pointerdown",
    judge<PointerEvent>(args.onJudge, (event) => ({
      x: event.clientX,
      y: args.judgeLineView.y(),
    }))
  );

  return { element };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
