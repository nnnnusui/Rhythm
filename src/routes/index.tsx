import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
import { ScoreSelector } from "~/component/Rhythm/ScoreSelector";
import { makePersisted } from "~/fn/signal/makePersisted";
import { Wve } from "~/type/struct/Wve";

import styles from "./index.module.css";

export default function ScoreSelectPage() {
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.init }));

  const scoreMap = status.partial("editingScoreMap");
  const selectedScoreId = status.partial("editingScoreId");

  return (
    <main class={styles.ScoreSelectPage}>
      <ScoreSelector
        scoreMap={scoreMap}
        selectedScoreId={selectedScoreId}
      />
    </main>
  );
}
