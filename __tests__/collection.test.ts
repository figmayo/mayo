import { expect, it } from "vitest";
import { collection } from "../src/lib/collection";

it("should read via collection", () => {
  const c = collection("tests");
  const v = c.variable("brand-name");
  expect(String(v)).toEqual("FigMayo");
  // switch collection mode
  c.mode("Brand");
  expect(String(c.mode("Brand").variable("brand-name"))).toBe("Other");
});
