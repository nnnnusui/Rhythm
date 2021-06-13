import { Button } from "../ui/Button";

const rangeCoveredNumberInput = (args: {
  useInput: (value: string) => void;
  value: number;
  step?: number;
  max?: number;
  min?: number;
}) => {
  const element = document.createElement("div");
  element.classList.add("range-covered-input");

  const direct = document.createElement("input");
  direct.classList.add("direct");
  direct.type = "number";
  direct.step = `${args.step}`;
  direct.value = `${args.value}`;

  const range = document.createElement("input");
  range.type = "range";
  range.min = `${args.min}`;
  range.max = `${args.max}`;
  range.step = direct.step;
  range.value = direct.value;

  const setValue = (value: string) => {
    args.useInput(value);
    direct.value = value;
    range.value = value;
  };
  const onInput = (event: HTMLElementEventMap["input"]) => {
    const target = event.target as HTMLInputElement;
    console.log(`inputed: ${target}`);
    setValue(target.value);
  };
  direct.addEventListener("input", onInput);
  range.addEventListener("input", onInput);

  element.append(direct, range);
  return { element, direct };
};

const ShiftButton = (element: HTMLInputElement, step: number) => {
  const plus = Button(
    "plus",
    () => (element.value = `${Number(element.value) + step}`)
  );
  const minus = Button(
    "minus",
    () => (element.value = `${Number(element.value) - step}`)
  );
  return {
    plus,
    minus,
    parallelized: (...putInBetweens: HTMLElement[]) => [
      plus,
      ...putInBetweens,
      minus,
    ],
  };
};

const OffsetSetter = (args: { setOffset: (value: string) => void }) => {
  const element = document.createElement("fieldset");
  element.classList.add("offset");
  const legend = document.createElement("legend");
  legend.textContent = "offset";

  const covered = rangeCoveredNumberInput({
    useInput: args.setOffset,
    value: 0,
    step: 0.01,
    max: 2,
    min: -2,
  });

  legend.addEventListener("click", () => covered.direct.focus());

  const inputs = [0.01, 0.1]
    .map((step) => ShiftButton(covered.direct, step))
    .reduce((result, it) => it.parallelized(...result), [
      covered.element,
    ] as HTMLElement[]);

  element.append(legend, covered.element);
  return { element };
};

const ParameterInput = (name: string) => {
  const element = document.createElement("fieldset");

  const legend = document.createElement("legend");
  legend.textContent = name;
  const input = document.createElement("input");

  legend.addEventListener("click", () => input.focus());
};

const Actions = (buttons: Button[]) => {
  const element = document.createElement("fieldset");
  element.classList.add("actions");
  element.append(...buttons);
  return { element };
};
const Parameters = (args: { setOffset: (value: string) => void }) => {
  const element = document.createElement("fieldset");
  element.classList.add("parameters");
  const offset = OffsetSetter(args);
  element.append(offset.element);
  return { element };
};

const InGameMenu = (args: {
  onPause: () => void;
  actions: Button[];
  setOffset: (value: string) => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("controller");

  const menu = document.createElement("div");
  menu.classList.add("in-game-menu");

  const actions = Actions(args.actions);
  const parameters = Parameters(args);
  menu.append(actions.element, parameters.element);

  element.append(Button("pause", args.onPause), menu);
  return { element };
};

export { InGameMenu };
