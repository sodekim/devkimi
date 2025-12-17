import { invoke } from "@tauri-apps/api/core";

const parseMarkdown =  (markdown: string) => {
  return invoke<string>("parse_markdown", { markdown });
};

export { parseMarkdown };
