import "@testing-library/jest-dom";
import { render } from "@solidjs/testing-library";
import { mockAnimationsApi } from "jsdom-testing-mocks";
import { describe, it, expect } from "vitest";

import styles from "./index.module.styl";

import This from "./index";

import AnimationInfo from "@/state/AnimationInfo";

mockAnimationsApi();

describe("Note", async () => {
  const Note = (
    props: {
      time: number
    }
  ) =>
    <This
      {...{
        game: {
          duration: 1,
          time: props.time,
        },
        time: 5,
        animation: AnimationInfo([
          {
            offset: -0.5,
            top: "40%",
          },{
            offset: 0,
            top: "0%",
          },{
            offset: 1,
            top: "80%",
          },{
            offset: 1.5,
            top: "120%",
          },
        ]),
        style: {
          width: "100%",
          height: "1em",
        },
        judge: {
          style: {
            width: "100%",
            height: ".4em",
          },
        },
        judged: false,
      }}
    />;

  describe("rendering by time", async () => {
    describe("before it appears", async () => {
      const time = 3.4;
      const { container } = render(() => <Note time={time} /> );
      const component = container.firstChild as HTMLElement;

      it("is not displayed", async () => {
        expect(component).toBeNull();
      });
    });

    describe("when appears", async () => {
      const time = 3.5;
      const { container } = render(() => <Note time={time} /> );
      const component = container.firstChild as HTMLElement;

      it("are displayed", async () => {
        expect(component).toBeDefined();
      });
    });

    describe("at the judge time", async () => {
      const time = 5;
      const { container } = render(() => <Note time={time} /> );
      const component = container.firstChild as HTMLElement;

      it("are displayed", async () => {
        expect(component).toBeDefined();
      });
    });

    describe("are displayed just before the end of the keyframes", async () => {
      const time = 5.5;
      const { container } = render(() => <Note time={time} /> );
      const component = container.firstChild as HTMLElement;

      it("are displayed", async () => {
        expect(component).toBeDefined();
      });
    });

    describe("are not displayed after the end of the rendering", async () => {
      const time = 5.6;
      const { container } = render(() => <Note time={time} /> );
      const component = container.firstChild as HTMLElement;

      it("is not displayed", async () => {
        expect(component).toBeNull();
      });
    });
  });

  describe("rendered content", () => {
    it("has style", async () => {
      const time = 5;
      const { container } = render(() => <Note time={time} /> );
      const component = container.firstChild as HTMLElement;

      expect(component.classList.contains(styles.Root)).toBe(true);
    });
  });
});
