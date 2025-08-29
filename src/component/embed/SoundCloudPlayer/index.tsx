import { createUniqueId, untrack, createEffect } from "solid-js";

import { useSoundCloudWidgetApi, SoundCloudWidget } from "~/fn/signal/root/useSoundCloudWidgetApi";

import styles from "./SoundCloudPlayer.module.css";

export const SoundCloudPlayer = (p: {
  url: string;
  playing: boolean;
  seekTo: number;
  volume: number;
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
      () => {
        widget = newWidget;
        widget.setVolume(0);
        if (!p.preload) return;
        widget.play();
      },
    );
  };

  const setVolume = (ratio: number) => {
    if (!widget) return;
    const baseVolume = 12;
    log(`change volume to \`${baseVolume} * ${ratio}\`.`);
    widget.setVolume(baseVolume * ratio);
  };

  const seekTo = (offset: number) => {
    if (!widget) return;
    log(`seek to ${offset}.`);
    widget.seekTo(offset);
  };

  const play = () => {
    if (!widget) return;
    log("play.");
    setVolume(p.volume);
    widget.play();
  };

  const pause = () => {
    if (!widget) return;
    log("pause.");
    widget.pause();
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

  let volumeCache = untrack(() => p.volume);
  createEffect(() => {
    // change volume
    if (!widget) return;
    if (volumeCache === p.volume) return;
    setVolume(p.volume);
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
