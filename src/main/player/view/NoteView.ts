const NoteView = (args: { onJudge: (judge: string) => void }) => {
  const element = document.createElement("div");
  element.classList.add("note");
  const judges = ["great", "perfect", "great", "good"].map((evaluation) => {
    const element = document.createElement("div");
    element.classList.add("judge", evaluation);
    element.dataset["judge"] = evaluation;
    element.addEventListener("pointerdown", () => args.onJudge(evaluation));
    return { element };
  });
  element.append(...judges.map((it) => it.element));
  return { element, activate: () => element.classList.add("active") };
};

type NoteView = ReturnType<typeof NoteView>;
export { NoteView };
