import "@testing-library/jest-dom";
import { render } from "@solidjs/testing-library";
import { describe, it, expect } from "vitest";

import styles from "./index.module.styl";

import This from "./index";

describe("<{{properCase name}} /> test", () => {
  const { container } = render(() => <This /> );
  const component = container.firstChild as HTMLElement;
  it("has rendered", async () => {
    expect(component).toBeInTheDocument();
  });
  it("has class", async () => {
    expect(component.classList.contains(styles.Root)).toBe(true);
  });
});
