import { Game } from "./Game";
import { score } from "./sample-score";

const root = document.body;
const starter = document.createElement("div");
starter.textContent = "Click to start";
starter.classList.add("starter");
root.append(starter);

starter.addEventListener(
  "click",
  () => {
    starter.remove();
    const game = Game({ score });
    root.append(game.element);
  },
  { once: true }
);
