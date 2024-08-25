import {
  data as variables,
  VariableModes,
  VariableTypes,
} from "../../_generated";
import { figmaColorToHex, figmaColorToRgba, pixelfyValue } from "./utils";
import { Collection } from "./collection";

import Multiton from "./multiton";

export class Variable<K extends keyof VariableTypes>
  extends Multiton<Figma.Variable>
  implements Variables.Variable
{
  constructor(private _variable: Figma.Variable) {
    super(_variable);
  }

  mode(mode?: VariableModes[K]) {
    this.collection.mode(mode);
    return this;
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
      const variableName = variables.meta.variables[
        variable.id as keyof typeof variables.meta.variables
      ].name as keyof VariableTypes;
      return this.variable(variableName).value;
    } else {
      return this._variable.valuesByMode[modeId];
    }
  }

  //@ts-ignore
  get value() {
    return this.resolved();
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.valueOf().toString();
  }

  variable(k: keyof VariableTypes) {
    return variable(k, this._mode);
  }
}

export class Boolean<K extends keyof VariableTypes>
  extends Variable<K>
  implements Variables.Boolean
{
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
export class String<K extends keyof VariableTypes>
  extends Variable<K>
  implements Variables.String
{
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
export class Color<K extends keyof VariableTypes>
  extends Variable<K>
  implements Variables.Color
{
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
export class Float<K extends keyof VariableTypes>
  extends Variable<K>
  implements Variables.Float
{
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
  key: K,
  mode?: VariableModes[K]
): VariableTypes[K] => {
  const v = Object.values(variables.meta.variables).find((v) => v.name === key);
  if (v === undefined) throw new Error(`Variable ${key} not found`);
  // @ts-ignore
  return new typeMap[v.resolvedType as keyof typeof typeMap]<K>(
    v as Figma.Variable
  ).mode(mode);
};
