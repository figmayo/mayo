interface Identifiable {
  id: string;
}

class Multiton<T extends Identifiable> {
  private static instances: Map<string, Multiton<any>> = new Map();

  private _id: T["id"];
  private _uid: string;

  protected constructor(data: T) {
    // If no instance exists, proceed to create a new one.
    this._id = data.id;
    this._uid = Math.random().toString(36).substr(2, 9);
    // Check if an instance with the given id already exists.
    if (Multiton.instances.has(data.id)) {
      return Multiton.instances.get(data.id) as Multiton<T>;
    }
    // Store this new instance in the map.
    Multiton.instances.set(data.id, this);
  }

  get id() {
    return this._id;
  }

  get uid() {
    return this._uid;
  }
}

export default Multiton;
