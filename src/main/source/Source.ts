import { Property } from "../util/Property";

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.prepend(tag);
type YT = any;
declare const YT: YT;

// https://developers.google.com/youtube/iframe_api_reference
const YouTube =
  (propsFromUrl: { videoId: string }) =>
  (args: { target: HTMLElement | string }) => {
    return new Promise<any>((resolve, reject) => {
      const onPlayerReady = ({ target: player }: { target: YT }) => {
        resolve({
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
