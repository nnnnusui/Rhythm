import { SourceBuilder } from "./Source";

declare let SC: any;

type Props = {
  kind: "SoundCloud";
  trackId: string;
};
const SoundCloud: SourceBuilder<Props> = (args) => {
  const element = document.createElement("iframe");
  element.classList.add("source");
  element.width = `${args.size.width}`;
  element.height = `${args.size.height}`;
  element.allow = "autoplay";
  const parameters = [
    ["url", `https://api.soundcloud.com/tracks/${args.trackId}`],
    ["visual", true],
  ] as const;
  const urlParameters = parameters
    .map(([key, value]) => `${key}=${encodeURI(value.toString())}`)
    .join("&");
  element.src = `https://w.soundcloud.com/player/?${urlParameters}`;
  const widget = SC.Widget(element);

  widget.bind(SC.Widget.Events.READY, () => {
    widget.setVolume(50);
  });
  let onRestart = () => {};

  const play = () => widget.play();
  const pause = () => widget.pause();
  const restart = () => {
    pause();
    widget.seekTo(0);
    onRestart();
    setTimeout(play, 1000);
  };
  return {
    element,
    play,
    pause,
    restart,
    addEventListener: (kind, callback) => {
      switch (kind) {
        case "ready":
          widget.bind(SC.Widget.Events.READY, setTimeout(callback, 2000));
          break;
        case "play":
          widget.bind(SC.Widget.Events.PLAY, callback);
          break;
        case "pause":
          widget.bind(SC.Widget.Events.PAUSE, callback);
          break;
        case "restart":
          onRestart = callback;
          break;
      }
    },
  };
};

type SoundCloud = ReturnType<typeof SoundCloud>;
export { SoundCloud, Props as SoundCloudProps };
