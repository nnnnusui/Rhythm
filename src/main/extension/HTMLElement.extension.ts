export {};
declare global {
  interface HTMLElement {
    scrollTopPercentage: number;
    scrollLeftPercentage: number;
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
