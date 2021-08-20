import youTubePlayerFactory from "youtube-player";

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.prepend(tag);
declare const YT: any;

// https://developers.google.com/youtube/iframe_api_reference
const YouTube = (args: { width: number; height: number; videoId: string }) => {
  const element = document.createElement("div");
  let player = new YT.Player(element, {
    ...args,
    events: {
      // onReady: onPlayerReady,
      // onStateChange: onPlayerStateChange,
    },
  });
  return {
    element: player.h,
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
