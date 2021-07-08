const ScreenTransitionView = () => {
  const element = document.createElement("div");
  element.classList.add("screen-transition");
  const afterAnimation = (callback: () => void) =>
    element.addEventListener("animationend", callback, { once: true });
  return {
    element,
    transition: (args: {
      name: string;
      onMiddle?: () => void;
      onEnd: () => void;
    }) => {
      element.classList.add("during", "intro", args.name);
      afterAnimation(() => {
        element.classList.remove("intro");
        element.classList.add("outro");
        if (args.onMiddle) args.onMiddle();
        afterAnimation(() => {
          element.classList.remove("during", "outro", args.name);
          args.onEnd();
        });
      });
    },
  };
};

type ScreenTransitionView = ReturnType<typeof ScreenTransitionView>;
export { ScreenTransitionView };
