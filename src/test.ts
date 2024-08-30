/**
 * Enum for inputs with documentation.
 */
enum InputsEnum {
  /**
   *
   * For more details, see [the documentation](https://example.com/docs).
   *
   */
  InputA = "input-a",

  /**
   * Another input.
   */
  InputB = "input-b",
}

/**
 * This function does something important.
 *
 * @param {InputsEnum} input - The input key.
 * @returns {string} The processed output.
 */
const doSomethingImportant = (input: InputsEnum): string => {
  // Function logic here
  return `Processed ${input}`;
};

// Usage example
doSomethingImportant(InputsEnum.InputA);
