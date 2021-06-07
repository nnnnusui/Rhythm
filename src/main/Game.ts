import { InGameMenu } from "./controller/InGameMenu";
import { Player } from "./player/Player";
import { SoundEffectPlayer } from "./SoundEffectPlayer";
import { SoundCloud } from "./source/SoundCloud";
import { YouTube } from "./source/YouTube";
import { Score } from "./type/Score";

type Source = YouTube | SoundCloud;

const getJudgeSoundEffectPlayAction = (player: SoundEffectPlayer) => {
  player.storeByFetch("judge.default", "sound/weakSnare.wav");
  player.storeByFetch("judge.perfect", "sound/rim.wav");

  return (judge: string) => player.play(`judge.${judge}`);
};

const Game = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("game", "loading");

  const audioContext = new (window.AudioContext ||
    (<any>window).webkitAudioContext)();
  const sePlayer = SoundEffectPlayer(audioContext);
  const playJudgeSe = getJudgeSoundEffectPlayAction(sePlayer);
  const player = Player({ score: args.score, onJudge: playJudgeSe });
  const source: Source = (() => {
    const base = {
      size: {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      },
      onReady: () => element.classList.remove("loading"),
      onPlay: () => {
        element.classList.remove("restarting");
        element.classList.add("playing");
      },
      onPause: () => element.classList.remove("playing"),
      onRestart: () => {
        element.classList.add("restarting");
        player.reset();
      },
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
  const inGameMenu = InGameMenu({
    onPlay: source.play,
    onPause: source.pause,
    onRestart: source.restart,
    setOffset: (value) => element.style.setProperty("--offset", value),
  });
  element.append(source.element, player.element, inGameMenu.element);
  return { element };
};

type Game = ReturnType<typeof Game>;
export { Game };
