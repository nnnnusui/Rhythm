const ScreenTransitionView = () => {
  const element = document.createElement("div");
  element.classList.add("screen-transition");
  const afterAnimation = (callback: () => void) =>
    element.addEventListener("animationend", callback, { once: true });
  return {
    element,
    transition: (name: string, onMiddle: () => void, onEnd: () => void) => {
      element.classList.add("during", "intro", name);
      afterAnimation(() => {
        element.classList.remove("intro");
        element.classList.add("outro");
        onMiddle();
        afterAnimation(() => {
          element.classList.remove("during", "outro", name);
          onEnd();
        });
      });
    },
  };
};

type ScreenTransitionView = ReturnType<typeof ScreenTransitionView>;
export { ScreenTransitionView };
