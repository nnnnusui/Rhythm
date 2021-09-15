type Order = {
  timing: number;
};
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
    element.style.position = "absolute";
    element.append(header);

    const animations: OrderAnimation[] = [];
    const duration = 2000;
    const orderContainer = element;
    return {
      element,
      animations: () => animations,
      currentTime: (time: number) =>
        animations.forEach((it) => (it.animation.currentTime = time)),
      append: (order: Order) => {
        const element = document.createElement("div");
        element.style.position = "absolute";
        element.style.backgroundColor = "white";
        element.style.top = "-100%";
        element.style.width = "100%";
        element.style.height = "1px";

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
