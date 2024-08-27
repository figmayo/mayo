import { expect, it } from "vitest";
import { collection } from "../src/lib";

it("should return the same collection instance", () => {
  const c1 = collection("tests", "Brand");
  const c2 = collection("tests", "Dark");
  expect(c1.uid).toBe(c2.uid);
});
