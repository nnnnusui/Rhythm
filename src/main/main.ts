import { Game } from "./game/Game";
import { GameSelectMenu } from "./GameSelectMenu";
import { Launcher } from "./Launcher";
import { Score } from "./score/Score";
import { ScreenTransitionView } from "./ScreenTransitionView";
import { SoundEffectPlayer } from "./SoundEffectPlayer";
import { Source } from "./source/Source";
import { SourceContainer } from "./SourceContainer";

const scorePath = new URLSearchParams(
  document.location.search.substring(1)
).get("scorePath");

const defaultScoreRepository =
  "https://raw.githubusercontent.com/nnnnusui/Rhythm/score/list.json";

const load = () => {
  const root = document.body;
  const sourceContainer = SourceContainer();
  const gameSelectMenu = GameSelectMenu();
  const screenTransitionView = ScreenTransitionView();
  const launcher = Launcher(screenTransitionView, () => {
    const audioContext = new (window.AudioContext ||
      (<any>window).webkitAudioContext)();
    const soundEffectPlayer = SoundEffectPlayer(audioContext);
    soundEffectPlayer.storeByFetch("judge.default", "sound/weakSnare.wav");
    soundEffectPlayer.storeByFetch("judge.perfect", "sound/rim.wav");
    soundEffectPlayer.storeByFetch("select", "sound/select.mp3");

    const appendSelection = (score: Score) => {
      const source = Source.from({
        ...score.source,
        size: {
          width: document.body.clientWidth,
          height: document.body.clientHeight,
        },
      });
      sourceContainer.set(score.url, source);

      gameSelectMenu.appendSelection({
        score,
        onSelect: () => {
          sourceContainer.select(score.url);
          soundEffectPlayer.play("select");
        },
        onLaunch: () => {
          const game = Game({
            source,
            score,
            screenTransitionView,
            soundEffectPlayer,
          });
          Array(...root.children)
            .filter((it) => it.classList.contains("game"))
            .forEach((it) => it.remove());
          root.insertBefore(game.element, gameSelectMenu.element);
          game.start();
        },
      });
    };

    fetch(defaultScoreRepository)
      .then((it) => it.json())
      .then((it: string[]) =>
        [scorePath, ...it].forEach((url) =>
          fetch(url)
            .then((it) => it.json())
            .then((it) => Score.build({ ...it, url }))
            .then(appendSelection)
        )
      );
  });

  root.append(
    sourceContainer.element,
    gameSelectMenu.element,
    screenTransitionView.element,
    launcher.element
  );
};
window.addEventListener("load", load);
