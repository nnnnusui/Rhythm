import { Order } from "../type/Order";

type OrderAnimation = {
  animation: Animation;
  endTime: number;
};
const OrderContainer = {
  new: () => {
    const element = document.createElement("section");
    element.classList.add("order-container");
    const header = document.createElement("h1");
    header.textContent = "OrderContainer";
    element.append(header);

    const animations: OrderAnimation[] = [];
    const duration = 2000;
    const orderContainer = element;
    return {
      element,
      animations: () => animations,
      currentTime: async (time: number) =>
        animations.forEach((it) => (it.animation.currentTime = time)),
      append: (order: Order) => {
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.top = "-100%";
        element.classList.add(order.kind);
        if (order.x) element.style.left = `${order.x * 100}%`;
        if (order.width) element.style.width = `${order.width * 100}%`;

        orderContainer.append(element);
        const delay = order.timing - duration;
        animations.push({
          animation: new Animation(
            new KeyframeEffect(
              element,
              { top: ["0", "100vh"] },
              { delay, duration }
            )
          ),
          endTime: order.timing,
        });
      },
    };
  },
};

export { OrderContainer };
