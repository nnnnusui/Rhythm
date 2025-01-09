/** @public */
export const Arrays = (() => {
  const partition = <T>(array: T[], filter: Parameters<T[]["filter"]>[0]): [T[], T[]] => {
    let pass: T[] = [];
    let fail: T[] = [];
    array.forEach((it, index, all) => (filter(it, index, all) ? pass : fail).push(it));
    return [pass, fail];
  };

  /**
   * @ts-ignore: overloaded `closest()`. */
  const closest = <Content>(array: Content[]): ClosestFn<Content> => (target, getDiff) => {
    const defaultGetDiff = (content: number, target: number) => Math.abs(content - target);
    return array.reduce((prev, current) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const getDifference = getDiff ?? defaultGetDiff;
      const prevNumber = getDifference(prev, target);
      const currentNumber = getDifference(current, target);
      return currentNumber < prevNumber ? current : prev;
    });
  };

  return {
    partition,
    closest,
  };
})();

interface ClosestFn<Content> {
  <Target extends number & Content>(target: Target): Content;
  <Target>(target: Target, getDiff: (content: Content, target: Target) => number): Content;
}
