import { InGameMenu } from "./InGameMenu";
import { Player } from "./player/Player";
import { SoundEffectPlayer } from "../SoundEffectPlayer";
import { Score } from "../score/Score";
import { Button } from "../ui/Button";
import { NumberInputter } from "../ui/NumberInputter";
import { ResultView } from "./result/ResultView";
import { Source } from "../source/Source";

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
  element.classList.add("game");

  const states = [
    "loading",
    "readied",
    "playing",
    "paused",
    "restarting",
    "overed",
  ] as const;
  type State = typeof states[number];
  const state = (() => {
    let current: State = "loading";
    element.classList.add(current);
    return (next?: State): State => {
      if (next === undefined) return current;
      if (next !== current) {
        element.classList.remove(current);
        current = next;
        element.classList.add(current);
      }
      return current;
    };
  })();

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
  const resultView = ResultView(new Map(), []);
  const source = Source.from({
    ...args.score.source,
    size: {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    },
    onReady: () => state("readied"),
  });
  source.addEventListener("play", () => {
    state("playing");
  });
  source.addEventListener("pause", () => {
    state("paused");
    getResult();
  });
  source.addEventListener("restart", () => {
    state("restarting");
    player.reset();
  });
  const progressIndicator = (() => {
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.style.setProperty("--duration", `${args.score.length}`);
    progress.addEventListener("animationend", () => {
      state("overed");
      resultView.replaceWith(
        ResultView(getResult(), [Button("close", () => element.remove())])
      );
    });
    return progress;
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
        (value) => element.style.setProperty("--offset", `${value * 1000}`),
        { value: 0.4, step: 0.01, max: 2, min: -2 }
      ),
      NumberInputter(
        "duration",
        (value) => element.style.setProperty("--duration", `${value * 1000}`),
        { value: 2.5, step: 0.1, max: 20, min: 0 }
      ),
    ],
  });
  element.append(
    source.element,
    player.element,
    progressIndicator,
    inGameMenu.element,
    resultView
  );
  return { element, preview: () => source.play() };
};

type Game = ReturnType<typeof Game>;
export { Game };
