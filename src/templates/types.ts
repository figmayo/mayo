export interface VariableTypes {
  "": Variables.Float | Variables.Boolean | Variables.String | Variables.Color;
}

export type ColorVariables = "";

export interface CollectionTypes {
  "": "";
}

export interface VariableModes
  extends Record<keyof VariableTypes, CollectionModes> {}

export interface CollectionModes extends Record<keyof CollectionTypes, string> {
  "": "";
}

export interface CollectionModeTypes {}

export interface VariableModeTypes {}
