import youTubePlayerFactory from "youtube-player";

const YouTube = (args: {
  videoId: string;
  size: { width: number; height: number };
  onReady: () => void;
}) => {
  const element = document.createElement("div");
  element.classList.add("source");
  const source = youTubePlayerFactory(element, {
    width: args.size.width,
    height: args.size.height,
    videoId: args.videoId,
  });
  source.on("ready", args.onReady);
  return {
    ...source,
    kind: "YouTube",
    element,
    waitLoadAndPlay: (callback: () => void) => {
      let called = false;
      source.on("stateChange", (event) => {
        console.log(event.data);
        switch (event.data) {
          case 1:
            if (called) return;
            called = true;
            callback();
        }
      });
      source.playVideo();
    },
  };
};

type YouTube = ReturnType<typeof YouTube>;
export { YouTube };
