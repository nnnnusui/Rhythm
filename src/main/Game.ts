import { PlayButton } from "./controller/PlayButton";
import { Player } from "./player/Player";
import { SoundCloud } from "./source/SoundCloud";
import { YouTube } from "./source/YouTube";
import { Score } from "./type/Score";

const Game = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("game");

  const source = (() => {
    switch (args.score.source.kind) {
      case "YouTube":
        return YouTube({
          videoId: args.score.source.id,
          size: {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
          },
          onReady: () => {},
        });
      case "SoundCloud":
        return SoundCloud({
          id: args.score.source.id,
          size: {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
          },
          onReady: () => {},
        });
    }
  })();
  const player = Player({ score: args.score });
  const playButton = PlayButton({
    onPlay: () => {
      source.play(() => player.play());
    },
    onPause: () => {
      source.pause(() => player.pause());
    },
  });
  playButton.activate();
  element.append(source.element, player.element, playButton.element);
  return { element };
};

type Game = ReturnType<typeof Game>;
export { Game };
