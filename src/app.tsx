import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";

import "./app.css";
import { LogArea } from "./component/indicate/LogArea";
import { PerUserStatus } from "./component/Rhythm/PerUserStatus";
import { makePersisted } from "./fn/signal/makePersisted";
import { Wve } from "./type/struct/Wve";

export default function App() {
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.from }));
  const appConfig = status.partial("appConfig");

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Rhythm</Title>
          <Suspense>{props.children}</Suspense>
          <Show when={appConfig().showLogs}>
            <LogArea />
          </Show>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
