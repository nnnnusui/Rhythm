import { Property } from "../util/Property";
import { Timer } from "../util/Timer";
import { OrderContainer } from "./OrderContainer";
import { ScrollContent } from "./ScrollContent";

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
    const scrollContent = ScrollContent.new();

    const orderContainer = OrderContainer.new();
    const animations = /* sample */ Array.from({ length: 100 }, (_, index) => {
      const element = document.createElement("div");
      element.textContent = `${index}`;
      element.style.position = "absolute";
      element.style.backgroundColor = "white";
      element.style.top = "-100%";
      orderContainer.element.append(element);
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

    const { accessor: duration } = Property.new<number>({
      init: source.duration,
      observers: [
        ({ next, before }) => {
          const beforeTime = scrollContent.progress() * before;
          scrollContent.setHeightByMilliSecond(next);
          const nextTime =
            beforeTime <= next ? beforeTime : beforeTime + next - before;
          scrollContent.scrollByProgress(nextTime / next);
        },
      ],
    });

    type Mode = "play" | "edit" | "preview";
    const { accessor: mode } = (() => {
      const timer = Timer.new({
        onTimer: (time) => scrollContent.scrollByProgress(time / duration()),
      });
      const time = () => scrollContent.progress() * duration();
      const scrollToSource = () => source.time(time());
      scrollContent.element.addEventListener("scroll", () =>
        animations.forEach((it) => (it.currentTime = time()))
      );

      const play = () => {
        source.play();
        scrollContent.element.removeEventListener("scroll", scrollToSource);
        timer.start(time());
      };
      const pause = () => {
        timer.stop();
        scrollContent.element.addEventListener("scroll", scrollToSource);
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
      });
    })();

    const element = createElement();
    (() => {
      // parameter change form sample
      const root = element;
      (() => {
        const element = document.createElement("button");
        element.name = "state";
        element.addEventListener("pointerdown", (event) => {
          switch (source.state()) {
            case "playing":
              return mode("edit");
            default:
              return mode("play");
          }
        });
        root.append(element);
      })();
      (() => {
        const element = document.createElement("input");
        element.name = "duration";
        element.type = "number";
        element.placeholder = "duration";
        element.addEventListener("keypress", (event) => {
          if (event.key == "Enter") duration(Number(element.value));
        });
        root.append(element);
      })();
    })();
    element.append(orderContainer.element, scrollContent.element);
    args.target.append(element);
    scrollContent.setHeightByMilliSecond(duration());
    scrollContent.scrollByProgress(0);

    return { element, mode };
  },
};
export { ScoreMaker };
