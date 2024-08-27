import { red, green } from "kleur";
import { GluegunCommand } from "gluegun";
import { getPassword } from "keytar";
import { ACTIVE_KEY, GEN_PATH, PASSWORD_NAMESPACE } from "../../constants";

const command: GluegunCommand = {
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

    const destPath = `${GEN_PATH}/data.json`;

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
        const response = await fetch("https://your-server.com/data", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
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
