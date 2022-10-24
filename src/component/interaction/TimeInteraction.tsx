import {
  Component,
} from "solid-js";

import { useGame } from "../../context/game";
import NumberInteraction from "./base/NumberInteraction";

const TimeInteraction: Component = () => {
  const [game, { setTime }] = useGame();

  return (
    <NumberInteraction
      label={() => "Time"}
      state={game.time}
      setState={setTime}
    />
  );
};

export default TimeInteraction;
