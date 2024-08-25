import { expect, it } from "vitest";
import { collection } from "../src/lib/collection";

it("should read collection", () => {
  const c = collection("tests");
  const v = c.variable("brand-name");
  expect(String(v)).toEqual("FigMayo");
  expect(String(v.mode("Brand"))).toEqual("Other");
  c.mode("Brand");
  expect(String(c.mode("Brand").variable("brand-name"))).toBe("Other");
  expect(
    String(
      c.mode("Dark").variable("brand-name").mode("Core").variable("brand-name")
    )
  ).toBe("FigMayo");
});
