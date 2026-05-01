import { createRoot, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { useLogger } from "~/fn/context/LoggerContext";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { useIframeCache } from "./useIframeCache";

/**
 * Minimal surface of the YouTube iframe player instance used by this app.
 *
 * This type represents the player methods the cache needs after the YouTube API
 * finishes initializing the embedded iframe.
 * @public
 */
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

/**
 * Loads the YouTube iframe API once and exposes the current global API object.
 *
 * The loader is rooted outside component instances so repeated renders do not
 * repeatedly inject the script tag or reset the readiness state.
 */
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

/**
 * Provides access to the shared YouTube iframe API loader.
 * @public
 */
export const useYouTubeIframeApi = createRoot(createYouTubeIframeApi);

/**
 * Keeps YouTube iframe instances and player handles reusable across rerenders.
 *
 * This layer combines the global YouTube API with `useIframeCache` so the app can
 * keep embedded players alive outside the JSX lifecycle, then mount them into the
 * active view only when needed.
 */
const createYouTubePlayerCache = () => {
  const logger = useLogger(["createYouTubePlayerCache"]);
  if (isServer) return () => undefined;
  const api = useYouTubeIframeApi();
  const iframeCache = useIframeCache();
  const ytPlayers = Wve.create<Record<Id, YouTubeIframe>>({});

  /**
   * Returns a cached player entry for a specific source.
   *
   * The first call creates the iframe and initializes the YouTube player when the
   * API is ready. Later calls reuse the same iframe and player so playback state is
   * not lost during component remounts or hot reloads.
   */
  return (p: { elementId: string; videoId: string; preload?: boolean; targetElement: HTMLElement }) => {
    const ytPlayer = ytPlayers.partial(p.elementId);
    const iframe = iframeCache.get({ elementId: p.elementId });
    if (!iframe) {
      logger.debug("create iframe.");
      iframeCache.set({
        elementId: p.elementId,
        createIframe: (iframe) => {
          const protocol = window.location.protocol;
          const params = new URLSearchParams({
            enablejsapi: "1",
            origin: document.location.origin,
            rel: "0",
          });
          const embedUrl = () => `${protocol}//www.youtube.com/embed/${p.videoId}?${params.toString()}`;
          iframe.id = p.elementId;
          iframe.src = embedUrl();
          iframe.title = "YouTube iframe";
          iframe.allow = "autoplay";
          return iframe;
        },
      });
    }
    if (!ytPlayer()) {
      logger.debug("initialize ytPlayer.");
      const YT = api();
      if (!YT) return undefined;
      new YT.Player(p.elementId, {
        videoId: p.videoId,
        events: {
          onReady: (event) => {
            const ytPlayerInstance = event.target;
            ytPlayer.set(ytPlayerInstance);
            ytPlayerInstance.setVolume(0);
            if (!p.preload) return;
            ytPlayerInstance.playVideo();
          },
        },
      });
    }

    return {
      /** Returns the cached iframe element for direct access when needed. */
      get iframe() { return iframeCache.get({ elementId: p.elementId }); },
      /** Returns the initialized YouTube player handle if setup has completed. */
      get ytPlayer() { return ytPlayer(); },
      /** Mounts the cached iframe into the requested UI position. */
      mount: (element: HTMLElement) => iframeCache.mount({ elementId: p.elementId, targetElement: element }),
      /** Detaches the cached iframe from the active view without destroying it. */
      unmount: () => iframeCache.unmount({ elementId: p.elementId }),
      /** Applies fallback-only visibility and stacking control for browsers without `moveBefore`. */
      setActive: (p: { elementId: string; active: boolean; inFront: boolean }) => iframeCache.setActive({ elementId: p.elementId, active: p.active, inFront: p.inFront }),
    };
  };
};

/**
 * Provides the shared YouTube player cache used by embed components.
 * @public
 */
export const useYouTubePlayerCache = createRoot(createYouTubePlayerCache);
