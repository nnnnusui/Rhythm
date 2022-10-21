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

type State = {
  time: Accessor<number>;
  nowPlaying: Accessor<boolean>;
}
type Action = {
  setTime: Setter<number>;
  setNowPlaying: Setter<boolean>;
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
  },
  {
    setTime: noImplFunction("setTime()"),
    setNowPlaying: noImplFunction("setNowPlaying()"),
  },
];
const context: Context<Game> = createContext(defaultValue);
export const useGame = () => { return useContext<Game>(context); };

export const GameProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal(0);
  const [nowPlaying, setNowPlaying] = createSignal(false);

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
  };
  const action: Action = {
    setTime,
    setNowPlaying,
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
