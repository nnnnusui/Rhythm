const Button = (name: string, action: () => void): Button => {
  const element = document.createElement("div");
  element.classList.add("button", name);
  element.textContent = name;
  element.addEventListener("pointerup", action);
  return element;
};
type Button = HTMLElement;
export { Button };
