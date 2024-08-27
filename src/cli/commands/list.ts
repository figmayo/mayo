import { red } from "kleur";
import { GluegunCommand } from "gluegun";
import { findCredentials, setPassword } from "keytar";
import { ACTIVE_KEY, PASSWORD_NAMESPACE, SITE_API } from "../../constants";

const command: GluegunCommand = {
  name: "list",
  run: async ({ parameters, print, prompt }) => {
    // Retrieve the API key
    const list = await findCredentials(PASSWORD_NAMESPACE);

    if (list.length === 0) {
      print.error(
        red("Authentication is required. Please run `mayo auth` first.")
      );
      return;
    }

    const sites = await Promise.all(
      list
        .filter((l) => l.account !== ACTIVE_KEY)
        .map(async (site) => {
          const result = await fetch(SITE_API, {
            headers: { "x-figmayo-key": site.password },
          });
          return result.json();
        })
    );
    // Prompt the user to select an option
    const result = await prompt.ask({
      type: "select",
      name: "selectedOption",
      message: "Please select an option:",
      choices: sites.map((site) => `${site.name} [${site.id}]`),
    });

    const match = result.selectedOption.match(/.*\[(.*)\]/);

    if (!match.length) throw Error("Failed to find the id");
    await setPassword(PASSWORD_NAMESPACE, ACTIVE_KEY, match[1]);

    print.info(`Site now active: ${result.selectedOption}`);
  },
};

export default command;
