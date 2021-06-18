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

  let onRestart = () => {};

  const play = () => source.playVideo();
  const pause = () => source.pauseVideo();
  const restart = () => {
    source.stopVideo();
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
        case "play":
          source.on("stateChange", (event) => {
            if (event.data !== 1) return;
            callback();
          });
          break;
        case "pause":
          source.on("stateChange", (event) => {
            if (event.data !== 2) return;
            callback();
          });
          break;
        case "restart":
          onRestart = callback;
          break;
      }
    },
  };
};

type YouTube = ReturnType<typeof YouTube>;
export { YouTube, Props as YouTubeProps };
