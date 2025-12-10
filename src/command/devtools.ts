import { invoke } from "@tauri-apps/api/core";

export function openDevtools() {
  return invoke<void>("open_devtools");
}
