import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";
import { MayoToolbox } from "../types";
import { GEN_PATH } from "../../constants";

const command: GluegunCommand<MayoToolbox> = {
  name: "reset",
  run: async ({ print, typescript, filesystem }) => {
    const srcDir = filesystem.findUp({
      targetDir: "src",
      startDir: __dirname,
    });
    try {
      const sourceDir = filesystem.path(srcDir, "cli/templates");
      const targetDir = filesystem.path(srcDir, GEN_PATH);

      // Define the files you want to copy
      const filesToCopy = ["data.json", "types.ts"];

      // Copy each file from the templates directory to the target directory
      filesToCopy.forEach((file) => {
        const sourceFile = filesystem.path(sourceDir, file);
        const targetFile = filesystem.path(targetDir, file);
        filesystem.copy(sourceFile, targetFile, { overwrite: true });
      });
      typescript.compile({ projectPath: "tsconfig.lib.json" });

      print.success(green("Reset complete!"));
    } catch (error) {
      print.error(red("An error occurred while resetting the files."));
      print.error(red(error.message));
    }
  },
};

export default command;
