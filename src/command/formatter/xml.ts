import { invoke } from "@tauri-apps/api/core";

const formatXml = (input: string, indent: string) => {
  return invoke<string>("format_xml", { input, indent });
};

export { formatXml };
