import { Score } from "../../type/Score";
import { OnJudge } from "../type/OnJudge";
import { JudgeLineView } from "./JudgeLineView";
import { JudgeView } from "./JudgeView";
import { NoteView } from "./NoteView";

const LaneView = () => {
  const element = document.createElement("div");
  element.classList.add("lane");
  const startAction = () => element.classList.add("action");
  const endAction = () => element.classList.remove("action");
  element.addEventListener("pointerdown", startAction);
  element.addEventListener("pointerup", endAction);
  element.addEventListener("pointercancel", endAction);
  return { element };
};
const LanesView = (args: { score: Score; onJudge: OnJudge }) => {
  const element = document.createElement("div");
  element.classList.add("lanes");
  const lanes = [...Array(args.score.amount).keys()].map(LaneView);
  const notes = args.score.notes.map((it) => {
    const note = NoteView({ delay: it.timing, onJudge: args.onJudge });
    lanes[it.position].element.append(note.element);
    return note;
  });
  const judgeLineView = JudgeLineView();
  element.append(...lanes.map((it) => it.element), judgeLineView.element);

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
    reset: () => lanesView.reset(),
  };
};

type View = ReturnType<typeof View>;
export { View };
