import { Source } from "./source/Source";

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
  const source = await (async () => {
    const source = Source.fromUrlString(sourcePath);
    if (source === "Not supported.") return;
    const target = document.createElement("div");
    target.classList.add("source");
    document.body.append(target);
    return await source({ target });
  })();

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
    return { element };
  })();

  console.log(source);
});
