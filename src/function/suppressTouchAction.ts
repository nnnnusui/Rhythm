
export const suppressTouchAction: (target: HTMLElement) => void
  = (target) => {
    target.addEventListener(
      "touchstart",
      (event) => {
        (document.activeElement as HTMLElement).blur();
        const target = event.target as HTMLElement;
        if (target.tagName === "A") return;
        event.preventDefault();
      },
      { passive: false }
    );
  };
