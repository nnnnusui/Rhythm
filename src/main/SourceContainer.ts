import { Source } from "./source/Source";

const SourceContainer = () => {
  const element = document.createElement("section");
  element.classList.add("source-container");
  const store = new Map<string, Source>();
  let before: Source;
  return {
    element,
    set: (id: string, source: Source) => {
      element.append(source.element);
      store.get(id)?.element.remove();
      store.set(id, source);
    },
    select: (id: string) => {
      const current = store.get(id);
      if (current === undefined) return;
      before?.pause();
      before?.element.classList.remove("selected");
      current.element.classList.add("selected");
      current.restart();
      before = current;
    },
  };
};

type SourceContainer = ReturnType<typeof SourceContainer>;
export { SourceContainer };
