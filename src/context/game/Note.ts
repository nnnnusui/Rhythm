
import {
  Accessor,
  createSignal,
  Setter,
} from "solid-js";

import * as Game from "../game";
import Judgement from "./Judgement";

namespace Note {
  namespace State {
    export type Require = {
      time: Accessor<number>
    }
    export type Optional = {
      keyframes: Accessor<Keyframe[]>
      judgement: Accessor<Judgement>
    }
  }
  export type State = State.Require & State.Optional
  export type Action = {
    setJudgement: Setter<Judgement>
    untilJudge: Accessor<number>
    onScreen: Accessor<boolean>
    isJudgeTarget: Accessor<boolean>
  }
  export type Member = Note.State & Note.Action

  export type InitState = State.Optional
  export type CreateArgs = State.Require & Partial<InitState>
  export type Function = {
    create: (state: CreateArgs) => Note.Member
  }
}
type Note = Note.Member

const defaultFunction: Note.Function = {
  create: () => { throw new Error("You must impl Note.create()."); },
};

const createArgsDefault: Note.InitState = {
  keyframes: () => [
    { top: 0 },
    { top: "80%" },
    { top: "160%" },
  ],
  judgement: () => Judgement.defaultState,
};

const init: (game: Game.State) => Note.Function
  = (game) => {
    const create = (init: Note.CreateArgs) => {
      const initState: Note.State = {
        ...createArgsDefault,
        ...init,
      };
      const [time] = createSignal(initState.time());
      const keyframes = initState.keyframes;
      const [judgement, setJudgement] = createSignal(initState.judgement());

      const untilJudge: Note.Action["untilJudge"]
        = () => -1 * (time() - game.time());
      const onScreen: Note.Action["onScreen"]
        = () => {
          const progress = untilJudge();
          const duration = game.duration();
          return Math.abs(progress) <= duration;
        };
      const isJudgeTarget
        = () => {
          const fastestLimit = () => -0.1;
          const slowestLimit = () =>  0.1;
          const isNotJudgeTarget
            = slowestLimit() < untilJudge()
            || untilJudge() < fastestLimit()
            || judgement();
          return !isNotJudgeTarget;
        };

      const state: Note.State
        = {
          time,
          keyframes,
          judgement,
        };
      const action: Note.Action
        = {
          setJudgement,
          untilJudge,
          onScreen,
          isJudgeTarget,
        };
      return {
        ...state,
        ...action,
      };
    };
    return {
      create,
    };
  };

const Note = {
  default: defaultFunction,
  init,
};

export default Note;
