import { GluegunCommand } from "gluegun";
import { green, blue, red } from "kleur";
import {
  generateVariableTypeDefinitions,
  generateColorVariableTypeDefinitions,
  generateCollectionTypeDefinitions,
  generateVariableModeTypeDefinitions,
  generateCollectionModeTypeDefinitions,
  generateModeCollectionTypeDefinitions,
  generateModeVariableTypeDefinitions,
} from "../lib/sync";

const command: GluegunCommand = {
  name: "build",
  run: async ({ print, filesystem }) => {
    // Check if the pull command has been run
    if (!filesystem.exists("dist/data.json")) {
      print.error(red("No data available. Please run `mayo pull` first."));
      return;
    }

    const localVariables = filesystem.read(
      "dist/data.json",
      "json"
    ) as Figma.Api.VariableResult;

    filesystem.writeAsync(
      `dist/types.ts`,
      generateVariableTypeDefinitions(localVariables.meta.variables) +
        generateColorVariableTypeDefinitions(localVariables.meta.variables) +
        generateCollectionTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables
        ) +
        generateVariableModeTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables
        ) +
        generateCollectionModeTypeDefinitions(
          localVariables.meta.variableCollections
        ) +
        generateModeCollectionTypeDefinitions(
          localVariables.meta.variableCollections
        ) +
        generateModeVariableTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables
        )
    );

    // Proceed with the build process
    print.info(blue("Building your project..."));

    // Simulate a build process (replace with your actual logic)
    setTimeout(() => {
      print.success(green("Build complete! Your project is ready."));
    }, 2000);
  },
};

export default command;
