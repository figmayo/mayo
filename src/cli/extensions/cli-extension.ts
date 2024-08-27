import { GluegunToolbox } from "gluegun";
import * as typegen from "../typegen";
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.typegen = typegen;
};
