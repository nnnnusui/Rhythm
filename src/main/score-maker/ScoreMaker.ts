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

    const orderContainer = (() => {
      const element = document.createElement("section");
      element.classList.add("order-container");
      const header = document.createElement("h1");
      header.textContent = "OrderContainer";
      element.style.position = "absolute";
      element.append(header);
      return element;
    })();

    let scrollEventCanceller: ReturnType<HTMLElement["scrollTopLinearly"]> = {
      cancel: () => {},
    };

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
    const scrollContent = ScrollContent(`${(duration() / 1000) * 50}%`).element;
    const applyTimeToAnimation = ({ next }) => {
      animations.forEach((it) => (it.currentTime = next));
    };
    const applyTimeToSourceObserver = ({ next }) => {
      source.time(next);
    };
    const { accessor: time, observer: timeObserver } = Property.new({
      init: source.time(),
      observers: [applyTimeToAnimation, applyTimeToSourceObserver],
    });

    const element = createElement();
    element.append(orderContainer, scrollContent);
    args.target.append(element);
    scrollContent.scrollTop = scrollContent.scrollHeight;

    type Mode = "play" | "edit" | "preview";
    const mode = (() => {
      const applyScrollProgressToTime = () => {
        const scrollPercentage = 1 - scrollContent.scrollTopPercentage;
        time(duration() * scrollPercentage);
      };
      const timer = Timer.new({
        onTimer: time,
        onStart: () => timeObserver.remove(applyTimeToSourceObserver),
        onStop: () => timeObserver.add(applyTimeToSourceObserver),
      });
      const play = () => {
        scrollEventCanceller = scrollContent.scrollTopLinearly(0, duration());
        scrollContent.removeEventListener("scroll", applyScrollProgressToTime);
        source.play();
        timer.start(time());
      };
      const pause = () => {
        scrollEventCanceller.cancel();
        timer.stop();
        source.pause();
        scrollContent.addEventListener("scroll", applyScrollProgressToTime);
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
