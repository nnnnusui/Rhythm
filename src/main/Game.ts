import { Player } from "./player/Player";
import { SoundEffectPlayer } from "./SoundEffectPlayer";
import { SoundCloud } from "./source/SoundCloud";
import { YouTube } from "./source/YouTube";
import { Score } from "./type/Score";

const Button = (name: string, action: () => void) => {
  const element = document.createElement("div");
  element.classList.add("button", name);
  element.addEventListener("pointerup", action);
  return element;
};

const rangeCoveredNumberInput = (args: {
  useInput: (value: string) => void;
  value: number;
  step?: number;
  max?: number;
  min?: number;
}) => {
  const element = document.createElement("div");
  element.classList.add("range-covered-input");

  const direct = document.createElement("input");
  direct.classList.add("direct");
  direct.type = "number";
  direct.step = `${args.step}`;
  direct.value = `${args.value}`;

  const range = document.createElement("input");
  range.type = "range";
  range.min = `${args.min}`;
  range.max = `${args.max}`;
  range.step = direct.step;
  range.value = direct.value;

  const setValue = (value: string) => {
    args.useInput(value);
    direct.value = value;
    range.value = value;
  };
  const onInput = (event: HTMLElementEventMap["input"]) => {
    const target = event.target as HTMLInputElement;
    console.log(`inputed: ${target}`);
    setValue(target.value);
  };
  direct.addEventListener("input", onInput);
  range.addEventListener("input", onInput);

  element.append(direct, range);
  return { element, direct };
};

const OffsetSetter = (args: { setOffset: (value: string) => void }) => {
  const element = document.createElement("label");
  element.classList.add("offset");

  const covered = rangeCoveredNumberInput({
    useInput: args.setOffset,
    value: 0,
    step: 0.01,
    max: 2,
    min: -2,
  });

  element.append(covered.element);
  return { element };
};

type Source = YouTube | SoundCloud;
const InGameMenu = (args: {
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  setOffset: (value: string) => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("controller");

  const menu = document.createElement("div");
  menu.classList.add("in-game-menu");

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  buttons.append(
    Button("play", args.onPlay),
    Button("restart", args.onRestart)
  );
  const offsetSetter = OffsetSetter(args);
  menu.append(buttons, offsetSetter.element);

  element.append(Button("pause", args.onPause), menu);
  return { element };
};

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
