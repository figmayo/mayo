import { expect, it } from "vitest";
import { variable } from "../src/lib";

it("should read variable default mode", () => {
  const v = variable("primary/100");
  expect(v.rgba).toEqual("rgba(251, 245, 230, 1)");
  expect(v.hex).toEqual("#FBF5E6");
  expect(v.value).toEqual({
    r: 0.9843137264251709,
    g: 0.9607843160629272,
    b: 0.9019607901573181,
    a: 1,
  });
});

it("should read variable alias", () => {
  const value = variable("space/space-025");
  expect(value.px).toEqual("2px");
});

it("should read variable alias", () => {
  const v = variable("is-awesome");
  expect(v.value).toEqual(true);
});
