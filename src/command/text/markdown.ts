import { invoke } from "@tauri-apps/api/core";

const parseMarkdown = async (markdown: string) => {
  return invoke<string>("parse_markdown", { markdown });
};

export { parseMarkdown };
