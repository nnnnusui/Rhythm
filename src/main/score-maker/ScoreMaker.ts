import { Property } from "../util/Property";
import { Timer } from "../util/Timer";

const ScrollContent = (height: string) => {
  const element = document.createElement("section");
  element.classList.add("scroll-content");
  const header = document.createElement("h1");
  header.textContent = "ScrollContent";
  const scroller = document.createElement("div");
  element.append(header, scroller);
  scroller.style.height = height;
  const scrollableHeight = () => element.scrollHeight - element.clientHeight;
  return {
    element,
    scrollByProgress: (progress: number) =>
      (element.scrollTop = (1 - progress) * scrollableHeight()),
    progress: () => 1 - element.scrollTop / scrollableHeight(),
  };
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

    const orderContainer = (() => {
      const element = document.createElement("section");
      element.classList.add("order-container");
      const header = document.createElement("h1");
      header.textContent = "OrderContainer";
      element.style.position = "absolute";
      element.append(header);
      return element;
    })();

    const duration = Property.new({
      init: source.duration,
    }).accessor;

    const animations = Array.from({ length: 100 }, (_, index) => {
      const element = document.createElement("div");
      element.textContent = `${index}`;
      element.style.position = "absolute";
      element.style.backgroundColor = "white";
      element.style.top = "-100%";
      orderContainer.append(element);
      return new Animation(
        new KeyframeEffect(
          element,
          { top: ["0", "100vh"] },
          {
            delay: index * 500,
            duration: 2000,
          }
        )
      );
    });
    const scrollContent = ScrollContent(`${(duration() / 1000) * 50}%`);
    const applyTimeToAnimation = ({ next }) => {
      animations.forEach((it) => (it.currentTime = next));
    };
    const applyTimeToScroll = ({ next }) => {
      const progress = next / duration();
      scrollContent.scrollByProgress(progress);
    };
    const applyTimeToSource = ({ next }) => {
      source.time(next);
    };
    const { accessor: time, observer: timeObserver } = Property.new({
      init: source.time(),
      observers: [applyTimeToAnimation, applyTimeToScroll, applyTimeToSource],
    });

    type Mode = "play" | "edit" | "preview";
    const mode = (() => {
      const applyScrollProgressToTime = () => {
        time(duration() * scrollContent.progress());
      };
      const timer = Timer.new({ onTimer: time });

      const play = () => {
        source.play();
        scrollContent.element.removeEventListener(
          "scroll",
          applyScrollProgressToTime
        );
        timeObserver.remove(applyTimeToSource);
        timeObserver.add(applyTimeToScroll);
        timer.start(time());
      };
      const pause = () => {
        timer.stop();
        timeObserver.remove(applyTimeToScroll);
        timeObserver.add(applyTimeToSource);
        scrollContent.element.addEventListener(
          "scroll",
          applyScrollProgressToTime
        );
        source.pause();
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

    const element = createElement();
    element.addEventListener("click", () => {
      switch (source.state()) {
        case "playing":
          return mode("edit");
        default:
          return mode("play");
      }
    });
    element.append(orderContainer, scrollContent.element);
    args.target.append(element);
    scrollContent.scrollByProgress(0);

    return { element, mode };
  },
};
export { ScoreMaker };
