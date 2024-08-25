import "dotenv/config";
import * as fs from "fs";
import { logger } from "helpers";
import ky from "ky";

// Utility function to resolve Figma variable types to TypeScript types
export const resolveType = (figmaType: Figma.Variable["resolvedType"]) => {
  switch (figmaType) {
    case "FLOAT":
      return "Variables.Float";
    case "COLOR":
      return "Variables.Color";
    case "STRING":
      return "Variables.String";
    case "BOOLEAN":
      return "Variables.Boolean";
    default:
      return "any"; // Default to 'any' if type is unrecognized
  }
};
/**
 * Generate return type definitions for each Figma variable
 */
const generateVariableTypeDefinitions = (
  variables: Record<string, Figma.Variable>
) => {
  const types = Object.values(variables)
    .map((variable) => {
      const type = variable.resolvedType; // Assuming 'type' is the property that contains type info
      return `    "${variable.name}": ${resolveType(type)};`;
    })
    .join("\n");

  return `export interface VariableTypes {\n${types}\n}\n\n`;
};

/**
 * Generate return type definitions for each Figma variable
 */
const generateColorVariableTypeDefinitions = (
  variables: Record<string, Figma.Variable>
) => {
  const types = Object.values(variables)
    .filter((v) => v.resolvedType === "COLOR")
    .map((v) => `"${v.name}"`)
    .join(" | ");

  return `export type ColorVariables = ${types};\n`;
};

/**
 * Generate union of modes for each variable key
 */
const generateVariableModeTypeDefinitions = (
  collections: Record<string, Figma.VariableCollection>,
  variables: Record<string, Figma.Variable>
) => {
  const types = Object.values(variables)
    .map((variable) => {
      const collection = collections[variable.variableCollectionId];
      const modes = Object.values(collection.modes.map((mode) => mode.name));
      return `    "${variable.name}": "${modes.join('" | "')}";`;
    })
    .join("\n");

  return `export interface VariableModes {\n${types}\n}\n\n`;
};
/**
 * Generate return type definitions for each Figma variable grouped into collections
 */
const generateCollectionTypeDefinitions = (
  collections: Record<string, Figma.VariableCollection>,
  variables: Record<string, Figma.Variable>
) => {
  const types = Object.values(collections)
    .map((collection) => {
      const types = Object.values(
        collection.variableIds.map((id) => variables[id])
      )
        .map((variable) => {
          const type = variable.resolvedType; // Assuming 'type' is the property that contains type info
          return `    "${variable.name}": ${resolveType(type)};`;
        })
        .join("\n");
      return `    "${collection.name}": {\n${types}\n    };`;
    })
    .join("\n");

  return `export interface CollectionTypes {\n${types}\n}\n`;
};

/**
 *
 * Generate union of modes for each collection key
 */
const generateCollectionModeTypeDefinitions = (
  collections: Record<string, Figma.VariableCollection>
) => {
  const types = Object.values(collections)
    .map((collection) => {
      const modes = Object.values(collection.modes.map((mode) => mode.name));
      return `    "${collection.name}": "${modes.join('" | "')}";`;
    })
    .join("\n");

  return `export interface CollectionModes {\n${types}\n}\n\n`;
};

/**
 * Generate union of collection keys for each mode key
 */
const generateModeCollectionTypeDefinitions = (
  collections: Record<string, Figma.VariableCollection>
) => {
  // Map to store mode names with a set of collection names
  const modeMap = new Map<string, Set<string>>();

  // Fill modeMap with collection names per mode name
  Object.values(collections).forEach((collection) => {
    collection.modes.forEach((mode) => {
      if (!modeMap.has(mode.name)) {
        modeMap.set(mode.name, new Set());
      }
      modeMap.get(mode.name)!.add(collection.name);
    });
  });

  // Generate the types string for the interface
  let types = Array.from(modeMap.entries())
    .map(([modeName, collectionKeys]) => {
      // Create a union type from the set of collection names
      const unionType = Array.from(collectionKeys).join(`" | "`);
      return `  ${modeName}: "${unionType}";`;
    })
    .join("\n");

  // Return the interface string
  return `export interface CollectionModeTypes {\n${types}\n}\n\n`;
};

/**
 * Generate union of variable keys for each mode key
 */
const generateModeVariableTypeDefinitions = (
  collections: Record<string, Figma.VariableCollection>,
  variables: Record<string, Figma.Variable>
) => {
  // Map to store mode names with a set of collection names
  const modeMap = new Map<string, Set<string>>();

  // Fill modeMap with collection names per mode name
  Object.values(variables).forEach((variable) => {
    const collection = collections[variable.variableCollectionId];
    collection.modes.forEach((mode) => {
      if (!modeMap.has(mode.name)) {
        modeMap.set(mode.name, new Set());
      }
      modeMap.get(mode.name)!.add(variable.name);
    });
  });

  // Generate the types string for the interface
  let types = Array.from(modeMap.entries())
    .map(([modeName, collectionKeys]) => {
      // Create a union type from the set of collection names
      const unionType = Array.from(collectionKeys).join(`" | "`);
      return `  ${modeName}: "${unionType}";`;
    })
    .join("\n");

  // Return the interface string
  return `export interface VariableModeTypes {\n${types}\n}\n\n`;
};

const getLocalVariables = async ({
  file_key,
  access_token,
}: {
  access_token: string;
  file_key: string;
}) => {
  return await ky
    .get(`https://api.figma.com/v1/files/${file_key}/variables/local`, {
      headers: {
        "X-Figma-Token": access_token,
      },
    })
    .json<Figma.Api.VariableResult>();
};
(async () => {
  if (!process.env.FIGMA_TOKENS_PAT || !process.env.FIGMA_TOKENS_FILEKEY) {
    throw new Error(
      "FIGMA_TOKENS_PAT and FIGMA_TOKENS_FILEKEY environemnt variables are required"
    );
  }

  logger.info("Getting variables from Figma");

  const localVariables = await getLocalVariables({
    access_token: process.env.FIGMA_TOKENS_PAT,
    file_key: process.env.FIGMA_TOKENS_FILEKEY,
  });

  let outputDir = `${process.env.FIGMA_VARIABLES_PATH ?? "."}/_generated`;

  logger.info(`Writing variables to:`, outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  fs.writeFileSync(
    `${outputDir}/data.json`,
    JSON.stringify(localVariables, null, 2)
  );

  fs.writeFileSync(
    `${outputDir}/types.ts`,
    generateVariableTypeDefinitions(localVariables.meta.variables) +
      generateColorVariableTypeDefinitions(localVariables.meta.variables) +
      generateCollectionTypeDefinitions(
        localVariables.meta.variableCollections,
        localVariables.meta.variables
      ) +
      generateVariableModeTypeDefinitions(
        localVariables.meta.variableCollections,
        localVariables.meta.variables
      ) +
      generateCollectionModeTypeDefinitions(
        localVariables.meta.variableCollections
      ) +
      generateModeCollectionTypeDefinitions(
        localVariables.meta.variableCollections
      ) +
      generateModeVariableTypeDefinitions(
        localVariables.meta.variableCollections,
        localVariables.meta.variables
      )
  );

  logger.log("Sync'd variables from Figma");
})();
