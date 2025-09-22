import { ScoreSelector } from "~/component/domain/rhythm/ScoreSelector";
import { AppConfigInteraction } from "~/component/interaction/AppConfigInteraction";
import { DropDownMenu } from "~/component/ui/DropDownMenu";
import { usePerUserStatus } from "~/fn/signal/root/usePerUserStatus";
import { usePlaybackState } from "~/fn/signal/root/usePlaybackState";

import styles from "./index.module.css";

export default function ScoreSelectPage() {
  const status = usePerUserStatus();

  const scoreMap = status.partial("editingScoreMap");
  const selectedScoreId = status.partial("editingScoreId");
  const appConfig = status.partial("appConfig");

  const { timer } = usePlaybackState();
  timer.start();

  return (
    <main class={styles.ScoreSelectPage}>
      <DropDownMenu
        class={styles.Header}
        label="menu"
      >
        <AppConfigInteraction appConfig={appConfig} />
      </DropDownMenu>
      <ScoreSelector
        scoreMap={scoreMap}
        selectedScoreId={selectedScoreId}
      />
    </main>
  );
}
