import { execSync } from "child_process";
export async function setup() {
  console.log("Setting up tests");
  // Run the pull command with the file argument
  execSync("node bin/mayo pull --file __tests__/_fixtures/data.json", {
    stdio: "inherit",
  });

  // Run the build command
  execSync("node bin/mayo build", { stdio: "inherit" });
}

export async function teardown() {
  console.log("Tearing down tests");
  execSync("node bin/mayo reset", { stdio: "inherit" });
}
