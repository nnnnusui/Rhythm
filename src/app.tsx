import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";

import { TimelineKeyframe } from "./component/domain/rhythm/Editor/Timeline";
import { VolumeConfig } from "./component/domain/rhythm/type/GameConfig";
import { ResourcePlayer } from "./component/embed/ResourcePlayer";
import { LogArea } from "./component/indicate/LogArea";
import { Objects } from "./fn/objects";
import { useOperated } from "./fn/signal/root/useOperated";
import { usePerUserStatus } from "./fn/signal/root/usePerUserStatus";
import { usePlaybackState } from "./fn/signal/root/usePlaybackState";

import styles from "./app.module.css";
import "./app.css";

export default function App() {
  const status = usePerUserStatus();

  const appConfig = status.partial("appConfig");
  const gameConfig = status.partial("gameConfig");
  const scoreMap = status.partial("editingScoreMap");
  const selectedScoreId = status.partial("editingScoreId");

  const operated = useOperated();
  const { timer, resourcePosition } = usePlaybackState();

  const resourceBundleMap = () => Objects
    .map(scoreMap(), (score) => ({
      id: score.id,
      sourceMap: score.sourceMap,
      timeline: TimelineKeyframe
        .getNodes(Objects.values(score.timeline.keyframeMap))
        .sourceNodes,
    }));

  return (
    <Show when={operated()}>
      <Router
        root={(props) => (
          <MetaProvider>
            <Title>Rhythm</Title>
            <main>
              <Show when={appConfig().showLogs}>
                <LogArea />
              </Show>
              <ResourcePlayer
                resourceBundleMap={resourceBundleMap()}
                selectedId={selectedScoreId()}
                timer={timer}
                volume={VolumeConfig.getDecimal(gameConfig().volume, "music")}
                position={resourcePosition()}
              />
              <div class={styles.AppContainer}>
                <Suspense>{props.children}</Suspense>
              </div>
            </main>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </Show>
  );
}
