import { Score } from "../../type/Score";
import { JudgeLineView } from "./JudgeLineView";
import { JudgeView } from "./JudgeView";
import { NoteView } from "./NoteView";

const LaneView = () => {
  const element = document.createElement("div");
  element.classList.add("lane");
  return { element };
};
const LanesView = (args: {
  score: Score;
  onJudge: Parameters<typeof NoteView>[0]["onJudge"];
}) => {
  const element = document.createElement("div");
  element.classList.add("lanes");
  const lanes = [...Array(args.score.amount).keys()].map(LaneView);
  const notes = args.score.notes.map((it) => {
    const note = NoteView({ onJudge: args.onJudge });
    lanes[it.position].element.prepend(note.element);
    return {
      element: note,
      play: (currentTime?: number) => {
        const wait = currentTime ? it.timing - currentTime : it.timing;
        const waitMs = wait * 1000;
        setTimeout(() => note.activate(), waitMs);
      },
    };
  });
  const judgeLineView = JudgeLineView();
  element.append(...lanes.map((it) => it.element), judgeLineView.element);

  return {
    element,
    play: () => notes.forEach((it) => it.play()),
    pause: () => {},
    judgeLineView,
  };
};

const View = (args: { score: Score }) => {
  const element = document.createElement("div");
  element.classList.add("view");
  const judgeView = JudgeView();
  const lanesView = LanesView({
    score: args.score,
    onJudge: (judge) => judgeView.set(judge),
  });
  element.append(lanesView.element, judgeView.element);
  return {
    element,
    play: lanesView.play,
    pause: lanesView.pause,
    setJudge: judgeView.set,
    judgeLineView: lanesView.judgeLineView,
  };
};

type View = ReturnType<typeof View>;
export { View };
