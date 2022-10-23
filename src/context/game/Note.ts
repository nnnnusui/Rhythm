
import * as Game from "../game";

namespace Note {
  export type State = {
    time: number
  }
  export type Action = {
    onScreen: () => boolean
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
  = (game) => ({
    create: (state: Note.State) => {
      const onScreen: Note.Action["onScreen"]
        = () => {
          const progress = game.time() - state.time;
          const beforeScreen =  progress < -1;
          const afterScreen = 1 < progress;
          const offScreen = beforeScreen || afterScreen;
          return !offScreen;
        };
      return {
        ...state,
        onScreen,
      };
    },
  });

const Note = {
  default: defaultFunction,
  init,
};

export default Note;
