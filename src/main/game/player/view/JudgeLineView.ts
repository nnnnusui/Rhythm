const JudgeLineView = (laneAmount: number) => {
  const element = document.createElement("div");
  element.classList.add("judge-line");
  return {
    element,
    y: () => element.getBoundingClientRect().top,
    actionPosGetterMap: new Map(
      [...Array(laneAmount)].map((_, index) => [
        index,
        () => {
          const rect = element.getBoundingClientRect();
          const singleLaneWidth = rect.width / laneAmount;
          const lineLocalX = singleLaneWidth * index + singleLaneWidth / 2;
          return {
            x: rect.left + lineLocalX,
            y: rect.top,
          };
        },
      ])
    ),
  };
};
type JudgeLineView = ReturnType<typeof JudgeLineView>;
export { JudgeLineView };
