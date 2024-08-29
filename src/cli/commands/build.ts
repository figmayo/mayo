import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";
import { GEN_PATH } from "../../constants";
import { MayoToolbox } from "../types";
import * as path from "path";

const command: GluegunCommand<MayoToolbox> = {
  name: "build",
  run: async ({ print, filesystem, typegen, typescript }) => {
    const srcDir = filesystem.findUp({
      targetDir: "src",
      startDir: __dirname,
    });
    const localVariables = filesystem.read(
      filesystem.path(srcDir, `${GEN_PATH}/data.json`),
      "json"
    ) as Figma.Api.VariableResult;

    if (localVariables.status === 0) {
      print.error(red("No data available. Please run `mayo pull` first."));
      return;
    }
    // Proceed with the build process
    print.info(green("Building your project..."));

    filesystem
      .writeAsync(
        `${GEN_PATH}/types.ts`,
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
      )
      .then(() => {
        typescript.compile({
          projectPath: "tsconfig.lib.json",
        });

        const srcPath = path.join(srcDir, `${GEN_PATH}/data.json`);
        filesystem.copy(
          srcPath,
          path.join(
            __dirname,
            "..",
            "..",
            "..",
            "build",
            GEN_PATH,
            "data.json"
          ),
          {
            overwrite: true,
          }
        );
        print.success(green("Build complete! Your project is ready."));
      });
  },
};

export default command;
