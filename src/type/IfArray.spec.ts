import { describe, it, expectTypeOf } from "vitest";

import { IfArray } from "./IfArray";

describe("type IfArray", async () => {
  it("returns true for an array", async () => {
    type It = IfArray<[], "true", "false">;

    expectTypeOf<It>().toEqualTypeOf<"true">();
  });

  it("returns false for not array", async () => {
    type It = IfArray<"[]", "true", "false">;

    expectTypeOf<It>().toEqualTypeOf<"false">();
  });

  it("returns false for never", async () => {
    type It = IfArray<never, "true", "false">;

    expectTypeOf<It>().toEqualTypeOf<"false">();
  });
});
