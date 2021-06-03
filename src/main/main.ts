import { Game } from "./Game";
import { score } from "./sample-score";

const suppressTouchMove = () => {
  window.addEventListener("touchmove", (e: TouchEvent) => e.preventDefault(), {
    passive: false,
  });
};
suppressTouchMove();

const game = Game({ score });

const root = document.body;
root.append(game.element);
