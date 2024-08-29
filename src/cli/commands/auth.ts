import { GluegunCommand } from "gluegun";
import { setPassword } from "keytar";
import { green, yellow } from "kleur";
import { ACTIVE_KEY, PASSWORD_NAMESPACE, SITE_API } from "../../constants";

const command: GluegunCommand = {
  name: "auth",
  run: async ({ prompt, print }) => {
    // Prompt for the API key
    const { apiKey } = await prompt.ask<{ apiKey: string }>({
      type: "input",
      name: "apiKey",
      message: "Please enter your API key:",
    });

    if (apiKey) {
      try {
        const response = await fetch(SITE_API, {
          headers: {
            "x-figmayo-key": apiKey,
          },
        });
        if (response.status !== 200) {
          throw Error("Invalid key");
        }
        const site = await response.json();
        // Store the API key securely
        await setPassword(PASSWORD_NAMESPACE, site.id, apiKey);
        await setPassword(PASSWORD_NAMESPACE, ACTIVE_KEY, site.id);

        // Cool feedback on success
        print.info(
          green("You have been successfully connected to " + site.name)
        );
      } catch (error) {
        print.info(yellow("Your API key is invalid. Please try again."));
      }
    } else {
      print.error("No API key provided.");
    }
  },
};

export default command;
