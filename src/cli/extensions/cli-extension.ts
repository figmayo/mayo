import { GluegunToolbox } from "gluegun";
import * as typegen from "../typegen";
import * as build from "../build";
// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.typegen = typegen;
  toolbox.build = build;
};
