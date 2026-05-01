import { createEffect, onCleanup, onMount, untrack } from "solid-js";

import { useLogger } from "~/fn/context/LoggerContext";
import { useYouTubePlayerCache, YouTubeIframe } from "~/fn/signal/root/useYouTubeIframeApi";

import styles from "./YouTubePlayer.module.css";

export const YouTubePlayer = (p: {
  sourceId: string;
  videoId: string;
  playing: boolean;
  seekTo: number;
  volume: number;
  preload: boolean;
}) => {
  const logger = useLogger([`YouTubePlayer:${untrack(() => p.sourceId)}`]);
  logger.info`Rendering...`;

  let playerContainerRef!: HTMLDivElement;
  let player: YouTubeIframe | undefined;
  const playerCache = useYouTubePlayerCache({ targetElement: playerContainerRef, elementId: p.sourceId, videoId: p.videoId, preload: p.preload });
  onMount(() => {
    const iframe = playerCache?.iframe;
    if (!iframe) return;
    playerCache.mount(playerContainerRef);
    // playerContainerRef.moveBefore(iframe, null);
    player = playerCache.ytPlayer;
  });
  onCleanup(() => {
    playerCache?.unmount();
  });

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
    if (!player) player = playerCache?.ytPlayer;
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
    <div ref={playerContainerRef}
      class={styles.YouTubePlayer}
    />
  );
};
