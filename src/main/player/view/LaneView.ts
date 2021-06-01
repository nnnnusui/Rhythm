import { Score } from "../../type/Score";
import { JudgeView } from "./JudgeView";
import { NoteView } from "./NoteView";

const Lane = () => {
  const element = document.createElement("div");
  element.classList.add("lane");
  return { element };
};

const LaneView = (args: { score: Score }) => {
  const { score } = args;
  const element = document.createElement("div");
  element.classList.add("view");
  const lanes = [...Array(score.amount).keys()].map(Lane);

  const judgeView = JudgeView();
  const notes = score.notes.map((it) => {
    const note = NoteView({ onJudge: (judge) => judgeView.set(judge) });
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
  element.append(...lanes.map((it) => it.element), judgeView.element);
  return {
    element,
    play: () => notes.forEach((it) => it.play()),
    pause: () => {},
    setJudge: judgeView.set,
  };
};

type LaneView = ReturnType<typeof LaneView>;
export { LaneView };
