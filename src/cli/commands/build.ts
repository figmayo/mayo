import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";
import { ACTIVE_KEY, GEN_PATH, PASSWORD_NAMESPACE } from "../../constants";
import { MayoToolbox } from "../types";
import { getPassword } from "keytar";

const command: GluegunCommand<MayoToolbox> = {
  name: "build",
  run: async ({ print, filesystem, typegen, typescript }) => {
    const active = await getPassword(PASSWORD_NAMESPACE, ACTIVE_KEY);
    const srcDir = filesystem.findUp({
      targetDir: "src",
      startDir: __dirname,
    });
    const buildDir = filesystem.findUp({
      targetDir: "build",
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
        filesystem.path(srcDir, `${GEN_PATH}/types.ts`),
        typegen.generateVariableTypeDefinitions(
          localVariables.meta.variableCollections,
          localVariables.meta.variables,
          active
        ) +
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
        const { outputFiles } = typescript.compile({
          projectPath: "tsconfig.lib.json",
          extendsOverride: filesystem.path(srcDir, "..", `tsconfig.json`),
          include: [
            filesystem.path(srcDir, `lib/**/*`),
            filesystem.path(srcDir, `_gen/types.ts`),
          ],
          additionalOptions: {
            outDir: buildDir,
            baseUrl: srcDir,
            noEmit: false,
          },
        });

        outputFiles.forEach(({ fileName, content }) => {
          filesystem.write(fileName, content);
        });

        const srcPath = filesystem.path(srcDir, `${GEN_PATH}/data.json`);
        const buildPath = filesystem.path(buildDir, `${GEN_PATH}/data.json`);
        filesystem.copy(srcPath, buildPath, {
          overwrite: true,
        });
        print.success(green("Build complete! Your project is ready."));
      });
  },
};

export default command;
