type NArray<T> = Array<NArray<T> | T>;
type Order = {
  method?: "serial" | "parallel";
  beat?: number;
  flatten?: boolean;
  orders: NArray<number | Order>;
};
const isOrder = (it: unknown): it is Order => it["orders"] !== undefined;

export { Order, isOrder };
