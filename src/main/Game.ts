import { PlayButton } from "./controller/PlayButton";
import { Player } from "./player/Player";
import { SoundCloud } from "./source/SoundCloud";
import { YouTube } from "./source/YouTube";
import { Score } from "./type/Score";

const Game = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("game");

  const source = (() => {
    const base = {
      size: {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      },
      onReady: () => playButton.activate(),
    };
    switch (args.score.source.kind) {
      case "YouTube":
        return YouTube({
          ...base,
          videoId: args.score.source.id,
        });
      case "SoundCloud":
        return SoundCloud({
          ...base,
          id: args.score.source.id,
        });
    }
  })();
  const player = Player({ score: args.score });
  const playButton = PlayButton({
    onPlay: () => {
      element.classList.remove("pause");
      source.play(() => player.play());
    },
    onPause: () => {
      element.classList.add("pause");
      source.pause(() => player.pause());
    },
  });
  element.append(source.element, player.element, playButton.element);
  return { element };
};

type Game = ReturnType<typeof Game>;
export { Game };
