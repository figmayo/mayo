import { reset } from "../reset";
import * as typegen from "../typegen";
import { MayoToolbox } from "../types";
import * as typescript from "../typescript";

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: MayoToolbox) => {
  function findUp({
    startDir,
    targetDir,
  }: {
    startDir: string;
    targetDir: string;
  }): string | undefined {
    let currentDir = startDir;

    while (true) {
      const potentialSrcDir = toolbox.filesystem.path(currentDir, targetDir);

      if (toolbox.filesystem.exists(potentialSrcDir) === "dir") {
        return potentialSrcDir;
      }

      const parentDir = toolbox.filesystem.resolve(currentDir, "..");
      if (parentDir === currentDir) {
        // We've reached the root directory
        return undefined;
      }

      currentDir = parentDir;
    }
  }
  toolbox.typegen = typegen;
  toolbox.typescript = typescript;
  toolbox.reset = reset;
  toolbox.filesystem.findUp = findUp;
};
