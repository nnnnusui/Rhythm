import { Game } from "./game/Game";
import { Score } from "./score/Score";

const root = document.body;
const starter = document.createElement("div");
starter.classList.add("starter");
starter.textContent = "Click to start";
root.append(starter);

const scorePath = new URLSearchParams(
  document.location.search.substring(1)
).get("scorePath");
starter.onclick = () => {
  starter.remove();
  fetch(scorePath ? scorePath : "")
    .then((it) => it.json())
    .then((it) => {
      const score = Score.build(it);
      const game = Game({ score });
      root.prepend(game.element);
    });
};
