export interface VariableTypes {
  "": Variables.Variable;
}

export type ColorVariables = "";

export interface CollectionTypes
  extends Record<string, Record<string, Variables.Variable>> {
  "": {
    "": Variables.Variable;
  };
}

export interface VariableModes
  extends Record<keyof VariableTypes, CollectionModes> {}

export interface CollectionModes extends Record<keyof CollectionTypes, string> {
  "": "";
}

export interface CollectionModeTypes {}

export interface VariableModeTypes {}
