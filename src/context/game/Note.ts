
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
      judgement: Accessor<Judgement>
    }
  }
  export type State = State.Require & State.Optional
  export type Action = {
    untilJudge: Accessor<number>
    onScreen: Accessor<boolean>
    setJudgement: Setter<Judgement>
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
      const [judgement, setJudgement] = createSignal(initState.judgement());

      const untilJudge: Note.Action["untilJudge"]
        = () => -1 * (time() - game.time());
      const onScreen: Note.Action["onScreen"]
        = () => {
          const progress = untilJudge();
          const duration = game.duration();
          return Math.abs(progress) <= duration;
        };

      const state: Note.State
        = {
          time,
          judgement,
        };
      const action: Note.Action
        = {
          untilJudge,
          onScreen,
          setJudgement,
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
