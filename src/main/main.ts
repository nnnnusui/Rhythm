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
    document.body.append(target);
    return await source({ target });
  })();
  console.log(source);
});
