import { Accessor, createEffect, createRoot, untrack } from "solid-js";

/**
 * Watches a signal (accessor) and returns a Promise that resolves when its value changes.
 *
 * By default, resolves when the value becomes different from the initial value (checkpoint).
 * You can customize the change detection by passing `checkToBe` as a value or a function.
 *
 * @param accessor - The signal or accessor function to watch.
 * @param options.checkToBe - (Optional) A value or function to determine when to resolve the Promise.
 *   - If a value is provided, resolves when the accessor's value is not equal to this value.
 *   - If a function is provided, it receives (next, { checkpoint }) and should return true to resolve.
 *
 * @example
 * ```tsx
 * const open = Wve.create(false);
 * return (
 *   <div>
 *     <Modal open={open} />
 *     <button type="button"
 *       onClick={async () => {
 *         open.set(true);
 *         log("Modal is now open.");
 *         await waitForChange(open);
 *         log("Modal is now closed.");
 *       }}
 *     >Modal Open</button>
 *   </div>
 * );
 * ```
 * @public
 */
export const waitForChange = <T>(accessor: Accessor<T>, options?: {
  checkToBe?: T | ((next: T, options: { checkpoint: T }) => boolean);
}): Promise<{ next: T }> => {
  return new Promise((resolve) => {
    const checkpoint = untrack(accessor);
    const checkToBe = options?.checkToBe || ((next, { checkpoint }) => checkpoint !== next);
    createRoot((dispose) => {
      createEffect(() => {
        const next = accessor();
        const changed = checkToBe instanceof Function
          ? checkToBe(next, { checkpoint })
          : next !== checkToBe;
        if (!changed) return;
        resolve({ next });
        dispose();
      });
    });
  });
};
