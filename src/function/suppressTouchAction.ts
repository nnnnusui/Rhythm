
export const suppressTouchAction: (target: HTMLElement) => void
  = (target) => {
    target.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        (document.activeElement as HTMLElement)
          ?.blur();
      },
      { passive: false }
    );
  };
