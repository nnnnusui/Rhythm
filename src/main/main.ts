import { Game } from "./game/Game";
import { Score } from "./score/Score";
import { ScreenTransitionView } from "./ScreenTransitionView";
import { SoundEffectPlayer } from "./SoundEffectPlayer";
import { Source } from "./source/Source";

const scorePath = new URLSearchParams(
  document.location.search.substring(1)
).get("scorePath");

const defaultScoreRepository =
  "https://raw.githubusercontent.com/nnnnusui/Rhythm/score/list.json";

const load = () => {
  const root = document.body;
  const scoreSelectMenu = (() => {
    const element = document.createElement("div");
    element.classList.add("score-select-menu");
    const header = document.createElement("h1");
    header.textContent = "Score select menu";
    element.append(header);
    return element;
  })();
  const screenTransitionView = ScreenTransitionView();
  const starter = (() => {
    const element = document.createElement("button");
    element.classList.add("starter");
    element.textContent = "Click or tap to start.";
    return element;
  })();
  root.append(scoreSelectMenu, screenTransitionView.element, starter);

  starter.addEventListener("click", () => {
    starter.remove();
    const audioContext = new (window.AudioContext ||
      (<any>window).webkitAudioContext)();
    const soundEffectPlayer = SoundEffectPlayer(audioContext);
    soundEffectPlayer.storeByFetch("judge.default", "sound/weakSnare.wav");
    soundEffectPlayer.storeByFetch("judge.perfect", "sound/rim.wav");
    const appendChoice = (score: Score) => {
      var source: Source;
      const sourceReGen = () => {
        source = Source.from({
          ...score.source,
          size: {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
          },
        });
        source.addEventListener("ready", () => source.play());
      };

      const element = document.createElement("section");
      element.classList.add("choice");
      const header = document.createElement("h1");
      header.textContent = score.title;
      element.append(header);

      element.addEventListener("click", () => {
        if (element.classList.contains("chosen")) {
          const game = Game({
            source,
            score,
            screenTransitionView,
            soundEffectPlayer,
          });
          Array(...root.children)
            .filter((it) => it.classList.contains("game"))
            .forEach((it) => it.remove());
          root.insertBefore(game.element, scoreSelectMenu);
          game.start();
        } else {
          sourceReGen();
          Array(...scoreSelectMenu.getElementsByClassName("choice")).forEach(
            (it) => it.classList.remove("chosen")
          );
          element.classList.add("chosen");
          Array(...root.children)
            .filter((it) => it.classList.contains("source"))
            .forEach((it) => it.remove());
          root.prepend(source.element);
        }
      });
      scoreSelectMenu.append(element);
    };

    fetch(defaultScoreRepository)
      .then((it) => it.json())
      .then((it: string[]) =>
        [scorePath, ...it].forEach((url) =>
          fetch(url)
            .then((it) => it.json())
            .then(Score.build)
            .then(appendChoice)
        )
      );
  });
};
window.addEventListener("load", load);
