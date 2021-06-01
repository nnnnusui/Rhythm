const JudgeLine = () => {
  const element = document.createElement("div");
  element.classList.add("judge-line");
  return { element, y: () => element.offsetTop };
};
type JudgeLine = ReturnType<typeof JudgeLine>;
export { JudgeLine };
