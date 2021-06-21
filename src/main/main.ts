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

      const starter = document.createElement("div");
      starter.classList.add("starter");
      starter.textContent = "Click to start";
      root.append(source.element, starter);

      starter.onclick = () => {
        starter.remove();
        source.addEventListener("ready", source.play);
        const game = Game({ source, score });
        root.append(game.element);
      };
    });
};
window.addEventListener("load", load);
