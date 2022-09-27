import "@testing-library/jest-dom";
import { render } from "solid-testing-library";

import App from "./App";

describe("App test", () => {
  it("render test", () => {
    render(() => <App /> );
  });
});
