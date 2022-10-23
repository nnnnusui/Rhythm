import {
  Accessor,
  createSignal,
  JSX,
} from "solid-js";

type Props = {
  intervalMs: Accessor<number>
  action: (event: PointerEvent) => void
}
const doubleTapInteraction = (props: Props) => {
  const [onInteract, setOnInteract] = createSignal(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [start, setStart] = createSignal<number>(0);

  const onPress: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setStart((prev) => {
        const current = Date.now();
        const interval = current - prev;
        const isDoubleTap = interval < props.intervalMs();
        setOnInteract(isDoubleTap);
        return current;
      });
    };
  const onMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = () => {
      setOnInteract(false);
    };
  const onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      if (!onInteract()) return;
      props.action(event);
    };

  return {
    onPress,
    onMove,
    onRelease,
  };
};

export default doubleTapInteraction;
