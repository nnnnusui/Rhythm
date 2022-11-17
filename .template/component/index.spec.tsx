import "@testing-library/jest-dom";
import { render } from "solid-testing-library";
import { describe, it, expect } from "vitest";

import This from "./index.tsx";
import styles from "./index.module.styl";

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
