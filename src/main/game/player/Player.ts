import { Score } from "../../score/Score";
import { ActionDetector } from "./action/ActionDetector";
import { OnJudge } from "./type/OnJudge";
import { View } from "./view/View";

const Player = (args: { score: Score; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("player");
  const view = View(args);
  const actionDetector = ActionDetector({
    judgeLineView: view.judgeLineView,
    onJudge: (judge) => {
      view.setJudge(judge)
      args.onJudge(judge)
    },
  });
  element.append(view.element, actionDetector.element);
  return { element, reset: view.reset };
};

type Player = ReturnType<typeof Player>;
export { Player };
