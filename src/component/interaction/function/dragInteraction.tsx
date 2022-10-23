import {
  createSignal,
  JSX,
  batch,
  Accessor,
} from "solid-js";

type Props<T> = {
  defaultState: T
  startStateFromEvent: (event: PointerEvent) => T
  currentStateFromEvent: (start: Accessor<T>) => (event: PointerEvent) => T
}
const dragInteraction = <T,>(props: Props<T>) => {
  const [onInteract, setOnInteract] = createSignal(false);
  const [start, setStart] = createSignal<T>(props.defaultState);
  const [current, setCurrent] = createSignal<T>(props.defaultState);

  const onPress: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      batch(() => {
        setOnInteract(true);
        setStart(() => props.startStateFromEvent(event));
      });
    };
  const onMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      if (!onInteract()) return;
      setCurrent(() => props.currentStateFromEvent(start)(event));
    };
  const onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      batch(() => {
        setOnInteract(false);
        setCurrent(() => props.currentStateFromEvent(start)(event));
      });
    };

  return {
    onPress,
    onMove,
    onRelease,
    current,
  };
};

export default dragInteraction;
