import { Score } from "../../../score/Score";
import { OnJudge } from "../type/OnJudge";
import { JudgeLineView } from "./JudgeLineView";
import { JudgeView } from "./JudgeView";
import { NoteView } from "./NoteView";

const LanesView = (args: { score: Score; onJudge: OnJudge }) => {
  const laneAmount = args.score.laneAmount;
  const element = document.createElement("div");
  element.classList.add("lanes");
  element.style.setProperty("--lane-amount", `${laneAmount}`);
  const notes = args.score.notes.map((it) => {
    const note = NoteView({
      position: it.position,
      delay: it.timing,
      onJudge: args.onJudge,
    });
    return note;
  });
  const judgeLineView = JudgeLineView(laneAmount);
  element.append(...notes.map((it) => it.element), judgeLineView.element);

  return {
    element,
    judgeLineView,
    reset: () => notes.forEach((it) => it.reset()),
  };
};

const View = (args: { score: Score; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("view");
  const judgeView = JudgeView();
  const lanesView = LanesView({
    score: args.score,
    onJudge: (judge) => {
      judgeView.set(judge);
      args.onJudge(judge);
    },
  });
  element.append(lanesView.element, judgeView.element);
  return {
    element,
    setJudge: judgeView.set,
    judgeLineView: lanesView.judgeLineView,
    reset: () => {
      judgeView.set("");
      lanesView.reset();
    },
  };
};

type View = ReturnType<typeof View>;
export { View };
