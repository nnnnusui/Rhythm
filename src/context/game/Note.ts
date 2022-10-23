
import { Accessor } from "solid-js";

import * as Game from "../game";

namespace Note {
  export type State = {
    time: Accessor<number>
  }
  export type Action = {
    progress: Accessor<number>
    onScreen: Accessor<boolean>
  }
  export type Member = Note.State & Note.Action

  export type Function = {
    create: (state: Note.State) => Note.Member
  }
}
type Note = Note.Member

const defaultFunction: Note.Function = {
  create: () => { throw new Error("You must impl Note.create()."); },
};

const init: (game: Game.State) => Note.Function
  = (game) => {
    const create = (state: Note.State) => {
      const duration = () => 1;
      const getProgress: Note.Action["progress"]
        = () => state.time() - game.time();
      const onScreen: Note.Action["onScreen"]
        = () => {
          const progress = getProgress();
          return Math.abs(progress) <= duration();
        };
      return {
        ...state,
        progress: getProgress,
        onScreen,
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
