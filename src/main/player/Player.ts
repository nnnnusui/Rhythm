import { Score } from "../type/Score";
import { ActionDetector } from "./action/ActionDetector";
import { OnJudge } from "./type/OnJudge";
import { View } from "./view/View";

const Player = (args: { score: Score; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("player");
  const view = View(args);
  const actionDetector = ActionDetector({
    judgeLineView: view.judgeLineView,
    onJudge: (judge) => view.setJudge(judge),
  });
  element.append(view.element, actionDetector.element);
  return { element };
};

type Player = ReturnType<typeof Player>;
export { Player };
