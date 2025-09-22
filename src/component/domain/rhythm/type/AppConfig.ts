import { Objects } from "~/fn/objects";

/** @public */
export type AppConfig = {
  showLogs: boolean;
};

/** @public */
export const AppConfig = (() => {
  const init = (): AppConfig => {
    return {
      showLogs: false,
    };
  };

  const from = <T extends AppConfig | undefined>(data: T): AppConfig =>
    Objects.map(init(), (it, key) => data?.[key] ?? it);

  return {
    init,
    from,
  };
})();
