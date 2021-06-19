const JudgeLineView = () => {
  const element = document.createElement("div");
  element.classList.add("judge-line");
  return { element, y: () => element.getBoundingClientRect().top };
};
type JudgeLineView = ReturnType<typeof JudgeLineView>;
export { JudgeLineView };
