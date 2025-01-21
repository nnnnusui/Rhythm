import { Accessor, createRoot, onCleanup } from "solid-js";

import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { Objects } from "../objects";

/** @public */
export const action = (element: HTMLElement, p: Accessor<Props>) => {
  const configMap = useActionConfigMap();
  const keyPrefix = () => p().keyPrefix;
  const actionMap = () => Objects.modify(p().actionMap, (entries) => entries
    .map(([key, value]) => ([`${keyPrefix()}.${key}`, value])),
  );
  const activeOnClick = ["BUTTON"].includes(element.tagName);

  configMap.default.set(actionMap());

  const onFocusIn = () => {
    console.log(`focusin: ${keyPrefix()}`);
  };
  const onPointerEnter = (event: PointerEvent) => {
    if (event.target !== event.currentTarget) return;
    console.log(`pointerEnter: ${keyPrefix()}`);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.target !== event.currentTarget) return;
    console.log(`pointerLeave: ${keyPrefix()}`);
  };
  const onClick = () => {
    if (!activeOnClick) return;
  };
  const onKeyDown = (event: KeyboardEvent) => {
    Objects.entries(actionMap())
      .forEach(([,config]) => {
        if (config.keyEvent !== event.key) return;
        event.preventDefault();
        config.action();
      });
  };
  element.addEventListener("focusin", onFocusIn, { capture: true });
  element.addEventListener("pointerenter", onPointerEnter, { capture: true });
  element.addEventListener("pointerleave", onPointerLeave, { capture: true });
  element.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeyDown);
  onCleanup(() => {
    element.removeEventListener("focusin", onFocusIn, { capture: true });
    element.removeEventListener("pointerenter", onPointerEnter, { capture: true });
    element.removeEventListener("pointerleave", onPointerLeave, { capture: true });
    element.removeEventListener("click", onClick);
    window.removeEventListener("keydown", onKeyDown);
  });
};

type Props = {
  keyPrefix: string;
  actionMap: Record<string, Action>;
};
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      action: Props;
    }
  }
}

type Action = {
  action: () => void;
} & ActionOptions;

type ActionOptions = {
  keyEvent: string;
};

type ConfigId = Id;
type ActionId = Id;
const createActionConfigMap = () => {
  const state = Wve.create<Record<ConfigId, Record<ActionId, ActionOptions>>>({});
  const _default = Wve.create<Record<ActionId, ActionOptions>>({});
  return () => Object.assign(state, { default: _default });
};

/** @public */
export const useActionConfigMap = createRoot(createActionConfigMap);
