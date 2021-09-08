const ScrollContent = {
  new: () => {
    const element = document.createElement("section");
    element.classList.add("scroll-content");
    const header = document.createElement("h1");
    header.textContent = "ScrollContent";
    const scroller = document.createElement("div");
    element.append(header, scroller);

    const scrollableHeight = () => element.scrollHeight - element.clientHeight;
    const progress = () => {
      const scrollTop = element.scrollTop;
      if (scrollTop <= 0) return 0;
      return 1 - element.scrollTop / scrollableHeight();
    };
    const scrollByProgress = (progress: number) =>
      (element.scrollTop = (1 - progress) * scrollableHeight());
    const setHeightByMilliSecond = (value: number) =>
      (scroller.style.height = `${(value / 1000) * 50}%`);
    return { element, progress, scrollByProgress, setHeightByMilliSecond };
  },
};

export { ScrollContent };
