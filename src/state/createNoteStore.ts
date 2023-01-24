import {
  JSX,
} from "solid-js";
import { createStore } from "solid-js/store";

import AnimationInfo from "./AnimationInfo";

import Score from "@/type/Score";

type Args = Score["notes"][0]
type State = {
  time: number
  style: JSX.CSSProperties
  animation: AnimationInfo
  judge: {
    style: JSX.CSSProperties
  }
  judged: boolean
}
type Action = {
  tryJudge: (event: PointerEvent) => boolean
}
type Store = {
  state: State,
  action: Action,
}
const createNoteStore = (args: Args): Store => {
  const [state, setState] = createStore<State>({
    ...args,
    animation: AnimationInfo(args.keyframes),
    judged: false,
  });

  const action: Action = {
    tryJudge: (event: PointerEvent) => {
      setState("judged", true);
      return true;
    },
  };

  return {
    state,
    action,
  };
};

export { createNoteStore };
export type {
  State as NoteState,
  Action as NoteAction,
  Store as NoteStore,
};
