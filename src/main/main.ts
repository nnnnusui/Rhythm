import { Game } from "./game/Game";
import { GameSelectView } from "./GameSelectView";
import { scoreList } from "./sample-score";

const root = document.body;
const starter = document.createElement("div");
starter.classList.add("starter");
starter.textContent = "Click to start";
root.append(starter);

starter.onclick = () => {
  starter.remove();
  const gameSelectView = GameSelectView({
    rootElement: root,
    scorePaths: scoreList,
    onSelect: (score) => {
      root.getElementsByClassName("game")[0]?.remove();
      const game = Game({ score });
      root.prepend(game.element);
    },
  });
  root.append(gameSelectView.element);
};
