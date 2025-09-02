import { batch } from "solid-js";

import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
import { ScoreSelector } from "~/component/Rhythm/ScoreSelector";
import { Score } from "~/component/Rhythm/type/Score";
import { Objects } from "~/fn/objects";
import { openFileDialog } from "~/fn/openFileDialog";
import { makePersisted } from "~/fn/signal/makePersisted";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";

import styles from "./index.module.css";

export default function ScoreSelectPage() {
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.init }));

  const scoreMap = status.partial("editingScoreMap");
  const selectedScoreId = status.partial("editingScoreId");
  const scoreEntries = () => Objects.entries(scoreMap());

  return (
    <main class={styles.ScoreSelectPage}>
      <ScoreSelector
        scoreEntries={scoreEntries}
        selectedScoreId={selectedScoreId}
        onNewScore={() => {
          const id = Id.new();
          scoreMap.set(id, Score.init());
        }}
        onImport={() => {
          openFileDialog({
            contentTypes: ".json,application/json",
          }).then((files) => {
            batch(async () => {
              const scores = await Promise.all(
                files.map(async (file) => {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  return Score.from(data);
                }),
              );
              const alreadyExistsScores = scores.filter((it) => !!scoreMap()[it.id]);
              if (alreadyExistsScores.length > 0) {
                // TODO: Handle already existing scores (e.g., show a warning)
                return;
              }
              scores.forEach((score) => {
                scoreMap.set(score.id, score);
              });
            });
          });
        }}
      />
    </main>
  );
}
