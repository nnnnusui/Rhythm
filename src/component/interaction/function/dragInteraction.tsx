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
  const [pressed, setPressed] = createSignal(false);
  const [onInteract, setOnInteract] = createSignal(false);
  const [start, setStart] = createSignal<T>(props.defaultState);
  const [current, setCurrent] = createSignal<T>(props.defaultState);

  const onPress: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      batch(() => {
        setPressed(true);
        setStart(() => props.startStateFromEvent(event));
      });
    };
  const onMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      if (!pressed()) return;
      batch(() => {
        setOnInteract(true);
        setCurrent(() => props.currentStateFromEvent(start)(event));
      });
    };
  const onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      batch(() => {
        if (onInteract()) {
          setCurrent(() => props.currentStateFromEvent(start)(event));
        }
        setPressed(false);
        setOnInteract(false);
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
