import { variables } from ".";
import type { CollectionModes, CollectionTypes, VariableTypes } from ".";
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

  // Map to hold subscribers for mode changes
  private static _subscribers: Map<
    string,
    Set<(mode: CollectionModes[keyof CollectionModes]) => void>
  > = new Map();

  constructor(public collection: Figma.VariableCollection) {
    super(collection);
    // Ensure subscribers map exists for this collection
    if (!Collection._subscribers.has(this.collection.id)) {
      Collection._subscribers.set(this.collection.id, new Set());
    }
  }

  private get _variableKeys() {
    return (
      this.collection.variableIds as (keyof typeof variables.meta.variables)[]
    ).map((id) => variables.meta.variables[id].name as keyof VariableTypes);
  }

  get variables() {
    return this._variableKeys.map((key) => variable(key));
  }

  get defaultModeId() {
    return this.collection.defaultModeId;
  }

  get modeId() {
    const mode = Collection._modesState.get(this.collection.id);
    return (
      this.collection.modes.find((m) => m.name === mode)?.modeId ||
      this.defaultModeId
    );
  }

  get activeMode() {
    return Collection._modesState.get(this.collection.id);
  }

  get defaultMode() {
    return Collection._modesState.get(this.defaultModeId);
  }

  mode(mode?: CollectionModes[K]) {
    if (mode) {
      Collection._modesState.set(this.collection.id, mode);
      this._notifySubscribers(mode);
    }
    return this;
  }

  // Subscribe to mode changes
  subscribe(callback: (mode: CollectionModes[K]) => void) {
    if (!Collection._subscribers.has(this.collection.id)) {
      Collection._subscribers.set(this.collection.id, new Set());
    }
    Collection._subscribers.get(this.collection.id)!.add(callback);
  }

  // Unsubscribe from mode changes
  unsubscribe(callback: (mode: CollectionModes[K]) => void) {
    Collection._subscribers.get(this.collection.id)?.delete(callback);
  }

  // Notify all subscribers about a mode change
  private _notifySubscribers(mode: CollectionModes[K]) {
    Collection._subscribers
      .get(this.collection.id)
      ?.forEach((callback) => callback(mode));
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
