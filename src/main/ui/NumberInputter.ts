const NumberInputter = (
  name: string,
  useInput: (value: number) => void,
  options?: {
    value?: number;
    step?: number;
    max?: number;
    min?: number;
  }
): NumberInputter => {
  const element = document.createElement("fieldset");
  element.classList.add("number-inputter");

  const legend = document.createElement("legend");
  legend.textContent = name;

  const direct = document.createElement("input");
  direct.type = "number";
  direct.step = `${options?.step}`;
  direct.value = `${options?.value}`;
  const range = document.createElement("input");
  range.type = "range";
  range.min = `${options?.min}`;
  range.max = `${options?.max}`;
  range.step = direct.step;
  range.value = direct.value;

  const onChange = (event: HTMLElementEventMap["change"]) => {
    const target = event.target as HTMLInputElement;
    useInput(Number(target.value));
  };
  const onInput = (event: HTMLElementEventMap["input"]) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    direct.value = value;
    range.value = value;
  };
  direct.addEventListener("change", onChange);
  direct.addEventListener("input", onInput);
  range.addEventListener("change", onChange);
  range.addEventListener("input", onInput);
  if (options?.value) useInput(options.value);

  legend.addEventListener("click", () => direct.focus());
  element.append(legend, direct, range);
  return element;
};
type NumberInputter = HTMLElement;
export { NumberInputter };
