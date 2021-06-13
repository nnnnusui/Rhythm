import youTubePlayerFactory from "youtube-player";
import { SourceBuilder } from "./Source";

type Props = {
  kind: "YouTube";
  videoId: string;
};
const YouTube: SourceBuilder<Props> = (args) => {
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
    element,
    play,
    pause,
    restart,
  };
};

type YouTube = ReturnType<typeof YouTube>;
export { YouTube, Props as YouTubeProps };
