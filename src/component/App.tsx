import { MetaProvider } from "@solidjs/meta";
import {
  Link,
  Route,
  Router,
  Routes,
  useParams,
} from "@solidjs/router";
import {
  Component,
  lazy,
  ParentComponent,
} from "solid-js";

import { GameProvider } from "../context/game";
import { suppressTouchAction } from "../function/suppressTouchAction";
import styles from "./App.module.styl";
import Head from "./Head";

const Providers: ParentComponent = (props) => (
  <MetaProvider>
    <Router>
      <GameProvider>
        {props.children}
      </GameProvider>
    </Router>
  </MetaProvider>
);

const Edit = lazy(() => import("./page/Edit"));
const Game = lazy(() => import("./page/Game"));

const App: Component = () => {

  return (
    <Providers>
      <div
        ref={suppressTouchAction}
        class={styles.App}
      >
        <Head />
        <nav>
          <Link href="/">Edit</Link>
          <Link href="/game">Game</Link>
        </nav>
        <Routes>
          <Route path="" component={Edit} />
          <Route path="/game" component={Game} />
          <Route path="*path" element={<div>{useParams().path}</div>} />
        </Routes>
      </div>
    </Providers>
  );
};

export default App;
