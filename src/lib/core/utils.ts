export const pixelfyValue = (value: number): string | undefined => {
  return `${parseFloat(`${value}`).toFixed()}px`;
};

export const figmaColorToRgba = (
  color: Figma.Color | undefined,
  opacity?: number
): string | undefined => {
  return color
    ? `rgba(${Math.round(color.r * 255)}, ${Math.round(
        color.g * 255
      )}, ${Math.round(color.b * 255)}, ${opacity || color.a})`
    : undefined;
};

export const figmaColorToHex = (
  color: Figma.Color | undefined
): string | undefined => {
  if (!color) return undefined;
  const toHex = (c: number): string =>
    Math.floor(c * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
};
