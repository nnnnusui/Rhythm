import { Property } from "../util/Property";

const ScrollContent = {
  new: () => {
    const element = document.createElement("section");
    element.classList.add("scroll-content");
    const header = document.createElement("h1");
    header.textContent = "ScrollContent";
    const scroller = document.createElement("div");
    element.append(header, scroller);

    const scrollableHeight = () => element.scrollHeight - element.clientHeight;
    const progress = () => 1 - element.scrollTop / scrollableHeight();
    const scrollByProgress = (progress: number) =>
      (element.scrollTop = (1 - progress) * scrollableHeight());
    const length = Property.new({
      init: 0,
      observers: [
        ({ next }) => {
          // const scrollBotom = scrollableHeight() - element.scrollTop;
          scroller.style.height = `${(next / 1000) * 50}%`;
          // element.scrollTop = scrollableHeight() - scrollBotom;
        },
      ],
    }).accessor;
    return { element, length, progress, scrollByProgress };
  },
};

export { ScrollContent };
