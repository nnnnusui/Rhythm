import { PlayButton } from "./controller/PlayButton";
import { Player } from "./player/Player";
import { YouTube } from "./source/YouTube";
import { Score } from "./type/Score";

const Game = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("game");

  const source = YouTube({
    videoId: args.score.source.videoId,
    size: {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    },
    onReady: () => playButton.activate(),
  });
  const player = Player({ score: args.score });
  const playButton = PlayButton({
    onPlay: () => {
      source.play(() => player.play());
    },
    onPause: () => {
      source.pause(() => player.pause());
    },
  });
  element.append(source.element, player.element, playButton.element);
  return { element };
};

type Game = ReturnType<typeof Game>;
export { Game };
