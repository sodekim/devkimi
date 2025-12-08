import { invoke } from "@tauri-apps/api/core";

export function escapeText(input: string) {
  return invoke<string>("escape_text", { input });
}

export function unescapeText(input: string) {
  return invoke<string>("unescape_text", { input });
}
