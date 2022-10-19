import {
  Accessor,
  Context,
  createContext,
  createSignal,
  ParentComponent,
  Setter,
  useContext,
} from "solid-js";

type State = {
  readonly time: Accessor<number>;
}
type Action = {
  setTime: Setter<number>
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
  },
  {
    setTime: noImplFunction("setTime()"),
  },
];
const context: Context<Game> = createContext(defaultValue);
export const useGame = () => { return useContext<Game>(context); };

export const GameProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal(0);

  const state: State = {
    time,
  };
  const action: Action = {
    setTime,
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
