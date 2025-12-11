import { invoke } from "@tauri-apps/api/core";

export function showTray() {
  return invoke<void>("show_tray");
}

export function hideTray() {
  return invoke<void>("hide_tray");
}
