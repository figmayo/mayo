const esbuild = require("esbuild");

// CommonJS and ES Module output
esbuild
  .build({
    entryPoints: ["src/lib/index.ts"], // Entry file(s) for your modules
    bundle: true,
    outdir: "dist",
    platform: "node", // Target platform
    sourcemap: true,
    target: ["node14"],
    format: "cjs", // or 'esm' for ES Modules
    tsconfig: "tsconfig.json",
    external: [], // You can add external dependencies here
  })
  .then(() => {
    console.log("Build completed!");
  })
  .catch(() => process.exit(1));
