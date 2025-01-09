import { createEffect, createUniqueId, untrack } from "solid-js";

import { useYouTubeIframeApi, YouTubeIframe } from "~/fn/signal/root/useYouTubeIframeApi";

import styles from "./YouTubePlayer.module.css";

export const YouTubePlayer = (p: {
  videoId: string;
  playing: boolean;
  seekTo: number;
  preload: boolean;
}) => {
  const id = createUniqueId();
  const log = (message: string) => console.log(`[YouTubePlayer:${id}] ${message}`);
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
    log("initialize.");
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

  const play = () => {
    if (!player) return;
    log("play.");
    player.setVolume(20);
    player.playVideo();
  };
  const pause = () => {
    if (!player) return;
    log("pause.");
    player.pauseVideo();
  };

  const seekTo = (offset: number) => {
    if (!player) return;
    log(`seek to ${offset}.`);
    player.seekTo(offset);
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
