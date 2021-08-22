import { SourceController } from "./controller/SourceController";
import { ScoreMaker } from "./score-maker/ScoreMaker";
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

  ScoreMaker.new({ target: document.body, source });
});
