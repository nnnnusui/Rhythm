import {
  Accessor,
  Context,
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";

import overwriteSetter from "../function/overrideSetter";
import Judgement from "./game/Judgement";
import Note from "./game/Note";

type RecentJudge = Judgement | undefined
export type State = {
  time: Accessor<number>;
  duration: Accessor<number>;
  nowPlaying: Accessor<boolean>;
  recentJudge: Accessor<RecentJudge>;
  notes: Accessor<Note[]>;
  startTime: Accessor<number>;
  fps: Accessor<number>;
}
type Action = {
  setTime: Setter<number>;
  setDuration: Setter<number>;
  setNowPlaying: Setter<boolean>;
  setNotes: Setter<Note[]>;
  Note: () => Note.Function;
  judge: () => void;
}
type Game = [
  state: State,
  action: Action,
]

const noImplFunction = (memberName: string) =>
  () => { throw new Error(`You must either init <GameContext /> or impl ${memberName}`); };

const defaultValue: Game = [
  {
    time: noImplFunction("time()"),
    duration: noImplFunction("duration()"),
    nowPlaying: noImplFunction("nowPlaying()"),
    recentJudge: noImplFunction("recentJudge()"),
    notes: noImplFunction("notes()"),
    startTime: noImplFunction("startTime()"),
    fps: noImplFunction("fps()"),
  },
  {
    setTime: noImplFunction("setTime()"),
    setDuration: noImplFunction("setDuration()"),
    setNowPlaying: noImplFunction("setNowPlaying()"),
    setNotes: noImplFunction("setNotes()"),
    Note: noImplFunction("Note()"),
    judge: noImplFunction("judge()"),
  },
];
const context: Context<Game> = createContext(defaultValue);
export const useGame = () => { return useContext<Game>(context); };

export const GameProvider: ParentComponent = (props) => {
  const durationLowerBound = () => 0.1;

  const [time, setTime] = createSignal(0);
  const [duration, _setDuration] = createSignal(1);
  const setDuration = overwriteSetter({
    setter: _setDuration,
    overwrite: ({ current }) => {
      const lowerBound = durationLowerBound();
      if (current <= lowerBound) return lowerBound;
      return current;
    },
  });
  const [nowPlaying, setNowPlaying] = createSignal(false);

  const [notes, setNotes] = createSignal<Note[]>([]);
  const [recentJudge, setRecentJudge] = createSignal<RecentJudge>(undefined, { equals: false });
  const [startTime, setStartTime] = createSignal(0);

  const [fps, setFps] = createSignal(0);

  createEffect(() => {
    const firstNote = notes().find(() => true);
    if (!firstNote) return;
    setStartTime(firstNote.time() - 1.4);
  });

  createEffect(() => {
    if (!nowPlaying()) return;
    let before: number;
    const callback: FrameRequestCallback
      = (current) => {
        if (!nowPlaying()) return;
        if (before) {
          const elapsed = current - before;
          setTime((prev) => prev + elapsed / 1000);
          setFps(1000 / elapsed);
        }
        before = current;
        window.requestAnimationFrame(callback);
      };
    window.requestAnimationFrame(callback);
  });

  const state: State = {
    time,
    duration,
    nowPlaying,
    recentJudge,
    notes,
    startTime,
    fps,
  };

  const f = {
    Note: () => Note.init(state),
    Judgement: () => Judgement.init(state),
  };
  const judge = () => {
    if (!nowPlaying()) return;
    setRecentJudge(() => {
      const slowestLimit = -0.1;
      const fastestLimit =  0.1;
      const judgeTarget
        = notes()
          .find((it) =>
            slowestLimit < it.progress()
            && it.progress() < fastestLimit
            && !it.judgement()
          )
          ;
      if (!judgeTarget) return;
      if (judgeTarget.judgement()) return;
      const judge
        = f
          .Judgement()
          .create({ offset: () => judgeTarget.progress() })
          ;
      judgeTarget.setJudgement(judge);
      return judge;
    });
  };

  const action: Action = {
    setTime,
    setDuration,
    setNowPlaying,
    setNotes,
    ...f,
    judge,
  };

  const store: Game = [
    state,
    action,
  ];

  return (
    <context.Provider value={store}>
      {props.children}
    </context.Provider>
  );
};
