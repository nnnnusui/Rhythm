import {
  Accessor,
  createSignal,
} from "solid-js";

import * as Game from "../game";

namespace Judgement {
  export type Point = {
    x: number
    y: number
  }
  namespace State {
    export type Require = {
      offset: Accessor<number>
    }
    export type Optional = object
  }
  export type State = State.Require & State.Optional
  export type Action = object
  export type Member = Judgement.State & Judgement.Action

  export type InitState = State.Optional
  export type CreateArgs = State.Require & Partial<InitState>
  export type Function = {
    create: (state: CreateArgs) => Judgement.Member
  }
}
type Judgement = Judgement.Member | undefined

const defaultFunction: Judgement.Function = {
  create: () => { throw new Error("You must impl Note.create()."); },
};
const defaultState: Judgement = undefined;

const defaultCreateArgs: Judgement.InitState = {};

const init: (game: Game.State) => Judgement.Function
  = () => ({
    create: (init: Judgement.CreateArgs) => {
      const initState: Judgement.State = {
        ...defaultCreateArgs,
        ...init,
      };
      const [offset] = createSignal(initState.offset());

      const state: Judgement.State
        = {
          offset,
        };
      const action: Judgement.Action
        = {};
      return {
        ...state,
        ...action,
      };
    },
  });

const Judgement = {
  defaultFunction,
  defaultState,
  init,
};

export default Judgement;
