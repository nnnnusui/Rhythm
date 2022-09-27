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
} from "solid-js";

import styles from "./App.module.styl";
import Head from "./Head";

const Home = lazy(() => import("./page/Home"));

const App: Component = () => {
  return (
    <MetaProvider>
      <Router>
        <div
          class={styles.App}
        >
          <Head />
          <nav>
            <Link href="/">Home</Link>
          </nav>
          <Routes>
            <Route path="" component={Home} />
            <Route path="*path" element={<div>{useParams().path}</div>} />
          </Routes>
        </div>
      </Router>
    </MetaProvider>
  );
};

export default App;
