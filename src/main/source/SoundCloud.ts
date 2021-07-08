import { SourceBuilder } from "./Source";

declare let SC: any;
const reAppendScript = () => {
  Array(...document.head.children)
    .filter((it) => it.id === "sound-cloud-player-api-script")
    .forEach((it) => it.remove());
  const element = document.createElement("script");
  element.id = "sound-cloud-player-api-script";
  element.src = "https://w.soundcloud.com/player/api.js";
  document.head.prepend(element);
};
reAppendScript();

type Props = {
  kind: "SoundCloud";
  trackId: string;
};
const SoundCloud: SourceBuilder<Props> = (args) => {
  reAppendScript();
  const element = document.createElement("iframe");
  element.classList.add("source");
  element.width = `${args.size.width}`;
  element.height = `${args.size.height}`;
  element.allow = "autoplay";
  const parameters = [
    ["url", `https://api.soundcloud.com/tracks/${args.trackId}`],
    ["visual", true],
    ["show_teaser", false],
    ["auto_play", true],
  ] as const;
  const urlParameters = parameters
    .map(([key, value]) => `${key}=${encodeURI(value.toString())}`)
    .join("&");
  element.src = `https://w.soundcloud.com/player/?${urlParameters}`;
  const widget = SC.Widget(element);

  widget.bind(SC.Widget.Events.READY, () => {
    widget.setVolume(25);
  });
  let onRestart = () => {};

  const play = () => widget.play();
  const pause = () => widget.pause();
  const restart = () => {
    onRestart();
    widget.seekTo(0);
    play();
  };
  return {
    element,
    play,
    pause,
    restart,
    addEventListener: (kind, callback) => {
      switch (kind) {
        case "ready":
          widget.bind(SC.Widget.Events.READY, callback);
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
