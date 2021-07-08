import { ScreenTransitionView } from "./ScreenTransitionView";

const Launcher = (
  transitionView: ScreenTransitionView,
  onLaunch: () => void
) => {
  const element = document.createElement("button");
  element.classList.add("launcher");
  element.type = "button";
  element.textContent = "Click or tap to start.";
  element.addEventListener("click", () =>
    transitionView.transition({
      name: "launch",
      onStart: () => onLaunch(),
      onMiddle: () => element.remove(),
    })
  );
  return { element };
};

type Launcher = ReturnType<typeof Launcher>;
export { Launcher };
