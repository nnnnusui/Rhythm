import { Button } from "../../ui/Button";

const JudgeCountView = (resultMap: Map<string, number>) => {
  const element = document.createElement("div");
  element.classList.add("judge-count");
  resultMap.forEach((value, key) => {
    const judge = document.createElement("div");
    judge.classList.add("judge");
    judge.textContent = key;
    const count = document.createElement("div");
    count.classList.add("count");
    count.textContent = `${value}`;
    element.append(judge, count);
  });
  return element;
};
const Actions = (actions: Button[]) => {
  const element = document.createElement("div");
  element.classList.add("actions");
  element.append(...actions);
  return element;
};
const ResultView = (resultMap: Map<string, number>, actions: Button[]) => {
  const element = document.createElement("div");
  element.classList.add("result");

  element.append(JudgeCountView(resultMap), Actions(actions));
  return element;
};
export { ResultView };
