import * as ts from "typescript";

type CompileTSOptions = {
  projectPath?: string;
  additionalOptions?: ts.CompilerOptions;
  include?: string[];
  extendsOverride?: string;
};
type CompiledFile = {
  fileName: string;
  content: string;
};
type CompileTSResult = {
  success: boolean;
  diagnostics: readonly ts.Diagnostic[];
  outputFiles: CompiledFile[];
};

export const compile = ({
  projectPath = "./tsconfig.json",
  additionalOptions = {},
  include,
  extendsOverride,
}: CompileTSOptions): CompileTSResult => {
  const tsConfigPath = ts.findConfigFile(
    __dirname,
    ts.sys.fileExists,
    projectPath
  );

  // Read and parse the tsconfig.json file
  const configFile = ts.readConfigFile(tsConfigPath!, ts.sys.readFile);
  const tsconfig = configFile.config;

  const parsedConfig = ts.parseJsonConfigFileContent(
    {
      ...tsconfig,
      extends: extendsOverride || tsconfig.extends,
      compilerOptions: {
        ...tsconfig.compilerOptions,
        ...additionalOptions,
      },
      include: include || tsconfig.include,
    },
    ts.sys,
    process.cwd()
  );

  // Capture output files
  const outputFiles: CompiledFile[] = [];

  // Create a program with the root files and compiler options
  const program = ts.createProgram(
    parsedConfig.fileNames,
    parsedConfig.options
  );

  // Emit the compiled files
  const emitResult = program.emit(undefined, (fileName, content) => {
    console.log(`Capturing file: ${fileName}`); // Debugging line
    outputFiles.push({ fileName, content });
  });

  // Collect and return diagnostics
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  return {
    success: !emitResult.emitSkipped,
    diagnostics: allDiagnostics,
    outputFiles,
  };
};
