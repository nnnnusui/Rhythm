import { Score } from "./score/Score";

const Selection = (score: Score) => {
  const element = document.createElement("section");
  element.classList.add("selection");
  const header = document.createElement("h1");
  header.textContent = score.title;
  element.append(header);
  return element;
};

const GameSelectMenu = () => {
  const element = document.createElement("div");
  element.classList.add("game-select-menu");
  const header = document.createElement("h1");
  header.textContent = "Game select menu";
  element.append(header);

  let before: HTMLElement;
  return {
    element,
    appendSelection: (args: {
      score: Score;
      onSelect: () => void;
      onLaunch: () => void;
    }) => {
      const current = Selection(args.score);
      element.append(current);

      current.addEventListener("click", () => {
        if (current.classList.contains("selected")) {
          args.onLaunch();
        } else {
          before?.classList.remove("selected");
          current.classList.add("selected");
          args.onSelect();
          before = current;
        }
      });
    },
  };
};

type GameSelectMenu = ReturnType<typeof GameSelectMenu>;
export { GameSelectMenu };
