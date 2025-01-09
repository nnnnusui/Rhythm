import { createRoot, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

/** @public */
export type YouTubeIframe = {
  seekTo: (offset: number) => void;
  setVolume: (value: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

type Event = {
  target: YouTubeIframe;
};
type YouTubeIframeApi = {
  Player: new (id: string, options: {
    videoId: string;
    events: {
      onReady: (event: Event) => void;
    };
  }) => YouTubeIframe;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT?: YouTubeIframeApi;
  }
}

const log = (message: string) => console.log(`[createYouTubeIframeApi] ${message}`);
const createYouTubeIframeApi = () => {
  if (isServer) {
    return () => undefined;
  }

  const element = document.createElement("script");
  onMount(() => {
    log("loading...");
    const scriptPath = "https://www.youtube.com/player_api";
    if (document.querySelector(`script[src="${scriptPath}"]`)) return;
    element.type = "text/javascript";
    element.src = scriptPath;
    document.head.prepend(element);
  });

  onCleanup(() => {
    log("cleanup.");
    element.remove();
    window.onYouTubeIframeAPIReady = () => {};
  });

  const [YT, setYT] = createSignal<YouTubeIframeApi | undefined>(window.YT);
  window.onYouTubeIframeAPIReady = () => {
    log("loaded.");
    setYT(window.YT);
  };

  return YT;
};

/** @public */
export const useYouTubeIframeApi = createRoot(createYouTubeIframeApi);
