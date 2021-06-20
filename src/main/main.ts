import { Game } from "./game/Game";
import { Score } from "./score/Score";
import { Source } from "./source/Source";

const root = document.body;

const scorePath = new URLSearchParams(
  document.location.search.substring(1)
).get("scorePath");

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
      onReady: () => {},
    });

    const starter = document.createElement("div");
    starter.classList.add("starter");
    starter.textContent = "Click to start";
    root.append(source.element, starter);

    starter.onclick = () => {
      starter.remove();
      const game = Game({ source, score });
      root.append(game.element);
    };
  });
