import { Property } from "../util/Property";

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.prepend(tag);
type YT = any;
declare const YT: YT;
const StateMap = {
  "-1": "unstarted" as const,
  "0": "ended" as const,
  "1": "playing" as const,
  "2": "paused" as const,
  "3": "buffering" as const,
  "5": "video cued" as const,
};
type StateMap = typeof StateMap;

// https://developers.google.com/youtube/iframe_api_reference
const YouTube =
  (propsFromUrl: { videoId: string }) =>
  (args: { target: HTMLElement | string }) => {
    return new Promise<any>((resolve, reject) => {
      const onPlayerReady = ({ target: player }: { target: YT }) => {
        const duration = player.getDuration();
        const time = Property.new<number>({
          init: player.getCurrentTime(),
          observers: [({ next }) => player.seekTo(next)],
        }).accessor;
        resolve({
          element: player.h,
          duration,
          time,
          timeRemaining: () => duration - time(),
          volume: Property.new<number>({
            init: player.getVolume(),
            observers: [({ next }) => player.setVolume(next)],
          }).accessor,
          state: () => StateMap[player.getPlayerState()],
          play: () => player.playVideo(),
          pause: () => player.pauseVideo(),
          stop: () => player.stopVideo(),
        });
      };
      new YT.Player(args.target, {
        videoId: propsFromUrl.videoId,
        events: {
          onReady: onPlayerReady,
          // onStateChange: onPlayerStateChange,
        },
      });
    });
  };

const fromUrl = (url: URL) => {
  switch (url.hostname) {
    case "www.youtube.com":
      return YouTube({
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
