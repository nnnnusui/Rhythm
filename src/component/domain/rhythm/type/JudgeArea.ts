import { Id } from "~/type/struct/Id";

/** @public */
export type JudgeArea = {
  id: Id;
  kind: "lane";
  order: number;
};
