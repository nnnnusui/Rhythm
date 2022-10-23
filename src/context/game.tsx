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

namespace Note {
  export type State = {
    time: number
  }
}
export type Note = Note.State
export const Note = {
  create: (values: Note.State): Note => ({
    ...values,
  }),
};

type State = {
  time: Accessor<number>;
  nowPlaying: Accessor<boolean>;
  notes: Accessor<Note[]>;
}
type Action = {
  setTime: Setter<number>;
  setNowPlaying: Setter<boolean>;
  setNotes: Setter<Note[]>;
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
    nowPlaying: noImplFunction("nowPlaying()"),
    notes: noImplFunction("notes()"),
  },
  {
    setTime: noImplFunction("setTime()"),
    setNowPlaying: noImplFunction("setNowPlaying()"),
    setNotes: noImplFunction("setNotes()"),
  },
];
const context: Context<Game> = createContext(defaultValue);
export const useGame = () => { return useContext<Game>(context); };

export const GameProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal(0);
  const [nowPlaying, setNowPlaying] = createSignal(false);

  const [notes, setNotes] = createSignal<Note[]>([]);

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
    nowPlaying,
    notes,
  };
  const action: Action = {
    setTime,
    setNowPlaying,
    setNotes,
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
