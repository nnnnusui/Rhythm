import { OnJudge } from "../type/OnJudge";

const JudgeView = (args: { evaluation: string; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("judge", args.evaluation);
  element.dataset["judge"] = args.evaluation;
  element.addEventListener("pointerdown", () => args.onJudge(args.evaluation));
  return { element };
};

const NoteView = (args: { delay: number; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("note");
  element.style.setProperty("--delay", `${args.delay}`);
  element.dataset["judge"] = "";
  const onJudge: OnJudge = (judge) => {
    element.dataset["judge"] = judge;
    args.onJudge(judge);
  };
  element.addEventListener("animationend", () => {
    if (element.dataset["judge"]) return;
    onJudge("miss");
  });
  const judges = ["great", "perfect", "great", "good"].map((evaluation) =>
    JudgeView({ evaluation, onJudge })
  );
  element.append(...judges.map((it) => it.element));
  return {
    element,
    reset: () => (element.dataset["judge"] = ""),
  };
};

type NoteView = ReturnType<typeof NoteView>;
export { NoteView };
