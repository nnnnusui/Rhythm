import { Score } from "./score/Score";

const GameSelectView = (args: {
  rootElement: HTMLElement;
  scorePaths: string[];
  onSelect: (score: Score) => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("game-select-menu");
  const gameSelectors = args.scorePaths.map((url) => {
    const element = document.createElement("div");
    element.classList.add("game-selector");
    element.textContent = url;
    element.addEventListener("pointerup", () => {
      fetch(url)
        .then((it) => it.json())
        .then((it) => {
          const score = Score.build(it);
          args.onSelect(score);
        });
    });
    return element;
  });
  element.append(...gameSelectors);
  return { element };
};
export { GameSelectView };
