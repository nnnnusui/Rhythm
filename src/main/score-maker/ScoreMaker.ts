import { Property } from "../util/Property";
import { Timer } from "../util/Timer";

const ScrollContent = (height: string) => {
  const element = document.createElement("section");
  element.classList.add("scroll-content");
  const header = document.createElement("h1");
  header.textContent = "ScrollContent";
  element.append(header);
  element.style.height = height;
  return { element };
};

const createElement = () => {
  const element = document.createElement("section");
  element.classList.add("score-maker");
  const header = document.createElement("h1");
  header.textContent = "ScoreMaker";
  element.append(header);
  return element;
};

const ScoreMaker = {
  new: (args: { target: HTMLElement; source: any }) => {
    const { source } = args;
    const element = createElement();
    element.append(ScrollContent(`${(source.duration / 1000) * 50}%`).element);
    args.target.append(element);

    element.scrollTop = element.scrollHeight;

    let scrollEventCanceller: ReturnType<HTMLElement["scrollTopLinearly"]> = {
      cancel: () => {},
    };

    const applyTimeToSourceObserver = ({ next }) => {
      source.time(next);
    };
    const duration = Property.new({
      init: source.duration,
    }).accessor;
    const { accessor: time, observers: timeObservers } = Property.new({
      init: source.time(),
      observers: [applyTimeToSourceObserver],
    });

    type Mode = "play" | "edit" | "preview";
    const mode = (() => {
      const applyScrollProgressToTime = () => {
        const scrollPercentage = 1 - element.scrollTopPercentage;
        time(duration() * scrollPercentage);
      };

      const timer = Timer.new({
        onTimer: time,
        onStart: () =>
          timeObservers
            .filter((it) => it === applyTimeToSourceObserver)
            .forEach((_, index) => timeObservers.splice(index)),
        onStop: () => timeObservers.push(applyTimeToSourceObserver),
      });
      const play = () => {
        scrollEventCanceller = element.scrollTopLinearly(0, source.duration);
        element.removeEventListener("scroll", applyScrollProgressToTime);
        source.play();
        timer.start(time());
      };
      const pause = () => {
        scrollEventCanceller.cancel();
        element.addEventListener("scroll", applyScrollProgressToTime);
        source.pause();
        timer.stop();
      };

      return Property.new<Mode>({
        init: "edit",
        observers: [
          ({ next }) => {
            switch (next) {
              case "play":
                return play();
              case "edit":
                return pause();
            }
          },
        ],
      }).accessor;
    })();

    element.addEventListener("click", () => {
      console.log(time());
      switch (source.state()) {
        case "playing":
          return mode("edit");
        default:
          return mode("play");
      }
    });
    return { element, mode };
  },
};
export { ScoreMaker };
