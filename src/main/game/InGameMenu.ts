import { Button } from "../ui/Button";
import { NumberInputter } from "../ui/NumberInputter";

const Actions = (buttons: Button[]) => {
  const element = document.createElement("fieldset");
  element.classList.add("actions");
  element.append(...buttons);
  return { element };
};
const Parameters = (inputers: NumberInputter[]) => {
  const element = document.createElement("fieldset");
  element.classList.add("parameters");
  element.append(...inputers);
  return { element };
};

const InGameMenu = (args: {
  onPause: () => void;
  actions: Button[];
  parameters: NumberInputter[];
}) => {
  const element = document.createElement("div");
  element.classList.add("controller");

  const menu = document.createElement("div");
  menu.classList.add("in-game-menu");

  const actions = Actions(args.actions);
  const parameters = Parameters(args.parameters);
  menu.append(actions.element, parameters.element);

  element.append(Button("pause", args.onPause), menu);
  return { element };
};

export { InGameMenu };
