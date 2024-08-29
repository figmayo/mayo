// types.ts
import { GluegunToolbox } from "gluegun";
import * as typescript from "./typescript";
import * as typegen from "./typegen";

export interface MayoToolbox extends GluegunToolbox {
  typescript: typeof typescript;
  typegen: typeof typegen;
  filesystem: GluegunToolbox["filesystem"] & {
    findUp: (options: {
      startDir: string;
      targetDir: string;
    }) => string | undefined;
  };
}
