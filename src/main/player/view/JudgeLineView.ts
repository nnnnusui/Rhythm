const JudgeLineView = () => {
  const element = document.createElement("div");
  element.classList.add("judge-line");
  return { element, y: () => element.offsetTop };
};
type JudgeLineView = ReturnType<typeof JudgeLineView>;
export { JudgeLineView };
