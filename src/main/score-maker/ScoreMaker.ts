const ScrollContent = (height: string) => {
  const element = document.createElement("section");
  element.classList.add("scroll-content");
  const header = document.createElement("h1");
  header.textContent = "ScrollContent";
  element.append(header);
  element.style.height = height;
  return { element };
};

const createElement = () => {
  const element = document.createElement("section");
  element.classList.add("score-maker");
  const header = document.createElement("h1");
  header.textContent = "ScoreMaker";
  element.append(header);
  return element;
};

const ScoreMaker = {
  new: (args: { target: HTMLElement; source: any }) => {
    const { source } = args;
    const element = createElement();
    element.append(ScrollContent(`${source.duration * 50}%`).element);
    args.target.append(element);

    element.scrollTop = element.scrollHeight;

    const applyScrollProgressToSource = () => {
      const scrollPercentage = 1 - element.scrollTopPercentage;
      source.time(source.duration * scrollPercentage);
    };

    let scrollEventCanceller: ReturnType<HTMLElement["scrollTopLinearly"]> = {
      cancel: () => {},
    };
    element.addEventListener("click", () => {
      switch (source.state()) {
        case "playing":
          scrollEventCanceller.cancel();
          element.addEventListener("scroll", applyScrollProgressToSource);
          return source.pause();
        default:
          scrollEventCanceller = element.scrollTopLinearly(
            0,
            source.duration * 1000
          );
          element.removeEventListener("scroll", applyScrollProgressToSource);
          return source.play();
      }
    });
    return { element };
  },
};
export { ScoreMaker };
