import { Player } from "./player/Player";
import { score } from "./sample-score";

const suppressTouchMove = () => {
  window.addEventListener("touchmove", (e: TouchEvent) => e.preventDefault(), {
    passive: false,
  });
};
suppressTouchMove();

const player = Player({ score });

const root = document.body;
root.append(player.element);
