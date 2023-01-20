import "@testing-library/jest-dom";
import { render } from "@solidjs/testing-library";
import { describe, it, expect } from "vitest";

import styles from "./index.module.styl";

import This from "./index";

describe("<Game /> test", () => {
  const Game = () =>
    <This
      time={0}
      duration={1}
      score={{ notes: [] }}
    />;
  const { container } = render(() => <Game /> );
  const component = container.firstChild as HTMLElement;

  it("has rendered", async () => {
    expect(component).toBeInTheDocument();
  });
  it("has class", async () => {
    expect(component.classList.contains(styles.Root)).toBe(true);
  });
});
