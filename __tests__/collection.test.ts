import { expect, it } from "vitest";
import { collection, variable } from "../src/lib";

it("should read via collection", () => {
  const c = collection("tests");
  const v = variable("brand-name");
  expect(String(v)).toEqual("FigMayo");
  // switch collection mode
  c.mode("Brand");
  expect(String(variable("icon/default/default"))).toBe("Other");
});
