import {
  Accessor,
  batch,
  createEffect,
  createSignal,
  JSX,
  untrack,
} from "solid-js";

type Props = {
  intervalMs: Accessor<number>
  onIntervalPassed: JSX.EventHandler<HTMLElement, PointerEvent>
  onCancel: JSX.EventHandler<HTMLElement, PointerEvent>
  onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
}
const longTapInteraction = (props: Props) => {
  const [onInteract, setOnInteract] = createSignal(false);
  const [launched, setLaunched] = createSignal(false);
  const [taskId, setTaskId] = createSignal<number>(-1);

  createEffect(() => {
    if (onInteract()) return;
    untrack(() => {
      setLaunched(false);
      clearInterval(taskId());
    });
  });

  const onPress: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const task = () => {
        setLaunched(true);
        props.onIntervalPassed(event);
      };
      const taskId = setInterval(task, props.intervalMs());
      batch(() => {
        setTaskId(taskId);
        setOnInteract(true);
      });
    };
  const onMove: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      batch(() => {
        if (!onInteract()) return;
        setOnInteract(false);
        props.onCancel(event);
      });
    };
  const onRelease: JSX.EventHandler<HTMLElement, PointerEvent>
    = (event) => {
      batch(() => {
        if (launched()) {
          props.onRelease(event);
        } else {
          if (onInteract()) {
            props.onCancel(event);
          }
        }
        setOnInteract(false);
      });
    };

  return {
    onPress,
    onMove,
    onRelease,
  };
};

export default longTapInteraction;
