import { invoke } from "@tauri-apps/api/core";

const convertJsonToYaml = (json: string) => {
  return invoke<string>("convert_json_to_yaml", { json });
};

const convertYamlToJson = (yaml: string) => {
  return invoke<string>("convert_yaml_to_json", { yaml });
};

export { convertJsonToYaml, convertYamlToJson };
