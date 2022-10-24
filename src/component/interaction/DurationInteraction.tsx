import {
  Component,
} from "solid-js";

import { useGame } from "../../context/game";
import NumberInteraction from "./base/NumberInteraction";

const DurationInteraction: Component = () => {
  const [game, { setDuration }] = useGame();

  return (
    <NumberInteraction
      label={() => "Duration"}
      initState={() => 1}
      state={game.duration}
      setState={setDuration}
      viewState={(it) => it.toFixed(1)}
    />
  );
};

export default DurationInteraction;
