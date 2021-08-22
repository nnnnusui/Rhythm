import { SourceController } from "./controller/SourceController";
import { Property } from "./util/Property";
import "./extension/HTMLElement.extension";

const sourcePath = new URLSearchParams(
  document.location.search.substring(1)
).get("source");

const form = (() => {
  const element = document.createElement("form");
  element.method = "GET";
  const url = (() => {
    const element = document.createElement("input");
    element.name = "source";
    element.type = "text";
    return element;
  })();
  element.append(url);
  return element;
})();

window.addEventListener("load", async () => {
  if (!sourcePath) {
    document.body.append(form);
    return;
  }
  const sourceController = SourceController;
  document.body.append(sourceController.element);
  const source = await sourceController.set(sourcePath);

  const rollContainer = (() => {
    const element = document.createElement("section");
    element.classList.add("roll-container");
    const header = document.createElement("h1");
    header.textContent = "RollContainer";
    element.append(header);

    return { element };
  })();

  const scoreMaker = (() => {
    const element = document.createElement("section");
    element.classList.add("score-maker");
    const header = document.createElement("h1");
    header.textContent = "ScoreMaker";
    element.append(header, rollContainer.element);
    document.body.append(element);
    rollContainer.element.style.height = `${source.duration * 50}%`;
    element.scrollTop = element.scrollHeight;
    const applyScrollProgressToSource = () => {
      const scrollPercentage = 1 - element.scrollTopPercentage;
      source.time(source.duration * scrollPercentage);
    };
    return {
      element,
      linkingWithVideo: Property.new({
        init: false,
        observers: [
          ({ next }) => {
            if (next)
              element.addEventListener("scroll", applyScrollProgressToSource);
            else
              element.removeEventListener(
                "scroll",
                applyScrollProgressToSource
              );
          },
        ],
      }).accessor,
    };
  })();

  let scrollEventCanceller: ReturnType<HTMLElement["scrollTopLinearly"]> = {
    cancel: () => {},
  };
  scoreMaker.element.addEventListener("click", () => {
    switch (source.state()) {
      case "playing":
        scrollEventCanceller.cancel();
        scoreMaker.linkingWithVideo(true);
        return source.pause();
      default:
        scrollEventCanceller = scoreMaker.element.scrollTopLinearly(
          0,
          source.duration * 1000
        );
        scoreMaker.linkingWithVideo(false);
        return source.play();
    }
  });
});
