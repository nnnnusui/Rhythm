import { Property } from "../util/Property";

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.prepend(tag);
type YT = any;
declare const YT: YT;

// https://developers.google.com/youtube/iframe_api_reference
const YouTube = (args: { width: number; height: number; videoId: string }) => {
  const element = document.createElement("div");
  const onPlayerReady = ({ target }: { target: YT }) => {
    target.setVolume(0);
  };
  let player = new YT.Player(element, {
    ...args,
    events: {
      onReady: onPlayerReady,
      // onStateChange: onPlayerStateChange,
    },
  });
  return {
    element: player.h,
    volume: Property.new<number>({
      init: 0,
      observers: [
        ({ next }) => {
          console.log(next);
          player.setVolume(next);
        },
      ],
    }).accessor,
  };
};

const fromUrl = (url: URL) => {
  switch (url.hostname) {
    case "www.youtube.com":
      return YouTube({
        width: window.innerWidth,
        height: window.innerHeight,
        videoId: url.searchParams.get("v"),
      });
    default:
      return "Not supported.";
  }
};

export const Source = {
  fromUrlString: (url: string) => fromUrl(new URL(url)),
  fromUrl,
};
