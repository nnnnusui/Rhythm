import { render } from "@solidjs/testing-library";

import App from "./App";

describe("App test", () => {
  it("render test", () => {
    render(() => <App /> );
  });
});
