import { batch, For, untrack } from "solid-js";
import { Portal } from "solid-js/web";

import { Button } from "~/component/ui/Button";
import { ModalStyled } from "~/component/ui/ModalStyled";
import { openFileDialog } from "~/fn/openFileDialog";
import { useLogger } from "~/fn/signal/root/useLogger";
import { waitForChange } from "~/fn/waitForChange";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Score } from "../../type/Score";

import styles from "./ScoreImportButton.module.css";

/** @public */
export const ScoreImportButton = (p: {
  scoreMap: Wve<Record<Id, Score>>;
}) => {
  const scoreMap = Wve.from(() => p.scoreMap);

  const open = Wve.create(false);
  const importingScores = Wve.create<{ existed?: Score; imported: Score }[]>([]);
  const overwriteMap = Wve.create<Record<Id, "existed" | "imported">>({});
  const applyOverwrite = Wve.create(false);

  const logger = useLogger();
  const log = logger.debug;

  const importScore = () => {
    log("Start import score...");
    log("Open file selection dialog.");
    openFileDialog({
      contentTypes: ".json,application/json",
      multiple: true,
    }).then((files) => {
      batch(async () => {
        const scores = await Promise.all(
          files.map(async (file) => {
            log(`Files selected for import: ${file.name}`);
            const text = await file.text();
            log(`loaded ${text.length} chars.`);
            const data = JSON.parse(text);
            return Score.from(data);
          }),
        );
        const scorePairs = scores
          .map((it) => ({ existed: scoreMap()[it.id], imported: it }));
        log(`already exists count: ${scorePairs.filter((it) => !!it.existed).length}`);
        importingScores.set(scorePairs);
        open.set(true);
        await waitForChange(open);
        const apply = untrack(applyOverwrite);
        applyOverwrite.set(false);
        if (!apply) {
          log("import canceled.");
          return;
        }
        log("import applied.");
        scorePairs.forEach(({ existed, imported }) => {
          const id = imported.id;
          const overwrite = overwriteMap()[id];
          const score = existed && overwrite === "existed" ? existed : imported;
          log(`append score[${overwrite}]: ${id}`);
          scoreMap.set(id, score);
        });
        log("import done.");
      });
    });
  };

  return (
    <>
      <Button class={styles.ScoreImportButton}
        onAction={() => importScore()}
      >
        Import
      </Button>
      <Portal mount={document.body}>
        <ModalStyled open={open}>{({ close }) => (
          <section class={styles.ImportDialog}>
            <h1 class={styles.Title}>List of scores to import.</h1>
            <div class={styles.ImportingScores}>
              <For each={importingScores()}>{({ existed, imported }) => {
                const id = imported.id;
                const existedVersion = existed ? new Date(existed.version.current) : undefined;
                const importedVersion = new Date(imported.version.current);
                const sameVersion = existedVersion?.getTime() === importedVersion.getTime();
                const olderVersion = !existedVersion ? false : importedVersion < existedVersion;
                const newerVersion = !existedVersion ? true : existedVersion < importedVersion;
                const changeStatusChar = (() => {
                  if (sameVersion) return "=";
                  if (olderVersion) return ">";
                  if (newerVersion) return "<";
                  return "≠";
                })();
                const overwrite = overwriteMap.partial(id);
                if (overwrite() == null) {
                  const next = (() => {
                    if (sameVersion) return "existed";
                    if (olderVersion) return "existed";
                    if (newerVersion) return "imported";
                    return undefined;
                  })();
                  overwrite.set(next);
                }

                return (
                  <div class={styles.ImportingScore}>
                    <div class={styles.Label}>
                      <p class={styles.Title}>{existed?.title ?? imported.title}</p>
                      <p class={styles.Id}>{id}</p>
                    </div>
                    <p class={styles.ExistedVersion}
                      classList={{
                        [styles.Conflict]: olderVersion,
                        [styles.Resolved]: newerVersion,
                        [styles.Unchanged]: sameVersion,
                        [styles.Selected]: overwrite() === "existed",
                      }}
                      onClick={() => overwrite.set("existed")}
                    >{existedVersion?.toLocaleString()}</p>
                    <p class={styles.Equality}>
                      {changeStatusChar}
                    </p>
                    <p class={styles.ImportedVersion}
                      classList={{
                        [styles.Conflict]: newerVersion,
                        [styles.Resolved]: olderVersion,
                        [styles.Unchanged]: sameVersion,
                        [styles.Selected]: overwrite() === "imported",
                      }}
                      onClick={() => overwrite.set("imported")}
                    >{importedVersion.toLocaleString()}</p>
                  </div>
                );
              }}</For>
            </div>
            <Button class={styles.Cancel}
              onAction={() => close()}
            >Cancel</Button>
            <Button class={styles.Apply}
              onAction={() => {
                applyOverwrite.set(true);
                close();
              }}
            >Apply</Button>
          </section>
        )}</ModalStyled>
      </Portal>
    </>
  );
};
