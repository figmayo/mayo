import { GEN_PATH } from "../../constants";
import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";

const command: GluegunCommand = {
  name: "build",
  run: async ({ print, filesystem, typegen, build }) => {
    const localVariables = filesystem.read(
      `${GEN_PATH}/data.json`,
      "json"
    ) as Figma.Api.VariableResult;

    if (localVariables.status === 0) {
      print.error(red("No data available. Please run `mayo pull` first."));
      return;
    }
    // Proceed with the build process
    print.info(green("Building your project..."));

    filesystem.writeAsync(
      `${GEN_PATH}/types.d.ts`,
      typegen.generateVariableTypeDefinitions(localVariables.meta.variables) +
        typegen.generateColorVariableTypeDefinitions(
          localVariables.meta.variables
        ) +
        typegen.generateCollectionTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables
        ) +
        typegen.generateVariableModeTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables
        ) +
        typegen.generateCollectionModeTypeDefinitions(
          localVariables.meta.variableCollections
        ) +
        typegen.generateModeCollectionTypeDefinitions(
          localVariables.meta.variableCollections
        ) +
        typegen.generateModeVariableTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables
        )
    );

    print.success(green("Build complete! Your project is ready."));
  },
};

export default command;
