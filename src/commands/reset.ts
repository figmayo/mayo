import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";

const command: GluegunCommand = {
  name: "reset",
  run: async ({ print, filesystem }) => {
    try {
      const sourceDir = filesystem.path(__dirname, "..", "..", "src/templates");
      const targetDir = filesystem.path(__dirname, "..", "..", "dist");

      // Ensure the target directory exists
      filesystem.dir(targetDir);

      // Define the files you want to copy
      const filesToCopy = ["data.json", "index.ts", "types.ts"];

      // Copy each file from the templates directory to the dist directory
      filesToCopy.forEach((file) => {
        const sourceFile = filesystem.path(sourceDir, file);
        const targetFile = filesystem.path(targetDir, file);
        filesystem.copy(sourceFile, targetFile, { overwrite: true });
      });

      print.success(green("Reset complete!"));
    } catch (error) {
      print.error(red("An error occurred while resetting the files."));
      print.error(red(error.message));
    }
  },
};

export default command;
