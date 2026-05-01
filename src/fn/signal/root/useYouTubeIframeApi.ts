import { createRoot, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { useLogger } from "~/fn/context/LoggerContext";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";

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

const createYouTubeIframeApi = () => {
  const logger = useLogger(["createYouTubeIframeApi"]);
  if (isServer) return () => () => undefined;

  const script = document.createElement("script");
  onMount(() => {
    logger.info("loading...");
    const scriptPath = "https://www.youtube.com/player_api";
    if (document.querySelector(`script[src="${scriptPath}"]`)) return;
    script.type = "text/javascript";
    script.src = scriptPath;
    document.head.prepend(script);
  });

  onCleanup(() => {
    logger.info("cleanup.");
    script.remove();
    window.onYouTubeIframeAPIReady = () => {};
  });

  const [YT, setYT] = createSignal<YouTubeIframeApi | undefined>(window.YT);
  window.onYouTubeIframeAPIReady = () => {
    logger.info("loaded.");
    setYT(window.YT);
  };

  return () => YT;
};

/** @public */
export const useYouTubeIframeApi = createRoot(createYouTubeIframeApi);

const createYouTubePlayerCache = () => {
  const logger = useLogger(["createYouTubePlayerCache"]);
  if (isServer) return () => undefined;
  const api = useYouTubeIframeApi();
  const players = Wve.create<Record<Id, {
    iframe: HTMLIFrameElement;
    ytPlayer?: YouTubeIframe;
  }>>({});

  const container = document.createElement("div");
  onMount(() => {
    logger.debug("loading...");
    if (document.body.querySelector("div#YouTubePlayerContainer")) return;
    container.id = "YouTubePlayerContainer";
    container.style.display = "none";
    document.body.prepend(container);
  });

  onCleanup(() => {
    logger.debug("cleanup.");
    container.remove();
  });

  return (p: { elementId: string; videoId: string; preload?: boolean; targetElement: HTMLElement }) => {
    const player = players.partial(p.elementId);
    if (!player()?.iframe) {
      logger.debug("create iframe.");
      const protocol = window.location.protocol;
      const params = new URLSearchParams({
        enablejsapi: "1",
        origin: document.location.origin,
        rel: "0",
      });
      const embedUrl = () => `${protocol}//www.youtube.com/embed/${p.videoId}?${params.toString()}`;
      const iframe = document.createElement("iframe");
      iframe.id = p.elementId;
      iframe.src = embedUrl();
      iframe.title = "YouTube iframe";
      iframe.allow = "autoplay";
      container.append(iframe);
      player.set({ iframe });
    }
    if (!player()?.ytPlayer) {
      logger.debug("initialize ytPlayer.");
      const YT = api();
      if (!YT) return undefined;
      new YT.Player(p.elementId, {
        videoId: p.videoId,
        events: {
          onReady: (event) => {
            const ytPlayer = event.target;
            player.set("ytPlayer", ytPlayer);

            ytPlayer.setVolume(0);
            if (!p.preload) return;
            ytPlayer.playVideo();
          },
        },
      });
    }

    return {
      get iframe() { return player()?.iframe; },
      get ytPlayer() { return player()?.ytPlayer; },
      mount: (element: HTMLElement) => element.moveBefore(player()?.iframe!, null),
      unmount: () => container.moveBefore(player()?.iframe!, null),
    };
  };
};

/** @public */
export const useYouTubePlayerCache = createRoot(createYouTubePlayerCache);
