const suppressTouchMove = (target: EventTarget) => {
  target.addEventListener("touchmove", (e: Event) => e.preventDefault(), {
    passive: false,
  });
};
export default suppressTouchMove;
