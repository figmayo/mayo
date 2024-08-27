import * as ts from "typescript";
import * as path from "path";

// Define the path to your tsconfig.json

// Function to read and parse tsconfig.json
function getTsConfigFile(filePath: string): ts.ParsedCommandLine {
  const configPath = path.resolve(__dirname, filePath);
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(JSON.stringify(configFile.error, undefined, 2));
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );
  return parsedConfig;
}

// Function to compile the project
export function compileProject(configPath: string) {
  const config = getTsConfigFile(configPath);
  const program = ts.createProgram(config.fileNames, config.options);
  const emitResult = program.emit();

  // Collect diagnostics
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  diagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  if (exitCode === 0) {
    console.log("TypeScript compilation succeeded.");
  } else {
    console.log("TypeScript compilation failed.");
    process.exit(exitCode);
  }
}
