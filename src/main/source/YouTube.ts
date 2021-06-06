import youTubePlayerFactory from "youtube-player";

const YouTube = (args: {
  videoId: string;
  size: { width: number; height: number };
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
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

  const play = () => source.playVideo();
  const pause = () => source.pauseVideo();
  const restart = () => {
    source.stopVideo();
    args.onRestart();
    setTimeout(play, 1000);
  };
  return {
    kind: "YouTube" as const,
    element,
    play,
    pause,
    restart,
  };
};

type YouTube = ReturnType<typeof YouTube>;
export { YouTube };
