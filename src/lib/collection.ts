import {
  CollectionModes,
  CollectionTypes,
  VariableTypes,
  variables,
} from "../../dist";
import Multiton from "./multiton";
import { variable } from "./variable";

export class Collection<
  K extends keyof CollectionTypes
> extends Multiton<Figma.VariableCollection> {
  // Map of collection IDs and enabled modes by mode name.
  private static _modesState: Map<
    string,
    CollectionModes[keyof CollectionModes]
  > = new Map();

  constructor(private _collection: Figma.VariableCollection) {
    super(_collection);
  }

  private get _variableKeys() {
    return (
      this._collection.variableIds as (keyof typeof variables.meta.variables)[]
    ).map((id) => variables.meta.variables[id].name as keyof VariableTypes);
  }

  get variables() {
    return this._variableKeys.map((key) => variable(key));
  }

  get defaultModeId() {
    return this._collection.defaultModeId;
  }

  get modeId() {
    const mode = Collection._modesState.get(this._collection.id);
    return (
      this._collection.modes.find((m) => m.name === mode)?.modeId ||
      this.defaultModeId
    );
  }

  get _mode() {
    return Collection._modesState.get(this._collection.id);
  }

  variable(key: keyof CollectionTypes[K]) {
    return variable(key as keyof VariableTypes);
  }

  mode(mode?: CollectionModes[K]) {
    if (mode) {
      Collection._modesState.set(this._collection.id, mode);
    }
    return this;
  }
}

export const collection = <K extends keyof CollectionModes>(
  key: K,
  mode?: CollectionModes[K]
) => {
  const c = Object.values(variables.meta.variableCollections).find(
    (v) => v.name === key
  );
  if (!c) {
    throw new Error(`Collection ${key} not found`);
  }
  return new Collection<K>(c).mode(mode);
};
