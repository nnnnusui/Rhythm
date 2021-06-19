import { scoreList } from "./sample-score";
import { Game } from "./game/Game";
import { Score } from "./score/Score";

const root = document.body;
const starter = document.createElement("div");
starter.classList.add("starter");
starter.textContent = "Click to start";
root.append(starter);

starter.onclick = () => {
  starter.remove();
  const GameSelectView = () => {
    const element = document.createElement("div");
    element.classList.add("game-select-menu");
    const gameSelectors = scoreList.map((url) => {
      const element = document.createElement("div");
      element.classList.add("game-selector");
      element.textContent = url;
      element.addEventListener("pointerup", () => {
        root.getElementsByClassName("game")[0]?.remove();
        fetch(url)
          .then((it) => it.json())
          .then((it) => {
            const score = Score.build(it);
            const game = Game({ score });
            game.element.dataset.gameId = url;
            root.prepend(game.element);
          });
      });
      return element;
    });
    element.append(...gameSelectors);
    return { element };
  };
  const gameSelectView = GameSelectView();
  root.append(gameSelectView.element);
};
