import { describe, it, expect } from "vitest";

import { Wve } from "./Wve";

describe("const Wve", async () => {
  it("creatable", async () => {
    const wve = Wve.create({});

    expect(wve()).toStrictEqual({});
  });
});
