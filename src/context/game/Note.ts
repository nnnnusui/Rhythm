
import {
  Accessor,
  JSX,
  mergeProps,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

import * as Game from "../game";
import Judgement from "./Judgement";

namespace Note {
  namespace State {
    export type Require = {
      time: number
    }
    export type Optional = {
      judgement: Judgement
      selected: boolean
    }
  }
  export type State = State.Require & State.Optional
  export type Action = {
    setState: SetStoreFunction<State>
    keyframes: Accessor<Keyframe[]>
    noteStyle: Accessor<JSX.CSSProperties>
    judgePointStyle: Accessor<JSX.CSSProperties>
    untilJudge: Accessor<number>
    onScreen: Accessor<boolean>
    isInsideJudgeRect: (point: Judgement.Point) => boolean
    isJudgeTarget: (point: Judgement.Point) => boolean
  }
  export type Member = Note.State & Note.Action

  export type InitState = State.Optional
  type CreateArgsBase = {
    styles: {
      onStart: JSX.CSSProperties
      onJudge: JSX.CSSProperties
      onEnd: JSX.CSSProperties
      note: JSX.CSSProperties
      judgePoint: JSX.CSSProperties
    }
    judgeRect: {
      left: number
      top: number
      width: number
      height: number
    }
  }
  export type CreateArgs = State.Require & Partial<InitState> & CreateArgsBase
  export type FullCreateArgs = State & CreateArgsBase
  export type Function = {
    create: (state: CreateArgs) => Note.Member
  }
}
type Note = Note.Member

const defaultFunction: Note.Function = {
  create: () => { throw new Error("You must impl Note.create()."); },
};

const createArgsDefault: Note.InitState = {
  judgement: Judgement.defaultState,
  selected: false,
};

const init: (game: Game.State) => Note.Function
  = (game) => {
    const create = (_props: Note.CreateArgs) => {
      const props: Note.FullCreateArgs = {
        ...createArgsDefault,
        ..._props,
      };
      const [state, setState] = createStore(props);

      const untilJudge: Note.Action["untilJudge"]
        = () => -1 * (state.time - game.time());
      const onScreen: Note.Action["onScreen"]
        = () => {
          const progress = untilJudge();
          const duration = game.duration();
          return Math.abs(progress) <= duration;
        };
      const isInsideJudgeRect: Note.Action["isInsideJudgeRect"]
        = (point) => {
          const rect = props.judgeRect;
          const isNotOnRect
            = point.x < rect.left
              || point.x > rect.left + rect.width
              || point.y < rect.top
              || point.y > rect.top + rect.height
              ;
          return !isNotOnRect;
        };
      const isJudgeTarget: Note.Action["isJudgeTarget"]
        = (point) => {
          const fastestLimit = () => -0.1;
          const slowestLimit = () =>  0.1;
          const isNotJudgeTarget
            = state.judgement
              || untilJudge() < fastestLimit()
              || untilJudge() > slowestLimit()
              || !isInsideJudgeRect(point)
              ;
          return !isNotJudgeTarget;
        };

      const styles = props.styles;
      const keyframes: Note.Action["keyframes"]
        = () => ([
          styles.onStart,
          styles.onJudge,
          styles.onEnd,
          // Field `offset` in `Keyframe` and `JSX.CSSProperties` are in conflict.
        ] as Keyframe[]);
      const noteStyle: Note.Action["noteStyle"]
          = () => styles.note;
      const judgePointStyle: Note.Action["judgePointStyle"]
        = () => ({
          ...noteStyle(),
          ...styles.onJudge,
          ...styles.judgePoint,
        });

      const action: Note.Action
        = {
          setState,
          keyframes,
          noteStyle,
          judgePointStyle,
          untilJudge,
          onScreen,
          isInsideJudgeRect,
          isJudgeTarget,
        };
      // eslint-disable-next-line solid/reactivity
      return mergeProps(action, state);
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
