import { createRoot } from "solid-js";

export type SoundCloudWidget
  = Methods
  & Getters

type Methods = {
  bind: (eventName: EventId, listener: any) => void
  unbind: (eventName: EventId) => void
  load: (url: string, options: any) => void
  play: () => void
  pause: () => void
  toggle: () => void
  seekTo: (ms: MilliSecond) => void
  setVolume: (volume: Volume) => void
  next: () => void
  prev: () => void
  skip: (tracks: number) => void
}
type Getters = {
  getVolume: Getter<Volume>
  getDuration: Getter<MilliSecond>
  getPosition: Getter<MilliSecond>
  getSounds: Getter<Sound[]>
  getCurrentSound: Getter<Sound>
  isPaused: Getter<boolean>
}

/**
 * 0 ~ 100
 */
type Volume = number
type MilliSecond = number
type Sound = any
type Getter<T> = (callback?: any) => T

type SoundCloudWidgetApi = {
  Widget: WidgetGetter & Events
}
type WidgetGetter = (target: HTMLIFrameElement | string) => SoundCloudWidget
type Events = {
  Events: UiEvent & AudioEvent
}
type EventId = string
type UiEvent = {
  READY: EventId
  CLICK_DOWNLOAD: EventId
  CLICK_BUY: EventId
  OPEN_SHARE_PANEL: EventId
  ERROR: EventId
}
type AudioEvent = {
  LOAD_PROGRESS: EventId
  PLAY_PROGRESS: EventId
  PLAY: EventId
  PAUSE: EventId
  FINISH: EventId
  SEEK: EventId
}

const loadScript = () => {
  // const element = document.createElement("script");
  // element.type = "text/javascript";
  // element.src = "https://w.soundcloud.com/player/api.js";
  // document.head.prepend(element);

  // const [SC, setSC] = createSignal((window as any).SC, { equals: false });
  const SC = (): SoundCloudWidgetApi => (window as any).SC;
  return SC;
};

const useSoundCloudWidgetApi = createRoot(loadScript);

export default useSoundCloudWidgetApi;
