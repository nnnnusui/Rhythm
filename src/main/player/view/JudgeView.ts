const JudgeView = () => {
  const element = document.createElement("div");
  element.classList.add("judge-view");
  return {
    element,
    set: (text: string) => (element.textContent = text),
  };
};
type JudgeView = ReturnType<typeof JudgeView>;
export { JudgeView };
