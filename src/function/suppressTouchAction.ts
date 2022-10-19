
export const suppressTouchAction: (target: HTMLElement) => void
  = (target) => {
    target.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
      },
      { passive: false }
    );
  };
