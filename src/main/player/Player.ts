import { Score } from "../type/Score";
import { ActionDetector } from "./action/ActionDetector";
import { View } from "./view/View";

const Player = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("player");
  const view = View({ score: args.score });
  const actionDetector = ActionDetector({
    judgeLineView: view.judgeLineView,
    onJudge: (judge) => view.setJudge(judge),
  });
  element.append(view.element, actionDetector.element);
  return { element, play: view.play, pause: view.pause };
};

type Player = ReturnType<typeof Player>;
export { Player };
