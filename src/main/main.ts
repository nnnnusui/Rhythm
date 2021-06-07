import { Game } from "./Game";
import { score } from "./sample-score";

const suppressTouchMove = () => {
  document.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });
};

const root = document.body;
const starter = document.createElement("div");
starter.textContent = "Click to start";
starter.classList.add("starter");
root.append(starter);

starter.addEventListener(
  "click",
  () => {
    starter.remove();
    suppressTouchMove();
    const game = Game({ score });
    root.append(game.element);
  },
  { once: true }
);
