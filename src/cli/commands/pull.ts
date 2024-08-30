import { GluegunCommand } from "gluegun";
import { getPassword } from "keytar";
import { green, red } from "kleur";
import { ACTIVE_KEY, GEN_PATH, PASSWORD_NAMESPACE } from "../../constants";
import { MayoToolbox } from "../types";

const command: GluegunCommand<MayoToolbox> = {
  name: "pull",
  run: async ({ parameters, print, filesystem }) => {
    // Retrieve the API key
    const active = await getPassword(PASSWORD_NAMESPACE, ACTIVE_KEY);
    const apiKey = await getPassword(PASSWORD_NAMESPACE, active);

    if (!apiKey) {
      print.error(
        red("Authentication is required. Please run `mayo auth` first.")
      );
      return;
    }

    let data: any;
    filesystem.find;
    const srcDir = filesystem.findUp({
      targetDir: "src",
      startDir: __dirname,
    });
    const destPath = filesystem.path(srcDir, `${GEN_PATH}/data.json`);

    if (parameters.options.file) {
      const filePath = parameters.options.file;
      if (filesystem.exists(filePath)) {
        data = filesystem.read(filePath, "json");
        print.info(
          green(
            `Data successfully loaded from file: ${filePath} into ${destPath}`
          )
        );
      } else {
        print.error(red(`File not found: ${filePath}`));
        return;
      }
    } else {
      try {
        const response = await fetch(
          "https://app.figmayo.com/api/v2/plugin/variables",
          {
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );
        data = await response.json();
        print.info(green("Data successfully pulled from the server."));
      } catch (error) {
        print.error(red("Failed to fetch data from the server."));
        return;
      }
    }

    filesystem.write(destPath, data);
  },
};

export default command;
