import { InGameMenu } from "./controller/InGameMenu";
import { Player } from "./player/Player";
import { SoundEffectPlayer } from "./SoundEffectPlayer";
import { SoundCloud } from "./source/SoundCloud";
import { YouTube } from "./source/YouTube";
import { Score } from "./score/Score";
import { Button } from "./ui/Button";
import { NumberInputter } from "./ui/NumberInputter";

type Source = YouTube | SoundCloud;

const getJudgeSoundEffectPlayAction = (player: SoundEffectPlayer) => {
  player.storeByFetch("judge.default", "sound/weakSnare.wav");
  player.storeByFetch("judge.perfect", "sound/rim.wav");

  return (judge: string) => {
    if (judge === "miss") return;
    player.play(`judge.${judge}`);
  };
};

const Game = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("game", "loading");

  const getResult = () =>
    Array(...element.getElementsByClassName("note"))
      .map((it) => it as HTMLElement)
      .map((it) => it.dataset["judge"])
      .filter((it) => it)
      .map((it) => it as string)
      .reduce((map, it) => {
        const before = map.get(it);
        const next = (before ? before : 0) + 1;
        return map.set(it, next);
      }, new Map<string, number>());

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
      onPause: () => {
        element.classList.remove("playing");
        getResult();
      },
      onRestart: () => {
        element.classList.add("restarting");
        player.reset();
      },
    };
    switch (args.score.source.kind) {
      case "YouTube":
        return YouTube({
          ...base,
          ...args.score.source,
        });
      case "SoundCloud":
        return SoundCloud({
          ...base,
          ...args.score.source,
        });
    }
  })();
  const inGameMenu = InGameMenu({
    onPause: source.pause,
    actions: [
      Button("play", source.play),
      Button("restart", source.restart),
      Button("exit", () => element.remove()),
    ],
    parameters: [
      NumberInputter(
        "offset",
        (value) => element.style.setProperty("--offset", value),
        { value: 0, step: 0.01, max: 2, min: -2 }
      ),
    ],
  });
  element.append(source.element, player.element, inGameMenu.element);
  return { element, preview: () => source.play() };
};

type Game = ReturnType<typeof Game>;
export { Game };
