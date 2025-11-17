import { invoke } from "@tauri-apps/api/core";

const convertYamlToProperties = async (yaml: string) => {
  return invoke<string>("convert_yaml_to_properties", { yaml });
};

const convertPropertiesToYaml = async (properties: string) => {
  return invoke<string>("convert_properties_to_yaml", { properties });
};

export { convertYamlToProperties, convertPropertiesToYaml };
