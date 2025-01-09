import { createRoot, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

/** @public */
export type SoundCloudWidget
  = Methods
  & Getters;

type Methods = {
  bind: (eventName: EventId, listener: any) => void;
  unbind: (eventName: EventId) => void;
  load: (url: string, options: any) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (ms: MilliSecond) => void;
  setVolume: (volume: Volume) => void;
  next: () => void;
  prev: () => void;
  skip: (tracks: number) => void;
};
type Getters = {
  getVolume: Getter<Volume>;
  getDuration: Getter<MilliSecond>;
  getPosition: Getter<MilliSecond>;
  getSounds: Getter<Sound[]>;
  getCurrentSound: Getter<Sound>;
  isPaused: Getter<boolean>;
};

/**
 * 0 ~ 100
 */
type Volume = number;
type MilliSecond = number;
type Sound = any;
type Getter<T> = (callback?: any) => T;

type SoundCloudWidgetApi = {
  Widget: WidgetGetter & {
    Events: Events;
  };
};
type WidgetGetter = (target: HTMLIFrameElement | string) => SoundCloudWidget;
type Events = UiEvent & AudioEvent;
type EventId = string;
type UiEvent = {
  READY: EventId;
  CLICK_DOWNLOAD: EventId;
  CLICK_BUY: EventId;
  OPEN_SHARE_PANEL: EventId;
  ERROR: EventId;
};
type AudioEvent = {
  LOAD_PROGRESS: EventId;
  PLAY_PROGRESS: EventId;
  PLAY: EventId;
  PAUSE: EventId;
  FINISH: EventId;
  SEEK: EventId;
};

declare global {
  interface Window {
    SC?: SoundCloudWidgetApi;
  }
}

const log = (message: string) => console.log(`[createSoundCloudWidgetApi] ${message}`);
const createSoundCloudWidgetApi = () => {
  if (isServer) {
    return () => undefined;
  }

  const element = document.createElement("script");
  onMount(() => {
    log("loading...");
    const scriptPath = "https://w.soundcloud.com/player/api.js";
    if (document.querySelector(`script[src="${scriptPath}"]`)) return;
    element.type = "text/javascript";
    element.src = scriptPath;
    document.head.prepend(element);
  });

  onCleanup(() => {
    log("cleanup.");
    element.remove();
  });

  // const [SC] = createSignal<SoundCloudWidgetApi | undefined>(window.SC);
  const SC = () => window.SC;

  return SC;
};

/** @public */
export const useSoundCloudWidgetApi = createRoot(createSoundCloudWidgetApi);
