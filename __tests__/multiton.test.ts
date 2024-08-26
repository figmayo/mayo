import { expect, it } from "vitest";
import { collection, variable } from "../src/lib";

it("should return the same collection instance", () => {
  const c = collection("tests", "Brand");
  const v = variable("is-awesome");
  expect(v.collection.uid).toBe(c.uid);
  expect(c.modeId).toBe("2776:0");
  expect(v.value).toEqual(false);
  collection("tests", "Dark");
  expect(v.value).toEqual(false);
  c.mode("Light");
  expect(v.value).toEqual(true);
  c.mode("Dark");
  expect(v.value).toEqual(false);
  v.collection.mode("Light");
  expect(v.value).toEqual(true);
});
