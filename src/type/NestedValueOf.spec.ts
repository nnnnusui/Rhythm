import { describe, it, expectTypeOf } from "vitest";

import { NestedValueOf_GetValue as GetValue } from "./NestedValueOf";

describe("type GetValue", async () => {
  it("return nonnullable from object", async () => {
    type Target = { x: { a: "a" } };
    type Key = "x";
    type Found = { a: "a" };

    type It = GetValue<Target, Key>;

    expectTypeOf<It>().toEqualTypeOf<Found>();
  });

  it("return undefineable from record", async () => {
    type Target = Record<string, { a: "a" }>;
    type Key = "x";
    type Found = { a: "a" } | undefined;

    type It = GetValue<Target, Key>;

    expectTypeOf<It>().toEqualTypeOf<Found>();
  });

  it("return nonnullable from tuple", async () => {
    type Target = readonly [{ a: "a" }, string, number];
    type Key = 0;
    type Found = { a: "a" };

    type It = GetValue<Target, Key>;

    expectTypeOf<It>().toEqualTypeOf<Found>();
  });

  it("return undefineable from array", async () => {
    type Target = { a: "a" }[];
    type Key = 0;
    type Found = { a: "a" } | undefined;

    type It = GetValue<Target, Key>;

    expectTypeOf<It>().toEqualTypeOf<Found>();
  });
});
