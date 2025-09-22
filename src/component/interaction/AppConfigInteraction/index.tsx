import { AppConfig } from "~/component/domain/rhythm/type/AppConfig";
import { Wve } from "~/type/struct/Wve";

import styles from "./AppConfigInteraction.module.css";

/** @public */
export const AppConfigInteraction = (p: {
  appConfig: Wve<AppConfig>;
}) => {
  const appConfig = Wve.from(() => p.appConfig);

  return (
    <div class={styles.AppConfigInteraction}>
      <label>
        <input type="checkbox"
          checked={appConfig().showLogs}
          onChange={(event) => appConfig.set("showLogs", event.currentTarget.checked)}
        />
        showLogs
      </label>
    </div>
  );
};
