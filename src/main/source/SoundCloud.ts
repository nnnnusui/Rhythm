const tag = document.createElement("script");
tag.src = "https://w.soundcloud.com/player/api.js";
tag.type = "text/javascript";
tag.async = true;
document.head.prepend(tag);
declare let SC: any;

const SoundCloud = (args: {
  trackId: string;
  size: { width: number; height: number };
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}) => {
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
    setTimeout(args.onReady, 1000);
  });

  widget.bind(SC.Widget.Events.PLAY, args.onPlay);
  widget.bind(SC.Widget.Events.PAUSE, args.onPause);

  const play = () => widget.play();
  const pause = () => widget.pause();
  const restart = () => {
    pause();
    widget.seekTo(0);
    args.onRestart();
    setTimeout(play, 1000);
  };
  return {
    kind: "SoundCloud" as const,
    element,
    play,
    pause,
    restart,
  };
};

type SoundCloud = ReturnType<typeof SoundCloud>;
export { SoundCloud };
