const PlayButton = (args: { onPlay: () => void; onPause: () => void }) => {
  const it = document.createElement("div");
  it.classList.add("play-button", "invalid");
  let playing = false;
  return {
    element: it,
    playing: () => playing,
    activate: () => {
      it.classList.remove("invalid");
      it.addEventListener("pointerup", () => {
        if (playing) {
          it.classList.remove("playing");
          args.onPause();
        } else {
          it.classList.add("playing");
          args.onPlay();
        }
        playing = !playing;
      });
    },
  };
};
type PlayButton = ReturnType<typeof PlayButton>;
export { PlayButton };
