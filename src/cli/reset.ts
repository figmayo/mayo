import { GEN_PATH } from "../constants";
import * as fs from "fs-extra";
import * as path from "path";

export function reset() {
  const sourceDir = path.join(__dirname, "..", "..", "src/cli/templates");
  const targetDir = path.join(__dirname, "..", "..", "..", GEN_PATH);

  // Define the files you want to copy
  const filesToCopy = ["data.json", "types.ts"];

  // Copy each file from the templates directory to the target directory
  filesToCopy.forEach((file) => {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);
    fs.copySync(sourceFile, targetFile, { overwrite: true });
  });
}
