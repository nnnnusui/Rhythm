const tag = document.createElement("script");
tag.src = "https://w.soundcloud.com/player/api.js";
tag.type = "text/javascript";
tag.async = true;
document.head.prepend(tag);
declare let SC: any;

const SoundCloud = (args: {
  size: { width: number; height: number };
  id: string;
  onReady: () => void;
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
    args.onReady();
  });
  return {
    kind: "SoundCloud" as const,
    element,
    play: (after: () => void) => {
      let called = false;
      widget.bind(SC.Widget.Events.PLAY, () => {
        if (called) return;
        called = true;
        after();
      });
      widget.play();
    },
    pause: (after: () => void) => {
      widget.pause();
      after();
    },
  };
};

type SoundCloud = ReturnType<typeof SoundCloud>;
export { SoundCloud };
