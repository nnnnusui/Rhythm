const OrderContainer = {
  new: () => {
    const element = document.createElement("section");
    element.classList.add("order-container");
    const header = document.createElement("h1");
    header.textContent = "OrderContainer";
    element.style.position = "absolute";
    element.append(header);
    return { element };
  },
};

export { OrderContainer };
