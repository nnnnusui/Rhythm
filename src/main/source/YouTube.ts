import youTubePlayerFactory from "youtube-player";

const YouTube = (args: {
  videoId: string;
  size: { width: number; height: number };
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("source");
  const source = youTubePlayerFactory(element, {
    width: args.size.width,
    height: args.size.height,
    videoId: args.videoId,
  });
  source.on("ready", args.onReady);
  source.on("stateChange", (event) => {
    switch (event.data) {
      case 1:
        args.onPlay();
        break;
      case 2:
        args.onPause();
        break;
    }
  });
  return {
    kind: "YouTube" as const,
    element,
    play: () => source.playVideo(),
    pause: () => source.pauseVideo(),
  };
};

type YouTube = ReturnType<typeof YouTube>;
export { YouTube };
