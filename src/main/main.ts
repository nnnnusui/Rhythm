import { Player } from "./player/Player";
import { score } from "./sample-score";

const player = Player({ score });

const root = document.body;
root.append(player.element);
