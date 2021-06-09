type NArray<T> = Array<NArray<T> | T>;
type Order = {
  method?: "serial" | "parallel";
  beat?: number;
  flatten?: boolean;
  orders: NArray<number | Order>;
};
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const isOrder = (it: any): it is Order => it?.orders !== undefined;
/* eslint-enable */

export { Order, isOrder };
