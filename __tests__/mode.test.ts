import { expect, it } from "vitest";
import { mode } from "../src/lib/mode";

it("should narrow collections by mode", () => {
  const v = mode("Spacious");
  expect(v.collection("buttonModes").variable("pdHorizontal").value).toEqual(
    16
  );
});

it("should narrow variables by mode", () => {
  const v = mode("Dark");
  expect(v.variable("is-awesome").value).toEqual(false);
  expect(v.variable("is-awesome").mode("Light").value).toEqual(true);
});
