import { 
  createContext, 
  ParentComponent
 } from "solid-js";

export type GameContextState = {
  readonly time: number;
}
export type GameContextValue = [
  state: GameContextState,
  actions: {},
]

const defaultState: GameContextState = {
  time: 0
};

const GameContext = createContext<GameContextValue>([
  defaultState,
  {}
]);

export const GameProvider: ParentComponent = () => {
  const [state, setState] = createStore({

  })
  return (
    <GameContext.Provider value={[]}>

    </GameContext.Provider>
  )
}