import { Score } from "../type/Score";
import { ActionDetector } from "./action/ActionDetector";
import { PlayButton } from "./controller/PlayButton";
import { YouTube } from "./source/YouTube";
import { LaneView } from "./view/LaneView";

const Player = (args: { score: Score }) => {
  const { score } = args;
  const element = document.createElement("div");
  element.classList.add("player");
  const source = YouTube({
    videoId: score.source.videoId,
    size: {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    },
    onReady: () => playButton.activate(),
  });
  const view = LaneView({ score });
  const actionDetector = ActionDetector({
    judgeLineView: view.judgeLineView,
    onJudge: (judge) => view.setJudge(judge),
  });
  const playButton = PlayButton({
    onPlay: () => {
      source.waitLoadAndPlay(() => view.play());
    },
    onPause: () => {
      view.pause();
      source.pauseVideo();
    },
  });
  element.append(
    source.element,
    view.element,
    actionDetector.element,
    playButton.element
  );
  return {
    element,
  };
};

type Player = ReturnType<typeof Player>;
export { Player };
