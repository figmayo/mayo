import { GluegunCommand } from "gluegun";
import { green, red } from "kleur";
import { MayoToolbox } from "../types";

const command: GluegunCommand<MayoToolbox> = {
  name: "reset",
  run: async ({ print, typescript, reset }) => {
    try {
      reset();
      typescript.compile({ projectPath: "tsconfig.lib.json" });

      print.success(green("Reset complete!"));
    } catch (error) {
      print.error(red("An error occurred while resetting the files."));
      print.error(red(error.message));
    }
  },
};

export default command;
