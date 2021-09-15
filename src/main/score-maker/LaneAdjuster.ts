import { Order } from "../order/Order";

const LaneAdjuster = {
  new: (args: { amount: number }) => {
    const element = document.createElement("ul");
    element.classList.add("adjuster", "lane");
    const guideLines = Array.from({ length: args.amount + 1 }, () => {
      const element = document.createElement("li");
      element.classList.add("guideline", "lane");
      return element;
    });
    element.append(...guideLines);
    const laneWidth = 1 / args.amount;
    const laneOffset = laneWidth / 2;
    const laneFromX = (x: number) => Math.floor(x / laneWidth);
    return {
      element,
      adjust: (order: Order): Order => {
        if (!order.x) return order;
        return {
          ...order,
          x: laneOffset + laneFromX(order.x) * laneWidth,
          width: laneWidth,
        };
      },
    };
  },
};

export { LaneAdjuster };
