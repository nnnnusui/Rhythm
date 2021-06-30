import { OnJudge } from "../type/OnJudge";

const JudgeView = (args: { evaluation: string; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("judge", args.evaluation);
  element.dataset["judge"] = args.evaluation;
  return { element };
};

const NoteView = (args: {
  position: number;
  delay: number;
  onJudge: OnJudge;
}) => {
  const element = document.createElement("div");
  element.classList.add("note", "wait");
  element.style.setProperty("--delay", `${args.delay}`);
  element.style.setProperty("--position", `${args.position}`);
  element.dataset["judge"] = "";
  const onJudge: OnJudge = (judge) => {
    element.dataset["judge"] = judge;
    args.onJudge(judge);
  };
  element.addEventListener("animationstart", () => {
    element.classList.remove("wait");
  });
  const judgeContainer = document.createElement("div");
  judgeContainer.classList.add("judge-container");
  const judges = ["good", "great", "perfect", "great", "good"];
  const judgeViews = judges.map((evaluation) =>
    JudgeView({ evaluation, onJudge })
  );
  const view = document.createElement("div");
  view.classList.add("view");
  judgeContainer.append(view, ...judgeViews.map((it) => it.element));
  element.append(judgeContainer);
  return {
    element,
    reset: () => {
      element.dataset["judge"] = "";
      element.classList.add("wait");
    },
  };
};

type NoteView = ReturnType<typeof NoteView>;
export { NoteView };
