import {
  CollectionModeTypes,
  CollectionModes,
  VariableModeTypes,
  VariableModes,
} from "../../_generated";
import { collection } from "./collection";
import { variable } from "./variable";

class Mode<K extends keyof CollectionModeTypes> {
  constructor(private _key: keyof CollectionModeTypes) {}
  variable<T extends VariableModeTypes[K]>(key: T) {
    return variable<T>(key, this._key as VariableModes[T]);
  }
  collection<T extends CollectionModeTypes[K]>(key: T) {
    return collection<T>(key, this._key as CollectionModes[T]);
  }
}

export const mode = <K extends keyof CollectionModeTypes>(key: K) => {
  return new Mode<K>(key);
};
