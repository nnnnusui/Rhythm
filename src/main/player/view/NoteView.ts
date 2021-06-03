const JudgeView = (args: {
  evaluation: string;
  onJudge: (judge: string) => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("judge", args.evaluation);
  element.dataset["judge"] = args.evaluation;
  element.addEventListener("pointerdown", () => args.onJudge(args.evaluation));
  return { element };
};

const NoteView = (args: { onJudge: (judge: string) => void }) => {
  const element = document.createElement("div");
  element.classList.add("note");
  element.addEventListener("pointerdown", () => element.remove());
  const judges = ["great", "perfect", "great", "good"].map((evaluation) =>
    JudgeView({ evaluation, onJudge: args.onJudge })
  );
  element.append(...judges.map((it) => it.element));
  return { element, activate: () => element.classList.add("active") };
};

type NoteView = ReturnType<typeof NoteView>;
export { NoteView };
