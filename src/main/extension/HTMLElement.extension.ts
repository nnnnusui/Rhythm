export {};
declare global {
  interface HTMLElement {
    scrollTopPercentage: number;
    scrollLeftPercentage: number;
    scrollTopLinearly(to: number, duration: number): { cancel: () => void };
  }
}

Object.defineProperty(HTMLElement.prototype, "scrollTopPercentage", {
  get: function () {
    return this.scrollTop / (this.scrollHeight - this.clientHeight);
  },
});
Object.defineProperty(HTMLElement.prototype, "scrollLeftPercentage", {
  get: function () {
    return this.scrollLeft / (this.scrollWidth - this.clientWidth);
  },
});

Object.defineProperty(HTMLElement.prototype, "scrollTopLinearly", {
  value: function (to: number, duration: number) {
    const startTime = performance.now();
    const range = to - this.scrollTop;
    let canceled = false;
    const loop = (nowTime) => {
      if (canceled) return;
      const elapsedTime = nowTime - startTime;
      if (duration <= elapsedTime) {
        this.scrollTo(0, to);
        return;
      }
      const progress = elapsedTime / duration;
      this.scrollTo(0, to - range * (1 - progress));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return { cancel: () => (canceled = true) };
  },
});
