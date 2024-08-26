import { red, green } from "kleur";
import { GluegunCommand } from "gluegun";
import { getPassword } from "keytar";
import { ACTIVE_KEY, PASSWORD_NAMESPACE } from "../constants";

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

    if (parameters.options.file) {
      const filePath = parameters.options.file;
      if (filesystem.exists(filePath)) {
        data = filesystem.read(filePath, "json");
        print.info(green(`Data successfully loaded from file: ${filePath}`));
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

    filesystem.write("dist/data.json", data);
  },
};

export default command;
