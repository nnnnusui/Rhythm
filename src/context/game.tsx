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

import Note from "./game/Note";

export type State = {
  time: Accessor<number>;
  duration: Accessor<number>;
  nowPlaying: Accessor<boolean>;
  notes: Accessor<Note[]>;
  startTime: Accessor<number>;
}
type Action = {
  setTime: Setter<number>;
  setDuration: Setter<number>;
  setNowPlaying: Setter<boolean>;
  setNotes: Setter<Note[]>;
  Note: () => Note.Function;
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
    notes: noImplFunction("notes()"),
    startTime: noImplFunction("startTime()"),
  },
  {
    setTime: noImplFunction("setTime()"),
    setDuration: noImplFunction("setDuration()"),
    setNowPlaying: noImplFunction("setNowPlaying()"),
    setNotes: noImplFunction("setNotes()"),
    Note: noImplFunction("Note()"),
  },
];
const context: Context<Game> = createContext(defaultValue);
export const useGame = () => { return useContext<Game>(context); };

export const GameProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(1);
  const [nowPlaying, setNowPlaying] = createSignal(false);

  const [notes, setNotes] = createSignal<Note[]>([]);
  const [startTime, setStartTime] = createSignal(0);

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
    notes,
    startTime,
  };
  const action: Action = {
    setTime,
    setDuration,
    setNowPlaying,
    setNotes,
    Note: () => Note.init(state),
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
