type PollEvent = {
  index: number;
  current: Gamepad;
  before: Gamepad;
};
type EventMap = {
  poll: PollEvent;
};
type Event = EventMap[keyof EventMap];
type Type = keyof EventMap;
type Listener<Key extends keyof EventMap> = (event: EventMap[Key]) => void;
let eventListeners: ((e: Event) => void)[] = [];
const addEventListener = <K extends keyof EventMap>(
  type: K,
  listener: (event: EventMap[K]) => void,
  options?: {}
) => {
  eventListeners.push(listener);
};

const map = new Map<number, Gamepad>();
let enable = false;
const poll = () => {
  const currents = navigator.getGamepads();
  map.forEach((before, index) => {
    const current = currents[index];
    if (current === null) return;
    map.set(index, current);
    eventListeners.forEach((it) => it({ index, current, before }));
  });
  if (enable) requestAnimationFrame(poll);
};
const connectListener = (e: GamepadEvent) => {
  map.set(e.gamepad.index, e.gamepad);
};
const disconnectListener = (e: GamepadEvent) => {
  map.delete(e.gamepad.index);
};
const GamePad = {
  enable: () => {
    enable = true;
    poll();
    window.addEventListener("gamepadconnected", connectListener);
    window.addEventListener("gamepaddisconnected", disconnectListener);
  },
  disable: () => {
    enable = false;
    window.removeEventListener("gamepadconnected", connectListener);
    window.removeEventListener("gamepaddisconnected", disconnectListener);
  },
  map,
  addEventListener,
};

export { GamePad };
