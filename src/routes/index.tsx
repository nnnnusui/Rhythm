import { AppConfigInteraction } from "~/component/interaction/AppConfigInteraction";
import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
import { ScoreSelector } from "~/component/Rhythm/ScoreSelector";
import { DropDownMenu } from "~/component/ui/DropDownMenu";
import { makePersisted } from "~/fn/signal/makePersisted";
import { Wve } from "~/type/struct/Wve";

import styles from "./index.module.css";

export default function ScoreSelectPage() {
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.from }));

  const scoreMap = status.partial("editingScoreMap");
  const selectedScoreId = status.partial("editingScoreId");
  const appConfig = status.partial("appConfig");

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
