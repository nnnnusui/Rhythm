import { JudgeLineView } from "../view/JudgeLineView";

const ActionDetector = (args: {
  judgeLineView: JudgeLineView;
  onJudge: (judge: string) => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("action-detector");
  element.addEventListener("pointerdown", (event) => {
    const judgeElement = document
      .elementsFromPoint(event.clientX, args.judgeLineView.y())
      .filter((it) => it.classList.contains("judge"))[0];
    if (!judgeElement) return;
    const judge = (judgeElement as HTMLElement).dataset["judge"];
    if (!judge) return;
    args.onJudge(judge);
    judgeElement.parentElement?.remove();
  });
  return { element };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
