import { OnJudge } from "../type/OnJudge";
import { JudgeLineView } from "../view/JudgeLineView";
import { GamePad } from "./Gamepad";
import { keyPositionMap } from "./keyPositionMap";

const getJudgeEvent = (onJudge: OnJudge) => (pos: { x: number; y: number }) => {
  const judgeElement = document
    .elementsFromPoint(pos.x, pos.y)
    .find((it) => it.classList.contains("judge")) as HTMLElement;
  if (!judgeElement) return;
  const judge = judgeElement.dataset["judge"];
  judgeElement.parentElement.parentElement.dataset["judge"] = judge;
  onJudge(judge);
};

const ActionDetector = (args: {
  judgeLineView: JudgeLineView;
  onJudge: OnJudge;
}) => {
  const element = document.createElement("div");
  element.classList.add("action-detector");
  element.tabIndex = 0;

  const judge = getJudgeEvent(args.onJudge);
  const actionMap = args.judgeLineView.actionPosGetterMap;
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
    judge({
      x: event.clientX,
      y: args.judgeLineView.y(),
    });
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
  element.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const keyMaxX = 11;
    const keyPos = keyPositionMap.get(event.code);
    if (!keyPos || keyMaxX <= keyPos.x) return;
    const getPos = actionMap.get(keyPos.x);
    if (!getPos) return;
    const pos = getPos();
    judge(pos);
    appendEffect(event.code, {
      x: pos.x / element.clientWidth,
      y: pos.y / element.clientHeight,
    });
  });
  element.addEventListener("keyup", (event) => {
    findEffectById(event.code)?.remove();
  });

  GamePad.addEventListener("poll", (event) => {
    if (event.index !== 0) return;
    const gamepadId = event.index;
    [2, 4, 0, 6, 1, 5]
      .map((it, index) => {
        const current = event.current.buttons[it];
        const before = event.before.buttons[it];
        return { buttonId: it, position: index, current, before } as const;
      })
      .map(({ position, buttonId, current, before }) => {
        const state = (() => {
          if (before.pressed && current.pressed) return "repeat";
          if (before.pressed && !current.pressed) return "up";
          if (!before.pressed && current.pressed) return "down";
          return "none";
        })();
        const getPos = actionMap.get(position);
        if (!getPos) return;
        const pos = getPos();
        const effectId = `gamepadId${gamepadId}button${buttonId}`;
        switch (state) {
          case "down": {
            judge(pos);
            appendEffect(effectId, {
              x: pos.x / element.clientWidth,
              y: pos.y / element.clientHeight,
            });
          }
          case "up": {
            findEffectById(effectId)?.remove();
          }
        }
      });
  });

  return { element, focus: () => element.focus() };
};

type ActionDetector = ReturnType<typeof ActionDetector>;
export { ActionDetector };
