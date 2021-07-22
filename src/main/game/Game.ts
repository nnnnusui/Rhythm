import { InGameMenu } from "./InGameMenu";
import { Player } from "./player/Player";
import { SoundEffectPlayer } from "../SoundEffectPlayer";
import { Score } from "../score/Score";
import { Button } from "../ui/Button";
import { NumberInputter } from "../ui/NumberInputter";
import { ResultView } from "./result/ResultView";
import { Source } from "../source/Source";
import { ObservableProperty } from "../template/ObservableProperty";
import { ScreenTransitionView } from "../ScreenTransitionView";

const getJudgeSoundEffectPlayAction = (player: SoundEffectPlayer) => {
  return (judge: string) => {
    if (judge === "miss") return;
    player.play(`judge.${judge}`);
  };
};

const Game = (args: {
  source: Source;
  score: Score;
  screenTransitionView: ScreenTransitionView;
  soundEffectPlayer: SoundEffectPlayer;
}) => {
  const { source } = args;
  const element = document.createElement("div");
  element.classList.add("game", "preview");

  const states = [
    "loading",
    "readied",
    "playing",
    "paused",
    "restarting",
    "overed",
  ] as const;
  type State = typeof states[number];
  const state = ObservableProperty<State>({
    init: "loading",
    onChange: (next, before) => {
      element.classList.remove(before);
      element.classList.add(next);
    },
  });

  const getResult = () =>
    Array(...element.getElementsByClassName("note"))
      .map((it) => it as HTMLElement)
      .map((it) => it.dataset["judge"])
      .map((it) => (it ? it : "miss"))
      .reduce((map, it) => {
        const before = map.get(it);
        const next = (before ? before : 0) + 1;
        return map.set(it, next);
      }, new Map<string, number>());

  const playJudgeSe = getJudgeSoundEffectPlayAction(args.soundEffectPlayer);
  const player = Player({ score: args.score, onJudge: playJudgeSe });
  const resultView = ResultView(new Map(), []);

  source.addEventListener("ready", () => state("readied"));
  source.addEventListener("play", () => {
    player.actionDetector.focus();
    state("playing");
  });
  source.addEventListener("pause", () => {
    state("paused");
    console.log(getResult());
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
      element
        .getElementsByClassName("result")[0]
        ?.replaceWith(
          ResultView(getResult(), [
            Button("restart", source.restart),
            Button("close", () => element.remove()),
          ])
        );
    });
    return progress;
  })();
  const localStorage = {
    get: (name: string, or?: unknown) => {
      const value = window.localStorage.getItem(name);
      return value ? value : `${or}`;
    },
    set: (name: string, value: unknown) => {
      window.localStorage.setItem(name, `${value}`);
    },
  };
  const inGameMenu = InGameMenu({
    onPause: source.pause,
    actions: [
      Button("play", source.play),
      Button("restart", source.restart),
      Button("exit", () => {
        element.classList.add("preview");
        source.play();
      }),
    ],
    parameters: [
      NumberInputter(
        "offset",
        (value) => {
          element.style.setProperty("--offset", `${value * 1000}`);
          localStorage.set("offset", value);
        },
        {
          value: Number(localStorage.get("offset", 0)),
          step: 0.01,
          max: 2,
          min: -2,
        }
      ),
      NumberInputter(
        "duration",
        (value) => {
          element.style.setProperty("--duration", `${value * 1000}`);
          localStorage.set("duration", value);
        },
        {
          value: Number(localStorage.get("duration", 2.5)),
          step: 0.1,
          max: 20,
          min: 0,
        }
      ),
    ],
  });
  player.actionDetector.element.addEventListener("keydown", (event) => {
    console.log(event.key);
    switch (event.key) {
      case "Escape":
        source.pause();
        break;
    }
  });
  element.append(
    player.element,
    progressIndicator,
    inGameMenu.element,
    resultView
  );
  return {
    element,
    start: () => {
      args.screenTransitionView.transition({
        name: "game-start",
        onMiddle: () => element.classList.remove("preview"),
        onEnd: () => source.restart(),
      });
    },
  };
};

type Game = ReturnType<typeof Game>;
export { Game };
