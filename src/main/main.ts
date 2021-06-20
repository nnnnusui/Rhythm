import { Game } from "./game/Game";
import { GameSelectView } from "./GameSelectView";
import { scoreList } from "./sample-score";
import { Source } from "./source/Source";

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
    onPreview: (score) => {
      root.getElementsByClassName("source")[0]?.remove();
      root.prepend(
        Source.from({
          ...score.source,
          size: {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
          },
          onReady: () => {},
        }).element
      );
    },
    onSelect: (score) => {
      root.getElementsByClassName("source")[0]?.remove();
      root.getElementsByClassName("game")[0]?.remove();
      const game = Game({ score });
      root.prepend(game.element);
    },
  });
  root.append(gameSelectView.element);
};
