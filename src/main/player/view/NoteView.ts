import { OnJudge } from "../type/OnJudge";

const JudgeView = (args: { evaluation: string; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("judge", args.evaluation);
  element.dataset["judge"] = args.evaluation;
  element.addEventListener("pointerdown", () => args.onJudge(args.evaluation));
  return { element };
};

const NoteView = (args: { onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("note");
  element.addEventListener("pointerdown", () =>
    element.classList.add("judged")
  );
  const judges = ["great", "perfect", "great", "good"].map((evaluation) =>
    JudgeView({ evaluation, onJudge: args.onJudge })
  );
  element.append(...judges.map((it) => it.element));
  return {
    element,
    activate: (delay: number) => {
      element.classList.add("active");
      element.style.setProperty("--delay", `${delay}`);
    },
  };
};

type NoteView = ReturnType<typeof NoteView>;
export { NoteView };
