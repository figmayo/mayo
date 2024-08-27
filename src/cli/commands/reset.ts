import { GEN_PATH } from "../../constants";
import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";

const command: GluegunCommand = {
  name: "reset",
  run: async ({ print, filesystem, build }) => {
    try {
      const sourceDir = filesystem.path(__dirname, "..", "..", "cli/templates");
      const targetDir = filesystem.path(__dirname, "..", "..", "..", GEN_PATH);

      // Ensure the target directory exists
      filesystem.dir(targetDir);

      // Define the files you want to copy
      const filesToCopy = ["data.json", "types.ts"];

      // Copy each file from the templates directory to the dist directory
      filesToCopy.forEach((file) => {
        const sourceFile = filesystem.path(sourceDir, file);
        const targetFile = filesystem.path(targetDir, file);
        filesystem.copy(sourceFile, targetFile, { overwrite: true });
      });

      build.compileProject("../../tsconfig.lib.json");
      print.success(green("Reset complete!"));
    } catch (error) {
      print.error(red("An error occurred while resetting the files."));
      print.error(red(error.message));
    }
  },
};

export default command;
