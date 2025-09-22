import { createRoot } from "solid-js";

import { PerUserStatus } from "~/component/Rhythm/PerUserStatus";
import { Wve } from "~/type/struct/Wve";
import { makePersisted } from "../makePersisted";

const createPerUserStatus = () => {
  const status = Wve.create(PerUserStatus.init())
    .with(makePersisted({ name: "perUserStatus", init: PerUserStatus.from }));
  return () => status;
};

/** @public */
export const usePerUserStatus = createRoot(createPerUserStatus);
