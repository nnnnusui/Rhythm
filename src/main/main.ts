import { Game } from "./Game";
import { score } from "./sample-score";

const enableContinuousTouch = () => {
  document.addEventListener("touchend", (e) => e.preventDefault());
};
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
    enableContinuousTouch();
    const game = Game({ score });
    root.append(game.element);
  },
  { once: true }
);
