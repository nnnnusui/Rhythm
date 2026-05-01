import { createEffect, createUniqueId, untrack } from "solid-js";

import { useLogger } from "~/fn/context/LoggerContext";
import { useYouTubeIframeApi, YouTubeIframe } from "~/fn/signal/root/useYouTubeIframeApi";

import styles from "./YouTubePlayer.module.css";

export const YouTubePlayer = (p: {
  videoId: string;
  playing: boolean;
  seekTo: number;
  volume: number;
  preload: boolean;
}) => {
  const id = createUniqueId();
  const logger = useLogger([`YouTubePlayer:${id}`]);
  logger.info`Rendering...`;

  const api = useYouTubeIframeApi();
  const protocol = window.location.protocol;
  const params = new URLSearchParams({
    enablejsapi: "1",
    origin: document.location.origin,
    rel: "0",
  });
  const embedUrl = () => `${protocol}//www.youtube.com/embed/${p.videoId}?${params.toString()}`;

  let player: YouTubeIframe | undefined;
  const initPlayer = () => {
    if (!api) return;
    logger.debug("initialize.");
    new api.Player(id, {
      videoId: p.videoId,
      events: {
        onReady: (event) => {
          player = event.target;
          player.setVolume(0);
          if (!p.preload) return;
          player.playVideo();
        },
      },
    });
  };

  const setVolume = (ratio: number) => {
    if (!player) return;
    const baseVolume = 30;
    logger.debug(`change volume to \`${baseVolume} * ${ratio}\`.`);
    player.setVolume(baseVolume * ratio);
  };

  const seekTo = (offset: number) => {
    if (!player) return;
    logger.debug(`seek to ${offset}.`);
    player.seekTo(offset);
  };

  const play = () => {
    if (!player) return;
    logger.debug("play.");
    setVolume(p.volume);
    player.playVideo();
  };

  const pause = () => {
    if (!player) return;
    logger.debug("pause.");
    player.pauseVideo();
  };

  let playingCache = untrack(() => p.playing);
  createEffect(() => {
    // Apply the current status to the player.
    if (!player) initPlayer();
    if (playingCache === p.playing) return;
    playingCache = p.playing;
    seekTo(untrack(() => p.seekTo / 1000));
    if (p.playing) play();
    else pause();
  });

  let volumeCache = untrack(() => p.volume);
  createEffect(() => {
    // change volume
    if (!player) return;
    if (volumeCache === p.volume) return;
    setVolume(p.volume);
  });

  return (
    <iframe
      title="YouTube iframe"
      class={styles.YouTubePlayer}
      id={id}
      src={embedUrl()}
      allow="autoplay"
    />
  );
};
