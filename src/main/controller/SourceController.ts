import { Source } from "../source/Source";

const sourceContainer = () => {
  const element = document.createElement("section");
  element.classList.add("source-container");
  const header = document.createElement("h1");
  header.textContent = "SourceContainer";
  element.append(header);
  return element;
};

const SourceController = (() => {
  const element = sourceContainer();
  return {
    element,
    set: async (sourcePath: string) => {
      const source = await (async () => {
        const source = Source.fromUrlString(sourcePath);
        if (source === "Not supported.") return;
        const target = document.createElement("div");
        target.classList.add("source");
        element.append(target);
        return await source({ target });
      })();
      return source;
    },
  };
})();

export { SourceController };
