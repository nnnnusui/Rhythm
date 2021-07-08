const ScreenTransitionView = () => {
  const element = document.createElement("div");
  element.classList.add("screen-transition");
  const afterAnimation = (callback: () => void) =>
    element.addEventListener("animationend", callback, { once: true });
  return {
    element,
    transition: (args: {
      name: string;
      onStart?: () => void;
      onMiddle?: () => void;
      onEnd?: () => void;
    }) => {
      element.classList.add("during", "intro", args.name);
      if (args.onStart) args.onStart();
      afterAnimation(() => {
        element.classList.remove("intro");
        element.classList.add("outro");
        if (args.onMiddle) args.onMiddle();
        afterAnimation(() => {
          element.classList.remove("during", "outro", args.name);
          if (args.onEnd) args.onEnd();
        });
      });
    },
  };
};

type ScreenTransitionView = ReturnType<typeof ScreenTransitionView>;
export { ScreenTransitionView };
