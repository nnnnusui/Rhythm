import uuid from "ui7";
/** @public */
export type Id = string;
/** @public */
export const Id = (() => {
  const newFn = () => uuid();
  return {
    new: newFn,
  };
})();
