import {
  Context,
  createContext,
  ParentComponent,
  useContext,
} from "solid-js";

namespace Type {
  export type State = {[key: string]: never}
  export type Action = {[key: string]: never}
  export type Member = State & Action
}
type Type = Type.Member

const defaultValue: Type = {
};
const context: Context<Type> = createContext(defaultValue);
const use = () => { return useContext<Type>(context); };
const Provider: ParentComponent = (props) => {
  const state: Type.State = {
  };
  const action: Type.Action = {
  };
  const store: Type = {
    ...state,
    ...action,
  };
  return (
    <context.Provider value={store}>
      {props.children}
    </context.Provider>
  );
};

export {
  use as useEditor,
  Provider as EditorProvider,
};
