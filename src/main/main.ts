import { SourceController } from "./controller/SourceController";
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
  document.body.append(SourceController.element);
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
    element.addEventListener("scroll", () => {
      const scrollPercentage = 1 - element.scrollTopPercentage;
      source.time(source.duration * scrollPercentage);
      console.log(element.scrollTopPercentage);
    });
    element.append(header, rollContainer.element);
    document.body.append(element);
    rollContainer.element.style.height = `${source.duration * 50}%`;
    element.scrollTop = element.scrollHeight;
    return { element };
  })();

  scoreMaker.element.addEventListener("click", () => {
    console.log(source.time(50));
    switch (source.state()) {
      case "playing":
        return source.pause();
      default:
        return source.play();
    }
  });
});
