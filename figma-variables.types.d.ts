/**
 * The type interfaces for our util classes for working with Figma variables
 */
declare namespace Variables {
  /**
   * Parent variable class
   */
  export interface Variable {
    _mode?: VariableModes[K];

    get defaultModeId(): string;
    get modeId(): string | undefined;

    valueOf(): boolean | Figma.Color | number | string;
    toString(): string;
  }
  /**
   * Boolean variable class - behaves mostly like a boolean primitive
   */
  export interface Boolean extends Variable {
    get value(): boolean;
  }
  /**
   * String variable class - behaves mostly like a string primitive
   */
  export interface String extends Variable {
    get value(): string;
  }
  /**
   * Float variable class - behaves mostly like a number primitive but can stringify to a pixel value.
   */
  export interface Float extends Variable {
    get value(): number;
    get px(): string;
  }
  /**
   * Color variable class - behaves mostly like an object with rgba and hex properties. Stringifies to rgba by default
   */
  export interface Color extends Variable {
    get value(): Figma.Color;
    get rgba(): string;
    get hex(): string;
  }
}
