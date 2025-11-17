import { invoke } from "@tauri-apps/api/core";

const parseJsonPath = async (text: string, pattern: string) => {
  return invoke<string>("parse_jsonpath", { text, pattern });
};

export { parseJsonPath };
