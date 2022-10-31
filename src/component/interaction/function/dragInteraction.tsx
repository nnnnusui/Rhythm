import {
  createSignal,
  JSX,
  batch,
  Accessor,
} from "solid-js";

type State<T> = {
  event: PointerEvent
  value: T
}
type Props<T> = {
  onStart: (event: PointerEvent) => T
  onUpdate: (start: Accessor<State<T>>) => (event: PointerEvent) => T
}
const dragInteraction = <T,>(props: Props<T>) => {
  const [pressed, setPressed] = createSignal(false);
  const [onInteract, setOnInteract] = createSignal(false);
  const [start, setStart] = createSignal<State<T>>({} as State<T>);

  const onPress: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      batch(() => {
        setPressed(true);
        setStart(() => ({
          event,
          value: props.onStart(event),
        }));
      });
    };
  const onMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      if (!pressed()) return;
      batch(() => {
        setOnInteract(true);
        props.onUpdate(start)(event);
      });
    };
  const onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      batch(() => {
        if (onInteract()) {
          props.onUpdate(start)(event);
        }
        setPressed(false);
        setOnInteract(false);
      });
    };

  return {
    onPress,
    onMove,
    onRelease,
  };
};

export default dragInteraction;
