const PlayButton = (args: { onPlay: () => void; onPause: () => void }) => {
  const element = document.createElement("div");
  element.classList.add("play-button");
  let playing = false;
  element.addEventListener("pointerup", () => {
    if (playing) {
      element.classList.remove("playing");
      args.onPause();
    } else {
      element.classList.add("playing");
      args.onPlay();
    }
    playing = !playing;
  });
  return { element };
};
type PlayButton = ReturnType<typeof PlayButton>;
export { PlayButton };
