import { OnJudge } from "../type/OnJudge";
import { JudgeLineView } from "../view/JudgeLineView";
import { keyPositionMap } from "./keyPositionMap";

const judge =
  <E extends Event>(
    onJudge: OnJudge,
    getJudgePos: (event: E) => { x: number; y: number }
  ) =>
  (event: E) => {
    const pos = getJudgePos(event);
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
  const findEffectById = (id: string) =>
    Array(...element.children)
      .map((it) => it as HTMLElement)
      .find((it) => it.dataset["id"] === `${id}`);
  element.addEventListener("pointerdown", (event) => {
    const effect = document.createElement("div");
    effect.classList.add("tap-effect");
    effect.dataset["id"] = `${event.pointerId}`;
    const x = event.clientX / element.clientWidth;
    const y = event.clientY / element.clientHeight;
    effect.style.setProperty("--x", `${x}`);
    effect.style.setProperty("--y", `${y}`);
    element.append(effect);
  });
  element.addEventListener("pointermove", (event) => {
    const effect = findEffectById(`${event.pointerId}`);
    const x = event.clientX / element.clientWidth;
    const y = event.clientY / element.clientHeight;
    effect.style.setProperty("--x", `${x}`);
    effect.style.setProperty("--y", `${y}`);
  });
  element.addEventListener("pointerup", (event) => {
    findEffectById(`${event.pointerId}`).remove();
  });

  // Judge Events
  element.addEventListener(
    "pointerdown",
    judge<PointerEvent>(args.onJudge, (event) => ({
      x: event.clientX,
      y: args.judgeLineView.y(),
    }))
  );
  element.addEventListener(
    "keydown",
    judge<KeyboardEvent>(args.onJudge, (event) => {
      console.log(event.code);
      const keyMaxX = 11;
      const keyPos = keyPositionMap.get(event.code);
      if (!keyPos || keyMaxX <= keyPos.x) return;

      return {
        x: element.clientWidth * (keyPos.x / keyMaxX),
        y: args.judgeLineView.y(),
      };
    })
  );

  return { element };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
