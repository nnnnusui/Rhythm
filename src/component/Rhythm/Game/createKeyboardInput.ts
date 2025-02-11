import { onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { createJudge } from "./createJudge";
import { JudgeArea } from "../type/JudgeArea";

export const createKeyboardInput = (p: {
  judge: ReturnType<typeof createJudge>;
  getJudgeAreas: () => JudgeArea[];
}) => {
  const getJudgeAreaFromKey = (key: string) => {
    const keys = "asdjkl".split("");
    const index = keys.indexOf(key);
    if (index === -1) return;
    return p.getJudgeAreas()[index];
  };

  const keyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    const judgeArea = getJudgeAreaFromKey(event.key);
    if (!judgeArea) return;
    p.judge.onPress(judgeArea.id);
  };

  const keyUp = (event: KeyboardEvent) => {
    const judgeArea = getJudgeAreaFromKey(event.key);
    if (!judgeArea) return;
    p.judge.onRelease(judgeArea.id);
  };

  onMount(() => {
    if (isServer) return;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
  });

  onCleanup(() => {
    if (isServer) return;
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
  });
};
