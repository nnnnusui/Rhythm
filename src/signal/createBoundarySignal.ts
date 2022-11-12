import {
  Accessor,
  Signal,
  createSignal,
  createEffect,
} from "solid-js";
import { SignalOptions } from "solid-js/types/reactive/signal";

import overwriteSetter from "../function/overrideSetter";

type Props = {
  init: number,
  options?: SignalOptions<number>,
  lowerBound?: Accessor<number>,
  upperBound?: Accessor<number>,
}
const createBoundarySignal = (_props: Props): Signal<number> => {
  const props = {
    ..._props,
    lowerBound: () =>
      _props?.lowerBound
        ? _props.lowerBound()
        : undefined,
    upperBound: () =>
      _props?.upperBound
        ? _props.upperBound()
        : undefined,
  };
  const [state, _setState] = createSignal(props.init, props.options);
  const setState = overwriteSetter({
    setter: _setState,
    overwrite: ({ current }) => {
      const lowerBound = props.lowerBound();
      const upperBound = props.upperBound();
      if (lowerBound && current < lowerBound)
        return lowerBound;
      if (upperBound && current > upperBound)
        return upperBound;
      return current;
    },
  });

  createEffect(() => {
    const lowerBound = props.lowerBound();
    if (lowerBound === undefined) return;
    if (lowerBound <= state()) return;
    setState(lowerBound);
  });
  createEffect(() => {
    const upperBound = props.upperBound();
    if (upperBound === undefined) return;
    if (state() <= upperBound) return;
    setState(upperBound);
  });

  return [state, setState];
};

export default createBoundarySignal;
