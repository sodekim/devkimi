import { invoke } from "@tauri-apps/api/core";

const parseJsonPath =  (text: string, pattern: string) => {
  return invoke<string>("parse_jsonpath", { text, pattern });
};

export { parseJsonPath };
