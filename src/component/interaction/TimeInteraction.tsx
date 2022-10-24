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
      initState={() => 0}
      state={game.time}
      setState={setTime}
      viewState={(state) => state.toFixed(1)}
    />
  );
};

export default TimeInteraction;
