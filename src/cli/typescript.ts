import path = require("path");
import * as ts from "typescript";

type CompileTSOptions = {
  projectPath?: string;
  additionalOptions?: ts.CompilerOptions;
};

type CompileTSResult = {
  success: boolean;
  diagnostics: readonly ts.Diagnostic[];
};

export const compile = ({
  projectPath = "./tsconfig.json",
  additionalOptions = {},
}: CompileTSOptions): CompileTSResult => {
  const tsConfigPath = ts.findConfigFile(
    __dirname,
    ts.sys.fileExists,
    projectPath
  );
  console.log("tsConfigPath", tsConfigPath);
  // Read and parse the tsconfig.json file
  const configFile = ts.readConfigFile(tsConfigPath!, ts.sys.readFile);
  const tsconfig = configFile.config;

  if (tsconfig.include && Array.isArray(tsconfig.include)) {
    tsconfig.include = tsconfig.include.map((includePath) => {
      return path.relative(__dirname, path.resolve(__dirname, includePath));
    });
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    {
      ...tsconfig,
      compilerOptions: {
        ...tsconfig.compilerOptions,
        ...additionalOptions,
      },
    },
    ts.sys,
    process.cwd()
  );
  console.log("parsedConfig", parsedConfig);

  // Create a program with the root files and compiler options
  const program = ts.createProgram(
    parsedConfig.fileNames,
    parsedConfig.options
  );

  // Emit the compiled files
  const emitResult = program.emit();

  // Collect and return diagnostics
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  return {
    success: !emitResult.emitSkipped,
    diagnostics: allDiagnostics,
  };
};
