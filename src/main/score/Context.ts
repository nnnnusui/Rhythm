import { Note } from "./Note";
import { isOrder, Order } from "./Order";

type Context = {
  order: Order;
  offset: number;
  bpm: number;
  division: number;
  base: number;
};

const generateNotes = (context: Context): Note[] => {
  const { order, bpm } = context;

  switch (order.method) {
    case "parallel": {
      const beat = order.beat ? order.beat : 1;
      const base = context.base * beat;
      return order.orders.flatMap((it) => {
        if (Array.isArray(it) || isOrder(it))
          return generateNotes({
            ...context,
            order: isOrder(it)
              ? it
              : {
                  method: "serial" as const,
                  orders: it,
                },
            base,
          });
        return [{ timing: context.offset, position: it }];
      });
    }
    case "serial":
    default: {
      const beat =
        (order.beat ? order.beat : 1) *
        (order.flatten ? order.orders.length : 1);
      const base = context.base * beat;
      const division = context.division * order.orders.length;
      const getTiming = (index: number) =>
        context.offset + (base * index) / (bpm * division);
      return order.orders.reduce(
        (before, it, index) => {
          const timing = getTiming(index);
          const result = (() => {
            if (Array.isArray(it) || isOrder(it))
              return generateNotes({
                ...context,
                order: isOrder(it)
                  ? it
                  : {
                      method: "serial" as const,
                      orders: it,
                    },
                offset: timing,
                division,
                base,
              });
            return [{ timing, position: it }];
          })();
          return {
            notes: [...before.notes, ...result],
            offset: timing,
          };
        },
        { notes: [] as Note[], offset: context.offset }
      ).notes;
    }
  }
};

const Context = {
  generateNotes,
};

export { Context };
