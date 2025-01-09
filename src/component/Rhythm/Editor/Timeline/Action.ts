import { Keyframe } from "./Keyframe";

export type Action = {
  kind: "none";
} | {
  kind: "insert";
  keyframe: Keyframe;
} | {
  kind: "move";
  keyframeId?: Keyframe["id"];
};

export const Action = (() => {
  const init = (): Action => ({ kind: "none" });
  const fromKind = (kind: Action["kind"]): Action => {
    switch (kind) {
      case "none": return { kind: "none" };
      case "insert": return { kind: "insert", keyframe: { id: "", time: 0, kind: "source" } };
      case "move": return { kind: "move" };
    }
  };
  return {
    init,
    fromKind,
  };
})();
