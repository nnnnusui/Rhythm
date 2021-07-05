import { Game } from "./game/Game";
import { Score } from "./score/Score";
import { Source } from "./source/Source";

const scorePath = new URLSearchParams(
  document.location.search.substring(1)
).get("scorePath");

const load = () => {
  const root = document.body;
  fetch(scorePath ? scorePath : "")
    .then((it) => it.json())
    .then((it) => {
      const score = Score.build(it);
      const source = Source.from({
        ...score.source,
        size: {
          width: document.body.clientWidth,
          height: document.body.clientHeight,
        },
      });
      source.addEventListener("ready", () => source.play());

      const startButton = document.createElement("button");
      startButton.classList.add("start");
      startButton.addEventListener("click", () => {
        const game = Game({ source, score });
        game.start();
        root.insertBefore(game.element, startButton);
      });
      root.append(source.element, startButton);
    });
};
window.addEventListener("load", load);
