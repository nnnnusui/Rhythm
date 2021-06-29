import { OnJudge } from "../type/OnJudge";
import { JudgeLineView } from "../view/JudgeLineView";
import { keyPositionMap } from "./keyPositionMap";

const getJudgeEvent = (onJudge: OnJudge) => (pos: { x: number; y: number }) => {
  const judgeElement = document
    .elementsFromPoint(pos.x, pos.y)
    .find((it) => it.classList.contains("judge")) as HTMLElement;
  if (!judgeElement) return;
  const judge = judgeElement.dataset["judge"];
  judgeElement.parentElement.dataset["judge"] = judge;
  onJudge(judge);
};

const ActionDetector = (args: {
  judgeLineView: JudgeLineView;
  onJudge: OnJudge;
}) => {
  const element = document.createElement("div");
  element.classList.add("action-detector");
  element.tabIndex = 0;

  // tap effect
  const appendEffect = (id: string, pos: { x: number; y: number }) => {
    const effect = document.createElement("div");
    effect.classList.add("tap-effect");
    effect.dataset["id"] = id;
    effect.style.setProperty("--x", `${pos.x}`);
    effect.style.setProperty("--y", `${pos.y}`);
    element.append(effect);
  };
  const findEffectById = (id: string) =>
    Array(...element.children)
      .map((it) => it as HTMLElement)
      .find((it) => it.dataset["id"] === `${id}`);
  element.addEventListener("pointerdown", (event) => {
    appendEffect(`${event.pointerId}`, {
      x: event.clientX / element.clientWidth,
      y: event.clientY / element.clientHeight,
    });
  });
  element.addEventListener("pointermove", (event) => {
    const effect = findEffectById(`${event.pointerId}`);
    if (!effect) return;
    const x = event.clientX / element.clientWidth;
    const y = event.clientY / element.clientHeight;
    effect.style.setProperty("--x", `${x}`);
    effect.style.setProperty("--y", `${y}`);
  });
  element.addEventListener("pointerup", (event) => {
    findEffectById(`${event.pointerId}`)?.remove();
  });

  // Judge Events
  const judge = getJudgeEvent(args.onJudge);
  element.addEventListener("pointerdown", (event) =>
    judge({
      x: event.clientX,
      y: args.judgeLineView.y(),
    })
  );
  element.addEventListener("keydown", (event) => {
    const keyMaxX = 11;
    const keyPos = keyPositionMap.get(event.code);
    if (!keyPos || keyMaxX <= keyPos.x) return;

    judge({
      x: element.clientWidth * (keyPos.x / keyMaxX),
      y: args.judgeLineView.y(),
    });
  });

  return { element };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
