const tag = document.createElement("script");
tag.src = "https://w.soundcloud.com/player/api.js";
tag.type = "text/javascript";
tag.async = true;
document.head.prepend(tag);
declare let SC: any;

const SoundCloud = (args: {
  id: string;
  size: { width: number; height: number };
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
}) => {
  const element = document.createElement("iframe");
  element.classList.add("source");
  element.width = `${args.size.width}`;
  element.height = `${args.size.height}`;
  element.allow = "autoplay";
  const parameters = [
    ["url", `https://api.soundcloud.com/tracks/${args.id}`],
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

  return {
    kind: "SoundCloud" as const,
    element,
    play: () => widget.play(),
    pause: () => widget.pause(),
  };
};

type SoundCloud = ReturnType<typeof SoundCloud>;
export { SoundCloud };
