export const isFillLike = (
  node: Figma.Node | Figma.TypeStyle
): node is Figma.FillLike => {
  return "fills" in node;
};

export const isParentLike = (
  node: Figma.Node | Figma.ParentLike
): node is Figma.ParentLike => {
  return (
    "children" in node && Array.isArray(node.children) && node.visible !== false
  );
};

export const isVariableAlias = (
  modeValue: string | number | boolean | Figma.Color | Figma.VariableAlias
): modeValue is Figma.VariableAlias => {
  return (modeValue as Figma.VariableAlias).type === "VARIABLE_ALIAS";
};
export const isNotVariableAlias = (
  modeValue: string | number | boolean | Figma.Color | Figma.VariableAlias
): modeValue is string | number | boolean | Figma.Color => {
  return (modeValue as Figma.VariableAlias).type !== "VARIABLE_ALIAS";
};
