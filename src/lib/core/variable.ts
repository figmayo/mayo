import { variables, VariableTypes } from ".";
import { Collection } from "./collection";
import { figmaColorToHex, figmaColorToRgba, pixelfyValue } from "./utils";

import { isVariableAlias } from "../../figma.guards";
import Multiton from "./multiton";

export class Variable
  extends Multiton<Figma.Variable>
  implements Variables.Variable
{
  constructor(private _variable: Figma.Variable) {
    super(_variable);
  }

  get defaultModeId() {
    return this.collection.defaultModeId;
  }

  get modeId() {
    return this.collection.modeId;
  }

  get _mode() {
    return this.collection._mode;
  }

  public get collection() {
    return new Collection(
      variables.meta.variableCollections[
        this._variable
          .variableCollectionId as keyof typeof variables.meta.variableCollections
      ]
    );
  }

  public resolved() {
    const modeId = this.modeId;
    if (!(modeId in this._variable.valuesByMode)) {
      throw new Error(
        `Mode ${modeId} not found in variable ${this._variable.name}`
      );
    }

    const variable = this._variable.valuesByMode[modeId];

    if (isVariableAlias(variable)) {
      return new Variable(
        variables.meta.variables[
          variable.id as keyof typeof variables.meta.variables
        ]
      ).resolved();
    } else {
      return variable;
    }
  }

  valueOf() {
    return this.resolved();
  }

  toString() {
    return this.valueOf().toString();
  }
}

export class Boolean extends Variable implements Variables.Boolean {
  get value() {
    return super.resolved() as boolean;
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "boolean") {
      return this.valueOf();
    }
    return this;
  }
}
export class String extends Variable implements Variables.String {
  get value() {
    return super.resolved() as string;
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "string") {
      return this.valueOf();
    }
    return this;
  }
}
export class Color extends Variable implements Variables.Color {
  get value() {
    return super.resolved() as Figma.Color;
  }
  get rgba() {
    return figmaColorToRgba(this.value) as string;
  }
  get hex() {
    return figmaColorToHex(this.value) as string;
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "object") {
      return this.valueOf();
    }
    if (hint === "string") {
      return this.rgba;
    }
    return this;
  }
}
export class Float extends Variable implements Variables.Float {
  get value() {
    return super.resolved() as number;
  }

  get px() {
    return pixelfyValue(this.value) as string;
  }

  [Symbol.toPrimitive](hint: string) {
    if (hint === "number") {
      return this.valueOf();
    }
    return this;
  }
}

const typeMap = {
  FLOAT: Float,
  COLOR: Color,
  STRING: String,
  BOOLEAN: Boolean,
};

export const variable = <K extends keyof VariableTypes>(
  key: K
): VariableTypes[K] => {
  const v = Object.values(variables.meta.variables).find((v) => v.name === key);

  if (v === undefined) throw new Error(`Variable ${key} not found`);

  const VariableConstructor = typeMap[
    v.resolvedType as keyof typeof typeMap
  ] as unknown as {
    new (v: Figma.Variable): VariableTypes[K];
  };

  return new VariableConstructor(v as Figma.Variable);
};
