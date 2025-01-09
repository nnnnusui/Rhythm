import { createUniqueId, untrack, createEffect } from "solid-js";

import { useSoundCloudWidgetApi, SoundCloudWidget } from "~/fn/signal/root/useSoundCloudWidgetApi";

import styles from "./SoundCloudPlayer.module.css";

export const SoundCloudPlayer = (p: {
  url: string;
  playing: boolean;
  seekTo: number;
  preload: boolean;
}) => {
  const id = createUniqueId();
  const log = (message: string) => console.log(`[SoundCloudPlayer:${id}] ${message}`);
  const api = useSoundCloudWidgetApi();
  const protocol = window.location.protocol;
  const embedUrl = () => {
    const params = new URLSearchParams({
      url: p.url,
      visual: "true",
      show_artwork: "true",
      show_teaser: "false",
      auto_play: "false",
      single_active: "false",
    });
    return `${protocol}//w.soundcloud.com/player/?${params.toString()}`;
  };

  let widget: SoundCloudWidget | undefined;
  const initPlayer = () => {
    if (!api) return;
    log("initialize.");
    const newWidget = api.Widget(id);
    newWidget.bind(
      api.Widget.Events.READY,
      () => widget = newWidget,
    );
  };

  const play = () => {
    if (!widget) return;
    log("play.");
    widget.setVolume(20);
    widget.play();
  };
  const pause = () => {
    if (!widget) return;
    log("pause.");
    widget.pause();
  };

  const seekTo = (offset: number) => {
    if (!widget) return;
    log(`seek to ${offset}.`);
    widget.seekTo(offset);
  };

  let playingCache = untrack(() => p.playing);
  createEffect(() => {
    // Apply the current status to the player.
    if (!widget) initPlayer();
    if (playingCache === p.playing) return;
    playingCache = p.playing;
    seekTo(untrack(() => Math.floor(p.seekTo)));
    if (p.playing) play();
    else pause();
  });

  return (
    <iframe
      title="SoundCloud widget"
      class={styles.SoundCloudPlayer}
      id={id}
      src={embedUrl()}
      allow="autoplay"
    />
  );
};
